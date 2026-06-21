using System.Security.Cryptography;
using System.Text;
using Emprely.Api.Comunicacoes;
using Emprely.Api.Configuracoes;
using Emprely.Application.Comunicacoes;
using Emprely.Contracts.Admin;
using Emprely.Domain.Comunicacoes;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Identity;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Emprely.Api.Controllers;

[ApiController]
[EnableRateLimiting(RateLimitAplicacaoOptions.AdminPolicyName)]
[Route("api/admin/emails")]
public sealed class AdminEmailsController : AdminControllerBase
{
    private readonly AdminOperacoesOptions adminOperacoesOptions;
    private readonly EmprelyDbContext dbContext;
    private readonly UserManager<UsuarioAplicacao> userManager;
    private readonly IEmailTransacionalService emailTransacionalService;
    private readonly AppPublicOptions appPublicOptions;

    public AdminEmailsController(
        IOptions<AdminOperacoesOptions> adminOperacoesOptions,
        EmprelyDbContext dbContext,
        UserManager<UsuarioAplicacao> userManager,
        IEmailTransacionalService emailTransacionalService,
        IOptions<AppPublicOptions> appPublicOptions)
    {
        this.adminOperacoesOptions = adminOperacoesOptions.Value;
        this.dbContext = dbContext;
        this.userManager = userManager;
        this.emailTransacionalService = emailTransacionalService;
        this.appPublicOptions = appPublicOptions.Value;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AdminEmailHistoricoResponse>>> GetHistoricoEmails(
        CancellationToken cancellationToken)
    {
        var validarAcessoResult = ValidarAcessoAdmin(out _);
        if (validarAcessoResult is not null)
        {
            return validarAcessoResult;
        }

        var emails = await dbContext.EmailsTransacionais
            .OrderByDescending(email => email.CreatedAt)
            .Take(100)
            .ToListAsync(cancellationToken);

        return Ok(emails.Select(email => new AdminEmailHistoricoResponse(
                email.Id,
                email.ContaId,
                email.UsuarioId,
                email.Tipo.ToString(),
                MascararEmail(email.Destinatario),
                email.Status.ToString(),
                email.ProviderMessageId,
                email.Erro,
                email.CreatedAt))
            .ToList());
    }

    [HttpPost("resend-confirmation")]
    public async Task<IActionResult> ResendConfirmacaoEmail(
        AdminResendConfirmacaoEmailRequest request,
        CancellationToken cancellationToken)
    {
        var validarAcessoResult = ValidarAcessoAdmin(out var adminAtual);
        if (validarAcessoResult is not null)
        {
            return validarAcessoResult;
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var usuario = await userManager.FindByEmailAsync(email);

        if (usuario is { EmailConfirmed: false })
        {
            var membroConta = await dbContext.MembrosConta
                .FirstOrDefaultAsync(membro => membro.UsuarioId == usuario.Id, cancellationToken);
            var token = await userManager.GenerateEmailConfirmationTokenAsync(usuario);
            var tokenUrl = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var confirmUrl = BuildPublicWebUrl($"?auth=confirm-email&userId={usuario.Id}&token={Uri.EscapeDataString(tokenUrl)}");

            await emailTransacionalService.EnviarAsync(
                BuildEmail(
                    membroConta?.ContaId,
                    usuario.Id,
                    TipoEmailTransacional.ConfirmacaoEmail,
                    usuario.Email ?? email,
                    "Confirme seu e-mail no Emprely",
                    $"Confirme seu e-mail para acessar o Emprely. O link vale por 24 horas: {confirmUrl}"),
                cancellationToken);
        }

        if (adminAtual is not null)
        {
            await RegistrarAuditoriaAsync(
                dbContext,
                adminAtual,
                "AdminReenviarConfirmacaoEmail",
                "Usuario",
                usuario?.Id,
                "Reenvio de confirmacao solicitado pelo painel administrativo.",
                $"Destinatario: {MascararEmail(email)}",
                cancellationToken);
        }

        return NoContent();
    }

    private ActionResult? ValidarAcessoAdmin(out AdminAtualContext? adminAtual)
    {
        adminAtual = null;

        if (User.Identity?.IsAuthenticated == true)
        {
            try
            {
                adminAtual = GetAdminAtual();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Sessao administrativa invalida." });
            }

            return ExigirSuperAdmin(adminAtual);
        }

        return ValidarAdminKey();
    }

    private ActionResult? ValidarAdminKey()
    {
        var adminKeyConfigurada = adminOperacoesOptions.OperationsKey.Trim();

        if (adminKeyConfigurada.Length < 32)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                new { message = "AdminOperacoes:OperationsKey deve ter pelo menos 32 caracteres." });
        }

        if (!Request.Headers.TryGetValue(AdminOperacoesOptions.HeaderName, out var adminKeyRecebida) ||
            string.IsNullOrWhiteSpace(adminKeyRecebida))
        {
            return Unauthorized(new { message = "Chave administrativa obrigatória." });
        }

        if (!IsAdminKeyValida(adminKeyRecebida.ToString(), adminKeyConfigurada))
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Chave administrativa inválida." });
        }

        return null;
    }

    private string BuildPublicWebUrl(string pathAndQuery)
    {
        var baseUrl = appPublicOptions.PublicWebUrl.Trim().TrimEnd('/');
        return $"{baseUrl}/{pathAndQuery.TrimStart('/')}";
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

    private static bool IsAdminKeyValida(string adminKeyRecebida, string adminKeyConfigurada)
    {
        var adminKeyRecebidaBytes = Encoding.UTF8.GetBytes(adminKeyRecebida.Trim());
        var adminKeyConfiguradaBytes = Encoding.UTF8.GetBytes(adminKeyConfigurada);

        return adminKeyRecebidaBytes.Length == adminKeyConfiguradaBytes.Length &&
            CryptographicOperations.FixedTimeEquals(adminKeyRecebidaBytes, adminKeyConfiguradaBytes);
    }

    private static string MascararEmail(string email)
    {
        var partes = email.Split('@', 2);
        if (partes.Length != 2 || partes[0].Length == 0)
        {
            return "email-mascarado";
        }

        return $"{partes[0][0]}***@{partes[1]}";
    }
}
