using Emprely.Application.Auth;
using Emprely.Contracts.Onboarding;
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
[Route("api/onboarding")]
public sealed class OnboardingController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;

    public OnboardingController(ICurrentContaContext currentContaContext, EmprelyDbContext dbContext)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<OnboardingResponse>> GetOnboarding(CancellationToken cancellationToken)
    {
        var onboarding = await GetOrCreateOnboardingAsync(cancellationToken);
        var progresso = await BuildProgressoDerivadoAsync(cancellationToken);

        AplicarConclusoesDerivadas(onboarding, progresso);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(BuildResponse(onboarding, progresso));
    }

    [HttpPatch]
    public async Task<ActionResult<OnboardingResponse>> UpdateOnboarding(
        UpdateOnboardingRequest request,
        CancellationToken cancellationToken)
    {
        var onboarding = await GetOrCreateOnboardingAsync(cancellationToken);

        if (request.LimparPropostaRascunhoId && request.PropostaRascunhoId.HasValue)
        {
            return BadRequest(new { message = "Informe apenas um rascunho ou a limpeza do rascunho." });
        }

        if (request.PropostaRascunhoId.HasValue)
        {
            var propostaExiste = await dbContext.Propostas.AnyAsync(
                proposta =>
                    proposta.Id == request.PropostaRascunhoId.Value &&
                    proposta.ContaId == currentContaContext.ContaId,
                cancellationToken);

            if (!propostaExiste)
            {
                return BadRequest(new { message = "Rascunho de proposta invalido." });
            }
        }

        try
        {
            onboarding.Atualizar(
                request.StatusConfiguracaoConta,
                request.EtapaConfiguracaoConta,
                request.StatusPrimeiraProposta,
                request.EtapaPrimeiraProposta,
                request.PropostaRascunhoId,
                request.StatusTour,
                request.LimparPropostaRascunhoId);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        var progresso = await BuildProgressoDerivadoAsync(cancellationToken);
        return Ok(BuildResponse(onboarding, progresso));
    }

    [HttpPost("events")]
    public async Task<ActionResult<OnboardingResponse>> CreateEvento(
        CreateOnboardingEventoRequest request,
        CancellationToken cancellationToken)
    {
        var onboarding = await GetOrCreateOnboardingAsync(cancellationToken);

        try
        {
            if (request.Tipo.Equals("ConcluiuPrimeiraProposta", StringComparison.OrdinalIgnoreCase))
            {
                if (!request.PropostaId.HasValue)
                {
                    return BadRequest(new { message = "Proposta obrigatoria para concluir o onboarding." });
                }

                var propostaExiste = await dbContext.Propostas.AnyAsync(
                    proposta =>
                        proposta.Id == request.PropostaId.Value &&
                        proposta.ContaId == currentContaContext.ContaId,
                    cancellationToken);

                if (!propostaExiste)
                {
                    return BadRequest(new { message = "Proposta invalida para concluir o onboarding." });
                }

                onboarding.MarcarPrimeiraPropostaConcluida(request.PropostaId.Value);
            }
            else
            {
                onboarding.RegistrarEvento(request.Tipo);
            }

            dbContext.OnboardingEventos.Add(OnboardingEvento.Create(
                currentContaContext.ContaId,
                currentContaContext.UsuarioId,
                request.Tipo,
                request.Etapa,
                request.PropostaId));
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        var progresso = await BuildProgressoDerivadoAsync(cancellationToken);
        return Ok(BuildResponse(onboarding, progresso));
    }

    internal static bool IsPerfilMinimoCompleto(PerfilConta? perfilConta)
    {
        return perfilConta is not null &&
            !string.IsNullOrWhiteSpace(perfilConta.NomeComercial) &&
            !string.IsNullOrWhiteSpace(perfilConta.TelefoneContato) &&
            !string.IsNullOrWhiteSpace(perfilConta.EmailContato) &&
            !string.IsNullOrWhiteSpace(perfilConta.Segmento) &&
            !string.IsNullOrWhiteSpace(perfilConta.CorPrimaria) &&
            !string.IsNullOrWhiteSpace(perfilConta.CorSecundaria) &&
            !string.IsNullOrWhiteSpace(perfilConta.FormatoArquivoPreferido) &&
            Enum.IsDefined(perfilConta.TemplateVisualPadrao);
    }

    internal async Task MarcarConfiguracaoContaConcluidaAsync(CancellationToken cancellationToken)
    {
        var onboarding = await GetOrCreateOnboardingAsync(cancellationToken);
        onboarding.MarcarConfiguracaoContaConcluida();
    }

    internal async Task MarcarPrimeiraPropostaConcluidaAsync(Guid propostaId, CancellationToken cancellationToken)
    {
        var onboarding = await GetOrCreateOnboardingAsync(cancellationToken);
        onboarding.MarcarPrimeiraPropostaConcluida(propostaId);
        dbContext.OnboardingEventos.Add(OnboardingEvento.Create(
            currentContaContext.ContaId,
            currentContaContext.UsuarioId,
            "ConcluiuPrimeiraProposta",
            "geracao",
            propostaId));
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

    private async Task<ProgressoDerivado> BuildProgressoDerivadoAsync(CancellationToken cancellationToken)
    {
        var perfilConta = await dbContext.PerfisConta
            .AsNoTracking()
            .FirstOrDefaultAsync(
                perfil => perfil.ContaId == currentContaContext.ContaId,
                cancellationToken);
        var perfilCompleto = IsPerfilMinimoCompleto(perfilConta);

        var primeiraPropostaGerada = await dbContext.Propostas
            .AsNoTracking()
            .AnyAsync(
                proposta =>
                    proposta.ContaId == currentContaContext.ContaId &&
                    proposta.Status != StatusProposta.Rascunho &&
                    proposta.Status != StatusProposta.Arquivada,
                cancellationToken);

        return new ProgressoDerivado(perfilCompleto, primeiraPropostaGerada);
    }

    private static void AplicarConclusoesDerivadas(OnboardingUsuario onboarding, ProgressoDerivado progresso)
    {
        if (progresso.ConfiguracaoContaConcluida &&
            onboarding.StatusConfiguracaoConta != OnboardingUsuario.StatusConcluido)
        {
            onboarding.MarcarConfiguracaoContaConcluida();
        }

        if (progresso.PrimeiraPropostaConcluida &&
            onboarding.StatusPrimeiraProposta != OnboardingUsuario.StatusConcluido)
        {
            onboarding.Atualizar(
                null,
                null,
                OnboardingUsuario.StatusConcluido,
                "concluido",
                null,
                null);
        }
    }

    private static OnboardingResponse BuildResponse(OnboardingUsuario onboarding, ProgressoDerivado progresso)
    {
        var configuracaoConcluida =
            onboarding.StatusConfiguracaoConta == OnboardingUsuario.StatusConcluido ||
            progresso.ConfiguracaoContaConcluida;
        var primeiraPropostaConcluida =
            onboarding.StatusPrimeiraProposta == OnboardingUsuario.StatusConcluido ||
            progresso.PrimeiraPropostaConcluida;

        var deveAbrirAutomaticamente =
            (!configuracaoConcluida &&
                onboarding.StatusConfiguracaoConta != OnboardingUsuario.StatusPulado) ||
            (configuracaoConcluida &&
                !primeiraPropostaConcluida &&
                onboarding.StatusPrimeiraProposta != OnboardingUsuario.StatusPulado);
        var deveLembrarAposPular =
            (!configuracaoConcluida &&
                onboarding.StatusConfiguracaoConta == OnboardingUsuario.StatusPulado) ||
            (!primeiraPropostaConcluida &&
                onboarding.StatusPrimeiraProposta == OnboardingUsuario.StatusPulado);

        return new OnboardingResponse(
            onboarding.Id,
            onboarding.ContaId,
            onboarding.UsuarioId,
            new OnboardingJornadaResponse(
                configuracaoConcluida ? OnboardingUsuario.StatusConcluido : onboarding.StatusConfiguracaoConta,
                onboarding.EtapaConfiguracaoConta,
                progresso.ConfiguracaoContaConcluida,
                onboarding.ConfiguracaoContaIniciadaAt,
                onboarding.ConfiguracaoContaPuladaAt,
                onboarding.ConfiguracaoContaConcluidaAt),
            new OnboardingJornadaResponse(
                primeiraPropostaConcluida ? OnboardingUsuario.StatusConcluido : onboarding.StatusPrimeiraProposta,
                onboarding.EtapaPrimeiraProposta,
                progresso.PrimeiraPropostaConcluida,
                onboarding.PrimeiraPropostaIniciadaAt,
                onboarding.PrimeiraPropostaPuladaAt,
                onboarding.PrimeiraPropostaConcluidaAt),
            new OnboardingJornadaResponse(
                onboarding.StatusTour,
                OnboardingUsuario.EtapaTour,
                onboarding.StatusTour == OnboardingUsuario.StatusConcluido,
                onboarding.TourExibidoAt,
                onboarding.TourPuladoAt,
                onboarding.TourConcluidoAt),
            onboarding.PropostaRascunhoId,
            deveAbrirAutomaticamente,
            deveLembrarAposPular,
            onboarding.UpdatedAt);
    }

    private sealed record ProgressoDerivado(
        bool ConfiguracaoContaConcluida,
        bool PrimeiraPropostaConcluida);
}
