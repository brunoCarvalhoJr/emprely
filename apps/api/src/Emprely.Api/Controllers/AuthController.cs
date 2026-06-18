using Emprely.Api.Auth;
using Emprely.Api.Comunicacoes;
using Emprely.Api.Configuracoes;
using Emprely.Application.Comunicacoes;
using Emprely.Contracts.Auth;
using Emprely.Domain.Comunicacoes;
using Emprely.Domain.Contas;
using Emprely.Infrastructure.Identity;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace Emprely.Api.Controllers;

[ApiController]
[EnableRateLimiting(RateLimitAplicacaoOptions.AuthPolicyName)]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<UsuarioAplicacao> userManager;
    private readonly EmprelyDbContext dbContext;
    private readonly IJwtTokenService jwtTokenService;
    private readonly IEmailTransacionalService emailTransacionalService;
    private readonly AppPublicOptions appPublicOptions;

    public AuthController(
        UserManager<UsuarioAplicacao> userManager,
        EmprelyDbContext dbContext,
        IJwtTokenService jwtTokenService,
        IEmailTransacionalService emailTransacionalService,
        IOptions<AppPublicOptions> appPublicOptions)
    {
        this.userManager = userManager;
        this.dbContext = dbContext;
        this.jwtTokenService = jwtTokenService;
        this.emailTransacionalService = emailTransacionalService;
        this.appPublicOptions = appPublicOptions.Value;
    }

    [HttpPost("register")]
    public async Task<ActionResult<RegisterUsuarioResponse>> RegisterUsuario(
        RegisterUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var telefone = request.Telefone.Trim();
        var usuarioExistente = await userManager.FindByEmailAsync(email);

        if (usuarioExistente is not null)
        {
            ModelState.AddModelError(nameof(request.Email), "E-mail já cadastrado.");
            return ValidationProblem(ModelState);
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        var usuario = new UsuarioAplicacao
        {
            Id = Guid.CreateVersion7(),
            Nome = request.Nome.Trim(),
            UserName = email,
            Email = email,
            EmailConfirmed = false,
            PhoneNumber = telefone,
        };

        var createUsuarioResult = await userManager.CreateAsync(usuario, request.Senha);

        if (!createUsuarioResult.Succeeded)
        {
            foreach (var error in createUsuarioResult.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        var conta = Conta.CreateConta(request.NomeConta);
        var membroConta = MembroConta.CreateOwner(conta.Id, usuario.Id);
        var perfilConta = PerfilConta.CreatePerfilConta(
            conta.Id,
            request.NomeConta,
            email,
            telefone,
            null,
            null,
            null,
            PerfilConta.CorPrimariaPadrao,
            PerfilConta.CorSecundariaPadrao,
            null);

        dbContext.Contas.Add(conta);
        dbContext.MembrosConta.Add(membroConta);
        dbContext.PerfisConta.Add(perfilConta);

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        await EnviarConfirmacaoEmailAsync(usuario, conta.Id, cancellationToken);

        return Ok(new RegisterUsuarioResponse(
            usuario.Id,
            email,
            EmailConfirmationRequired: true,
            "Cadastro criado. Confirme seu e-mail para entrar."));
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmailUsuario(
        ConfirmEmailUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var usuario = await userManager.FindByIdAsync(request.UsuarioId.ToString());

        if (usuario is null)
        {
            return BadRequest(new { message = "Link de confirmação inválido ou expirado." });
        }

        var acessoNegado = await BuildRespostaAcessoNegadoAsync(usuario, cancellationToken);
        if (acessoNegado is not null)
        {
            return acessoNegado;
        }

        var token = DecodeTokenUrl(request.Token);
        var result = await userManager.ConfirmEmailAsync(usuario, token);

        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Link de confirmação inválido ou expirado." });
        }

        var membroConta = await dbContext.MembrosConta
            .FirstOrDefaultAsync(membro => membro.UsuarioId == usuario.Id, cancellationToken);

        await EnviarBoasVindasAsync(usuario, membroConta?.ContaId, cancellationToken);

        return NoContent();
    }

    [HttpPost("resend-confirmation")]
    public async Task<IActionResult> ResendConfirmacaoEmail(
        ResendConfirmacaoEmailRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var usuario = await userManager.FindByEmailAsync(email);

        if (usuario is { EmailConfirmed: false })
        {
            var membroConta = await dbContext.MembrosConta
                .FirstOrDefaultAsync(membro => membro.UsuarioId == usuario.Id, cancellationToken);
            await EnviarConfirmacaoEmailAsync(usuario, membroConta?.ContaId, cancellationToken);
        }

        return NoContent();
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotSenhaUsuario(
        ForgotSenhaUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var usuario = await userManager.FindByEmailAsync(email);

        if (usuario is not null)
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(usuario);
            var tokenUrl = EncodeTokenUrl(token);
            var resetUrl = BuildPublicWebUrl($"?auth=reset-password&userId={usuario.Id}&token={Uri.EscapeDataString(tokenUrl)}");

            var membroConta = await dbContext.MembrosConta
                .FirstOrDefaultAsync(membro => membro.UsuarioId == usuario.Id, cancellationToken);

            await emailTransacionalService.EnviarAsync(
                BuildEmail(
                    membroConta?.ContaId,
                    usuario.Id,
                    TipoEmailTransacional.RecuperacaoSenha,
                    usuario.Email ?? email,
                    "Redefina sua senha no Emprely",
                    $"Recebemos uma solicitação para redefinir sua senha. O link vale por 1 hora: {resetUrl}",
                    BuildTokenHash(token)),
                cancellationToken);
        }

        return NoContent();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetSenhaUsuario(
        ResetSenhaUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        if (request.NovaSenha != request.ConfirmarNovaSenha)
        {
            ModelState.AddModelError(nameof(request.ConfirmarNovaSenha), "A confirmação da nova senha não confere.");
            return ValidationProblem(ModelState);
        }

        var usuario = await userManager.FindByIdAsync(request.UsuarioId.ToString());

        var token = DecodeTokenUrl(request.Token);

        if (usuario is null || !await ResetSenhaDentroDaValidadeAsync(usuario.Id, token, cancellationToken))
        {
            return BadRequest(new { message = "Link de redefinição inválido ou expirado." });
        }

        var result = await userManager.ResetPasswordAsync(usuario, token, request.NovaSenha);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        return NoContent();
    }

    [HttpPost("confirm-change-email")]
    public async Task<IActionResult> ConfirmChangeEmailUsuario(
        ConfirmChangeEmailUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var usuario = await userManager.FindByIdAsync(request.UsuarioId.ToString());

        if (usuario is null)
        {
            return BadRequest(new { message = "Link de alteração de e-mail inválido ou expirado." });
        }

        var alteracaoPendente = await dbContext.EmailsAlteracaoPendente
            .Where(alteracao => alteracao.UsuarioId == usuario.Id && !alteracao.Confirmado)
            .OrderByDescending(alteracao => alteracao.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (alteracaoPendente is null)
        {
            return BadRequest(new { message = "Link de alteração de e-mail inválido ou expirado." });
        }

        var token = DecodeTokenUrl(request.Token);
        var result = await userManager.ChangeEmailAsync(usuario, alteracaoPendente.NovoEmail, token);

        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Link de alteração de e-mail inválido ou expirado." });
        }

        await userManager.SetUserNameAsync(usuario, alteracaoPendente.NovoEmail);
        alteracaoPendente.Confirmar();
        await dbContext.SaveChangesAsync(cancellationToken);

        await emailTransacionalService.EnviarAsync(
            BuildEmail(
                null,
                usuario.Id,
                TipoEmailTransacional.AvisoEmailAlterado,
                alteracaoPendente.EmailAtual,
                "Seu e-mail de acesso foi alterado",
                $"O e-mail de acesso do Emprely foi alterado para {alteracaoPendente.NovoEmail}."),
            cancellationToken);

        return NoContent();
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthUsuarioResponse>> LoginUsuario(
        LoginUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        
        var usuario = await userManager.FindByEmailAsync(email);

        if (usuario is null)
        {
            return Unauthorized(new { message = "E-mail ou senha inválidos." });
        }

        var senhaValida = await userManager.CheckPasswordAsync(usuario, request.Senha);

        if (!senhaValida)
        {
            return Unauthorized(new { message = "E-mail ou senha inválidos." });
        }

        var membroConta = await dbContext.MembrosConta
            .Include(membro => membro.Conta)
            .Where(membro => membro.UsuarioId == usuario.Id)
            .OrderBy(membro => membro.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (membroConta?.Conta is null)
        {
            return Unauthorized(new { message = "Usuário sem conta ativa." });
        }

        if (usuario.BloqueadoAdministrativamenteAt is not null || usuario.LockoutEnd > DateTimeOffset.UtcNow)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { code = "UsuarioBloqueado", message = "Conta Bloqueada" });
        }

        if (membroConta.Status != StatusMembroConta.Ativo)
        {
            return Unauthorized(new { message = "Usuario sem conta ativa." });
        }

        if (membroConta.Conta.Status != StatusConta.Ativa)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { code = "ContaSuspensa", message = "Conta Suspensa" });
        }

        if (!usuario.EmailConfirmed)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { code = "EmailNotConfirmed", message = "Confirme seu e-mail antes de entrar." });
        }

        var agora = DateTimeOffset.UtcNow;
        var diasGratisAtivo = await dbContext.DiasGratisConta.AnyAsync(
            dias => dias.ContaId == membroConta.Conta.Id && dias.InicioAt <= agora && dias.FimAt > agora,
            cancellationToken);

        return Ok(BuildAuthUsuarioResponse(
            usuario,
            membroConta.Conta,
            membroConta.Papel.ToString(),
            diasGratisAtivo));
    }

    private async Task EnviarConfirmacaoEmailAsync(
        UsuarioAplicacao usuario,
        Guid? contaId,
        CancellationToken cancellationToken)
    {
        var token = await userManager.GenerateEmailConfirmationTokenAsync(usuario);
        var tokenUrl = EncodeTokenUrl(token);
        var confirmUrl = BuildPublicWebUrl($"?auth=confirm-email&userId={usuario.Id}&token={Uri.EscapeDataString(tokenUrl)}");

        await emailTransacionalService.EnviarAsync(
            BuildEmail(
                contaId,
                usuario.Id,
                TipoEmailTransacional.ConfirmacaoEmail,
                usuario.Email ?? string.Empty,
                "Confirme seu e-mail no Emprely",
                $"Confirme seu e-mail para acessar o Emprely. O link vale por 24 horas: {confirmUrl}"),
            cancellationToken);
    }

    private async Task EnviarBoasVindasAsync(
        UsuarioAplicacao usuario,
        Guid? contaId,
        CancellationToken cancellationToken)
    {
        await emailTransacionalService.EnviarAsync(
            BuildEmail(
                contaId,
                usuario.Id,
                TipoEmailTransacional.BoasVindas,
                usuario.Email ?? string.Empty,
                "Boas-vindas ao Emprely",
                "Seu e-mail foi confirmado. Agora você pode entrar no Emprely e criar propostas profissionais."),
            cancellationToken);

        await emailTransacionalService.EnviarAsync(
            BuildEmail(
                contaId,
                usuario.Id,
                TipoEmailTransacional.TrialIniciado,
                usuario.Email ?? string.Empty,
                "Seu teste do Emprely começou",
                "Seu teste de 7 dias começou. Use este período para criar clientes, serviços e propostas."),
            cancellationToken);
    }

    private async Task<bool> ResetSenhaDentroDaValidadeAsync(
        Guid usuarioId,
        string token,
        CancellationToken cancellationToken)
    {
        var limite = DateTimeOffset.UtcNow.AddHours(-1);
        var tokenHash = BuildTokenHash(token);

        return await dbContext.EmailsTransacionais.AnyAsync(
            email =>
                email.UsuarioId == usuarioId &&
                email.Tipo == TipoEmailTransacional.RecuperacaoSenha &&
                email.TokenHash == tokenHash &&
                email.CreatedAt >= limite,
            cancellationToken);
    }

    private EmailTransacionalMensagem BuildEmail(
        Guid? contaId,
        Guid? usuarioId,
        TipoEmailTransacional tipo,
        string destinatario,
        string assunto,
        string texto,
        string? tokenHash = null)
    {
        return EmailTransacionalTemplateBuilder.Build(
            contaId,
            usuarioId,
            tipo,
            destinatario,
            assunto,
            texto,
            appPublicOptions.PublicWebUrl,
            tokenHash);
    }

    private string BuildPublicWebUrl(string pathAndQuery)
    {
        var baseUrl = appPublicOptions.PublicWebUrl.Trim().TrimEnd('/');
        return $"{baseUrl}/{pathAndQuery.TrimStart('/')}";
    }

    private static string EncodeTokenUrl(string token)
    {
        return WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
    }

    private static string DecodeTokenUrl(string token)
    {
        return Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
    }

    private static string BuildTokenHash(string token)
    {
        var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hashBytes);
    }

    private AuthUsuarioResponse BuildAuthUsuarioResponse(
        UsuarioAplicacao usuario,
        Conta conta,
        string papel,
        bool diasGratisAtivo)
    {
        var token = jwtTokenService.GenerateTokenUsuario(
            usuario.Id,
            usuario.Nome,
            usuario.Email ?? string.Empty,
            conta.Id,
            papel);

        return new AuthUsuarioResponse(
            token.AccessToken,
            token.ExpiresAtUtc,
            new UsuarioAtualResponse(usuario.Id, usuario.Nome, usuario.Email ?? string.Empty),
            ContaAtualResponseBuilder.BuildContaAtualResponse(conta, papel, diasGratisAtivo));
    }

    private async Task<ObjectResult?> BuildRespostaAcessoNegadoAsync(
        UsuarioAplicacao usuario,
        CancellationToken cancellationToken)
    {
        if (usuario.BloqueadoAdministrativamenteAt is not null || usuario.LockoutEnd > DateTimeOffset.UtcNow)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { code = "UsuarioBloqueado", message = "Conta Bloqueada" });
        }

        var conta = await dbContext.MembrosConta
            .Include(membro => membro.Conta)
            .Where(membro => membro.UsuarioId == usuario.Id)
            .OrderBy(membro => membro.CreatedAt)
            .Select(membro => membro.Conta)
            .FirstOrDefaultAsync(cancellationToken);

        if (conta is { Status: not StatusConta.Ativa })
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { code = "ContaSuspensa", message = "Conta Suspensa" });
        }

        return null;
    }
}
