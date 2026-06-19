using Emprely.Application.Auth;
using Emprely.Api.Servicos;
using Emprely.Contracts.Account;
using Emprely.Contracts.Auth;
using Emprely.Domain.Contas;
using Emprely.Domain.Onboarding;
using Emprely.Domain.Propostas;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/account")]
public sealed class AccountController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;
    private readonly ILogoPerfilStorageService logoPerfilStorageService;

    public AccountController(
        ICurrentContaContext currentContaContext,
        EmprelyDbContext dbContext,
        ILogoPerfilStorageService logoPerfilStorageService)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
        this.logoPerfilStorageService = logoPerfilStorageService;
    }

    [HttpGet]
    public async Task<ActionResult<ContaAtualResponse>> GetContaAtual(
        CancellationToken cancellationToken)
    {
        var membroConta = await dbContext.MembrosConta
            .Include(membro => membro.Conta)
            .FirstOrDefaultAsync(
                membro =>
                    membro.UsuarioId == currentContaContext.UsuarioId &&
                    membro.ContaId == currentContaContext.ContaId,
                cancellationToken);

        if (membroConta?.Conta is null)
        {
            return NotFound();
        }

        return Ok(ContaAtualResponseBuilder.BuildContaAtualResponse(
            membroConta.Conta,
            membroConta.Papel.ToString()));
    }

    [HttpPost("activate-founder")]
    public ActionResult<ContaAtualResponse> ActivatePlanoFundador()
    {
        return StatusCode(
            StatusCodes.Status403Forbidden,
            new { message = "Plano Fundador e ativado por operacao administrativa no MVP." });
    }

    [HttpGet("profile")]
    public async Task<ActionResult<PerfilContaResponse>> GetPerfilContaAtual(
        CancellationToken cancellationToken)
    {
        var conta = await dbContext.Contas
            .Include(contaAtual => contaAtual.Perfil)
            .FirstOrDefaultAsync(
                contaAtual => contaAtual.Id == currentContaContext.ContaId,
                cancellationToken);

        if (conta is null)
        {
            return NotFound();
        }

        var emailUsuario = await dbContext.Users
            .Where(usuario => usuario.Id == currentContaContext.UsuarioId)
            .Select(usuario => usuario.Email)
            .FirstOrDefaultAsync(cancellationToken);

        return Ok(BuildPerfilContaResponse(conta, conta.Perfil, emailUsuario));
    }

    [HttpPut("profile")]
    public async Task<ActionResult<PerfilContaResponse>> UpdatePerfilConta(
        UpdatePerfilContaRequest request,
        CancellationToken cancellationToken)
    {
        if (!IsLogoUrlPerfilValida(request.LogoUrl))
        {
            return BadRequest(new { message = "Use uma URL de logo valida ou envie a imagem pelo upload." });
        }

        if (!TryParseTemplateVisualProposta(request.TemplateVisualPadrao, out var templateVisualPadrao))
        {
            return BadRequest(new { message = "Template visual padrao invalido." });
        }

        if (!TryParseFormatoArquivoPreferido(request.FormatoArquivoPreferido, out var formatoArquivoPreferido))
        {
            return BadRequest(new { message = "Formato de arquivo preferido invalido." });
        }

        var conta = await dbContext.Contas
            .Include(contaAtual => contaAtual.Perfil)
            .FirstOrDefaultAsync(
                contaAtual => contaAtual.Id == currentContaContext.ContaId,
                cancellationToken);

        if (conta is null)
        {
            return NotFound();
        }

        var emailUsuario = await dbContext.Users
            .Where(usuario => usuario.Id == currentContaContext.UsuarioId)
            .Select(usuario => usuario.Email)
            .FirstOrDefaultAsync(cancellationToken);

        var perfilConta = conta.Perfil;

        if (perfilConta is null)
        {
            perfilConta = PerfilConta.CreatePerfilConta(
                conta.Id,
                request.NomeComercial,
                emailUsuario,
                request.TelefoneContato,
                request.SiteUrl,
                request.Instagram,
                request.Documento,
                request.CorPrimaria,
                request.CorSecundaria,
                request.LogoUrl,
                templateVisualPadrao,
                request.CorSistemaPrimaria,
                request.CorSistemaSecundaria,
                formatoArquivoPreferido,
                segmento: request.Segmento,
                cidadeUf: request.CidadeUf);

            dbContext.PerfisConta.Add(perfilConta);
        }
        else
        {
            perfilConta.AtualizarPerfilConta(
                request.NomeComercial,
                emailUsuario,
                request.TelefoneContato,
                request.SiteUrl,
                request.Instagram,
                request.Documento,
                request.CorPrimaria,
                request.CorSecundaria,
                request.LogoUrl,
                templateVisualPadrao,
                request.CorSistemaPrimaria,
                request.CorSistemaSecundaria,
                formatoArquivoPreferido,
                segmento: request.Segmento,
                cidadeUf: request.CidadeUf);
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        if (OnboardingController.IsPerfilMinimoCompleto(perfilConta))
        {
            var onboarding = await GetOrCreateOnboardingAsync(cancellationToken);
            onboarding.MarcarConfiguracaoContaConcluida();
            dbContext.OnboardingEventos.Add(OnboardingEvento.Create(
                currentContaContext.ContaId,
                currentContaContext.UsuarioId,
                "ConcluiuConta",
                "configuracao"));
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(BuildPerfilContaResponse(conta, perfilConta, emailUsuario));
    }

    [HttpPost("profile/logo")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(LogoPerfilStorageService.TamanhoMaximoArquivoBytes + 64 * 1024)]
    public async Task<ActionResult<LogoPerfilUploadResponse>> UploadLogoPerfil(
        [FromForm(Name = "file")] IFormFile? file,
        CancellationToken cancellationToken)
    {
        if (file is null)
        {
            return BadRequest(new { message = "Anexe uma imagem para usar como logomarca." });
        }

        var contaId = await dbContext.Contas
            .AsNoTracking()
            .Where(contaAtual => contaAtual.Id == currentContaContext.ContaId)
            .Select(contaAtual => (Guid?)contaAtual.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (contaId is null)
        {
            return NotFound();
        }

        LogoPerfilStorageResultado upload;

        try
        {
            upload = await logoPerfilStorageService.SalvarLogoPerfilAsync(
                contaId.Value,
                file,
                cancellationToken);
        }
        catch (LogoPerfilStorageException exception)
        {
            return BadRequest(new { message = exception.Message });
        }

        return Ok(new LogoPerfilUploadResponse(
            upload.LogoUrl,
            upload.TamanhoOriginalBytes,
            upload.Largura,
            upload.Altura));
    }

    private static PerfilContaResponse BuildPerfilContaResponse(
        Conta conta,
        PerfilConta? perfilConta,
        string? emailUsuario)
    {
        return new PerfilContaResponse(
            perfilConta?.Id,
            conta.Id,
            perfilConta?.NomeComercial ?? conta.Nome,
            emailUsuario ?? perfilConta?.EmailContato,
            perfilConta?.TelefoneContato,
            perfilConta?.SiteUrl,
            perfilConta?.Instagram,
            perfilConta?.Documento,
            perfilConta?.CorPrimaria ?? PerfilConta.CorPrimariaPadrao,
            perfilConta?.CorSecundaria ?? PerfilConta.CorSecundariaPadrao,
            perfilConta?.LogoUrl,
            perfilConta?.UpdatedAt,
            (perfilConta?.TemplateVisualPadrao ?? TemplateVisualProposta.ComercialMinimalista).ToString(),
            perfilConta?.CorSistemaPrimaria ?? PerfilConta.CorSistemaPrimariaPadrao,
            perfilConta?.CorSistemaSecundaria ?? PerfilConta.CorSistemaSecundariaPadrao,
            perfilConta?.FormatoArquivoPreferido ?? PerfilConta.FormatoArquivoPreferidoPadrao,
            perfilConta?.Segmento,
            perfilConta?.CidadeUf);
    }

    private static bool TryParseTemplateVisualProposta(
        string? valor,
        out TemplateVisualProposta templateVisual)
    {
        if (string.IsNullOrWhiteSpace(valor))
        {
            templateVisual = TemplateVisualProposta.ComercialMinimalista;
            return true;
        }

        var valorNormalizado = valor.Trim();

        if (string.Equals(valorNormalizado, "PadraoEnxuto", StringComparison.OrdinalIgnoreCase))
        {
            templateVisual = TemplateVisualProposta.ComercialMinimalista;
            return true;
        }

        return Enum.TryParse(valorNormalizado, ignoreCase: true, out templateVisual)
            && Enum.IsDefined(templateVisual);
    }

    private static bool TryParseFormatoArquivoPreferido(
        string? valor,
        out string formatoArquivoPreferido)
    {
        if (string.IsNullOrWhiteSpace(valor))
        {
            formatoArquivoPreferido = PerfilConta.FormatoArquivoPreferidoPadrao;
            return true;
        }

        var valorNormalizado = valor.Trim();

        if (valorNormalizado.Equals(PerfilConta.FormatoArquivoPreferidoPadrao, StringComparison.OrdinalIgnoreCase))
        {
            formatoArquivoPreferido = PerfilConta.FormatoArquivoPreferidoPadrao;
            return true;
        }

        if (valorNormalizado.Equals(PerfilConta.FormatoArquivoPreferidoImagem, StringComparison.OrdinalIgnoreCase))
        {
            formatoArquivoPreferido = PerfilConta.FormatoArquivoPreferidoImagem;
            return true;
        }

        if (valorNormalizado.Equals(PerfilConta.FormatoArquivoPreferidoPdfImagem, StringComparison.OrdinalIgnoreCase))
        {
            formatoArquivoPreferido = PerfilConta.FormatoArquivoPreferidoPdfImagem;
            return true;
        }

        formatoArquivoPreferido = PerfilConta.FormatoArquivoPreferidoPadrao;
        return false;
    }

    private static bool IsLogoUrlPerfilValida(string? logoUrl)
    {
        var valor = logoUrl?.Trim();

        if (string.IsNullOrWhiteSpace(valor))
        {
            return true;
        }

        if (valor.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        if (valor.StartsWith("/uploads/account-logos/", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        return Uri.TryCreate(valor, UriKind.Absolute, out var uri)
            && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    private async Task<OnboardingUsuario> GetOrCreateOnboardingAsync(CancellationToken cancellationToken)
    {
        var onboarding = await dbContext.OnboardingUsuarios.FirstOrDefaultAsync(
            item =>
                item.ContaId == currentContaContext.ContaId &&
                item.UsuarioId == currentContaContext.UsuarioId,
            cancellationToken);

        if (onboarding is not null)
        {
            return onboarding;
        }

        onboarding = OnboardingUsuario.Create(currentContaContext.ContaId, currentContaContext.UsuarioId);
        dbContext.OnboardingUsuarios.Add(onboarding);
        return onboarding;
    }
}
