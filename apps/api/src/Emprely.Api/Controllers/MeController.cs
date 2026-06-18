using Emprely.Api.Comunicacoes;
using Emprely.Application.Auth;
using Emprely.Application.Comunicacoes;
using Emprely.Contracts.Auth;
using Emprely.Domain.Contas;
using Emprely.Domain.Comunicacoes;
using Emprely.Infrastructure.Identity;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/me")]
public sealed class MeController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;
    private readonly UserManager<UsuarioAplicacao> userManager;
    private readonly IEmailTransacionalService emailTransacionalService;
    private readonly AppPublicOptions appPublicOptions;

    public MeController(
        ICurrentContaContext currentContaContext,
        EmprelyDbContext dbContext,
        UserManager<UsuarioAplicacao> userManager,
        IEmailTransacionalService emailTransacionalService,
        IOptions<AppPublicOptions> appPublicOptions)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
        this.userManager = userManager;
        this.emailTransacionalService = emailTransacionalService;
        this.appPublicOptions = appPublicOptions.Value;
    }

    [HttpGet]
    public async Task<ActionResult<MeUsuarioResponse>> GetUsuarioAtual(
        CancellationToken cancellationToken)
    {
        var usuario = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == currentContaContext.UsuarioId, cancellationToken);

        var membroConta = await dbContext.MembrosConta
            .Include(membro => membro.Conta)
            .FirstOrDefaultAsync(
                membro =>
                    membro.UsuarioId == currentContaContext.UsuarioId &&
                    membro.ContaId == currentContaContext.ContaId,
                cancellationToken);

        if (usuario is null || membroConta?.Conta is null)
        {
            return Unauthorized();
        }

        if (usuario.BloqueadoAdministrativamenteAt is not null || usuario.LockoutEnd > DateTimeOffset.UtcNow)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { code = "UsuarioBloqueado", message = "Conta Bloqueada" });
        }

        if (membroConta.Conta.Status != StatusConta.Ativa)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { code = "ContaSuspensa", message = "Conta Suspensa" });
        }

        var agora = DateTimeOffset.UtcNow;
        var diasGratisAtivo = await dbContext.DiasGratisConta.AnyAsync(
            dias => dias.ContaId == membroConta.Conta.Id && dias.InicioAt <= agora && dias.FimAt > agora,
            cancellationToken);

        return Ok(new MeUsuarioResponse(
            new UsuarioAtualResponse(
                usuario.Id,
                usuario.Nome,
                usuario.Email ?? string.Empty),
            ContaAtualResponseBuilder.BuildContaAtualResponse(
                membroConta.Conta,
                membroConta.Papel.ToString(),
                diasGratisAtivo)));
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangeSenhaUsuario(
        ChangeSenhaUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        if (request.NovaSenha != request.ConfirmarNovaSenha)
        {
            ModelState.AddModelError(
                nameof(request.ConfirmarNovaSenha),
                "A confirmação da nova senha não confere.");
            return ValidationProblem(ModelState);
        }

        var usuario = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == currentContaContext.UsuarioId, cancellationToken);

        if (usuario is null)
        {
            return Unauthorized();
        }

        var result = await userManager.ChangePasswordAsync(
            usuario,
            request.SenhaAtual,
            request.NovaSenha);

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

    [HttpPut("email")]
    public async Task<IActionResult> SolicitarAlteracaoEmailUsuario(
        ChangeEmailUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var novoEmail = request.NovoEmail.Trim().ToLowerInvariant();
        var usuario = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == currentContaContext.UsuarioId, cancellationToken);

        if (usuario is null)
        {
            return Unauthorized();
        }

        if (string.Equals(usuario.Email, novoEmail, StringComparison.OrdinalIgnoreCase))
        {
            return NoContent();
        }

        var usuarioExistente = await userManager.FindByEmailAsync(novoEmail);
        if (usuarioExistente is not null)
        {
            ModelState.AddModelError(nameof(request.NovoEmail), "E-mail já cadastrado.");
            return ValidationProblem(ModelState);
        }

        var alteracaoPendente = EmailAlteracaoPendente.Create(
            usuario.Id,
            usuario.Email ?? string.Empty,
            novoEmail);
        dbContext.EmailsAlteracaoPendente.Add(alteracaoPendente);
        await dbContext.SaveChangesAsync(cancellationToken);

        var token = await userManager.GenerateChangeEmailTokenAsync(usuario, novoEmail);
        var tokenUrl = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        var confirmUrl = BuildPublicWebUrl($"?auth=confirm-change-email&userId={usuario.Id}&token={Uri.EscapeDataString(tokenUrl)}");

        await emailTransacionalService.EnviarAsync(
            BuildEmail(
                currentContaContext.ContaId,
                usuario.Id,
                TipoEmailTransacional.AlteracaoEmail,
                novoEmail,
                "Confirme seu novo e-mail no Emprely",
                $"Confirme este novo e-mail de acesso ao Emprely: {confirmUrl}"),
            cancellationToken);

        return NoContent();
    }

    private EmailTransacionalMensagem BuildEmail(
        Guid? contaId,
        Guid? usuarioId,
        TipoEmailTransacional tipo,
        string destinatario,
        string assunto,
        string texto)
    {
        return EmailTransacionalTemplateBuilder.Build(
            contaId,
            usuarioId,
            tipo,
            destinatario,
            assunto,
            texto,
            appPublicOptions.PublicWebUrl);
    }

    private string BuildPublicWebUrl(string pathAndQuery)
    {
        var baseUrl = appPublicOptions.PublicWebUrl.Trim().TrimEnd('/');
        return $"{baseUrl}/{pathAndQuery.TrimStart('/')}";
    }
}
