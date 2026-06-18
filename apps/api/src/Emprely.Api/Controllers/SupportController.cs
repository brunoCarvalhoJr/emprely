using Emprely.Application.Auth;
using Emprely.Application.Comunicacoes;
using Emprely.Api.Comunicacoes;
using Emprely.Api.Configuracoes;
using Emprely.Contracts.Suporte;
using Emprely.Domain.Comunicacoes;
using Emprely.Domain.Suporte;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/support")]
public sealed class SupportController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;
    private readonly IEmailTransacionalService emailTransacionalService;
    private readonly EmailTransacionalOptions emailOptions;
    private readonly AppPublicOptions appPublicOptions;

    public SupportController(
        ICurrentContaContext currentContaContext,
        EmprelyDbContext dbContext,
        IEmailTransacionalService emailTransacionalService,
        IOptions<EmailTransacionalOptions> emailOptions,
        IOptions<AppPublicOptions> appPublicOptions)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
        this.emailTransacionalService = emailTransacionalService;
        this.emailOptions = emailOptions.Value;
        this.appPublicOptions = appPublicOptions.Value;
    }

    [AllowAnonymous]
    [EnableRateLimiting(RateLimitAplicacaoOptions.PublicSupportPolicyName)]
    [HttpPost("public")]
    public async Task<ActionResult<ContatoPublicoResponse>> CreateContatoPublico(
        CreateContatoPublicoRequest request,
        CancellationToken cancellationToken)
    {
        var texto = $"""
            Nome: {request.Nome.Trim()}
            Email: {request.Email.Trim().ToLowerInvariant()}
            Telefone: {ValorOpcional(request.Telefone)}
            Empresa: {ValorOpcional(request.Empresa)}
            Interesse: {request.Interesse.Trim()}

            Mensagem:
            {request.Mensagem.Trim()}
            """;

        await emailTransacionalService.EnviarAsync(
            BuildEmail(
                null,
                null,
                TipoEmailTransacional.SuporteRecebido,
                emailOptions.SuporteDestinoEmail,
                $"Contato público Emprely: {request.Interesse.Trim()}",
                texto),
            cancellationToken);

        return Ok(new ContatoPublicoResponse("Recebemos sua mensagem."));
    }

    [HttpPost]
    public async Task<ActionResult<SuporteSolicitacaoResponse>> CreateSuporteSolicitacao(
        CreateSuporteSolicitacaoRequest request,
        CancellationToken cancellationToken)
    {
        var usuario = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == currentContaContext.UsuarioId, cancellationToken);

        if (usuario is null)
        {
            return Unauthorized();
        }

        var solicitacao = SuporteSolicitacao.Create(
            currentContaContext.ContaId,
            usuario.Id,
            usuario.Nome,
            usuario.Email ?? string.Empty,
            request.Assunto,
            request.Mensagem);

        dbContext.SuporteSolicitacoes.Add(solicitacao);
        await dbContext.SaveChangesAsync(cancellationToken);

        await emailTransacionalService.EnviarAsync(
            BuildEmail(
                currentContaContext.ContaId,
                usuario.Id,
                TipoEmailTransacional.SuporteRecebido,
                emailOptions.SuporteDestinoEmail,
                $"Suporte Emprely: {solicitacao.Assunto}",
                $"Solicitação de {usuario.Nome} ({usuario.Email})\n\n{solicitacao.Mensagem}"),
            cancellationToken);

        return Ok(new SuporteSolicitacaoResponse(
            solicitacao.Id,
            solicitacao.Assunto,
            solicitacao.Status.ToString(),
            solicitacao.CreatedAt));
    }

    private static string ValorOpcional(string? valor)
    {
        var texto = valor?.Trim();
        return string.IsNullOrWhiteSpace(texto) ? "Não informado" : texto;
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
}
