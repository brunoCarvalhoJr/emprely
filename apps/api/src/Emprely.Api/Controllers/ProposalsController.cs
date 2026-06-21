using Emprely.Application.Auth;
using Emprely.Contracts.Proposals;
using Emprely.Domain.Clientes;
using Emprely.Domain.Contas;
using Emprely.Domain.Onboarding;
using Emprely.Domain.Propostas;
using Emprely.Domain.Servicos;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/proposals")]
public sealed class ProposalsController : ControllerBase
{
    private const int TituloPropostaMaxLength = 160;
    private const string TituloCopiaSuffix = " (copia)";

    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;

    public ProposalsController(ICurrentContaContext currentContaContext, EmprelyDbContext dbContext)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PropostaResponse>>> GetPropostasConta(
        CancellationToken cancellationToken)
    {
        var propostas = await dbContext.Propostas
            .AsNoTracking()
            .Include(proposta => proposta.Cliente)
            .Include(proposta => proposta.Itens)
            .Where(proposta =>
                proposta.ContaId == currentContaContext.ContaId &&
                proposta.Status != StatusProposta.Arquivada)
            .OrderByDescending(proposta => proposta.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(propostas.Select(BuildPropostaResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PropostaResponse>> GetProposta(
        Guid id,
        CancellationToken cancellationToken)
    {
        var proposta = await FindPropostaConta(id, cancellationToken);

        if (proposta is null || proposta.Status == StatusProposta.Arquivada)
        {
            return NotFound();
        }

        return Ok(BuildPropostaResponse(proposta));
    }

    [HttpPost]
    public async Task<ActionResult<PropostaResponse>> CreateProposta(
        CreatePropostaRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryParseTemplateVisualProposta(request.TemplateVisual, out var templateVisual))
        {
            ModelState.AddModelError(nameof(CreatePropostaRequest.TemplateVisual), "Template visual invalido.");
        }

        if (!await ValidateReferenciasProposta(request.ClienteId, request.Itens, cancellationToken) || !ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        Proposta proposta;

        try
        {
            proposta = Proposta.CreateProposta(
                currentContaContext.ContaId,
                await GetNextNumeroProposta(cancellationToken),
                request.ClienteId,
                request.Titulo,
                request.Introducao,
                request.Observacoes,
                request.ValidadeDias,
                BuildItensDados(request.Itens),
                templateVisual,
                request.DescontoValor,
                request.CondicoesPagamento,
                request.ItensInclusos,
                request.ItensNaoInclusos,
                request.Cronograma,
                request.Beneficios);
        }
        catch (ArgumentException exception)
        {
            ModelState.AddModelError(nameof(CreatePropostaRequest), exception.Message);
            return ValidationProblem(ModelState);
        }

        dbContext.Propostas.Add(proposta);
        await dbContext.SaveChangesAsync(cancellationToken);

        var propostaSalva = await FindPropostaConta(proposta.Id, cancellationToken)
            ?? throw new InvalidOperationException("Proposta criada nao encontrada.");
        var response = BuildPropostaResponse(propostaSalva);

        return CreatedAtAction(
            nameof(GetProposta),
            new { id = proposta.Id },
            response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PropostaResponse>> UpdateProposta(
        Guid id,
        UpdatePropostaRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryParseTemplateVisualProposta(request.TemplateVisual, out var templateVisual))
        {
            ModelState.AddModelError(nameof(UpdatePropostaRequest.TemplateVisual), "Template visual invalido.");
        }

        if (!await ValidateReferenciasProposta(request.ClienteId, request.Itens, cancellationToken) || !ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var proposta = await FindPropostaConta(id, cancellationToken);

        if (proposta is null || proposta.Status == StatusProposta.Arquivada)
        {
            return NotFound();
        }

        var itensAnteriores = proposta.Itens.ToList();

        try
        {
            proposta.AtualizarProposta(
                request.ClienteId,
                request.Titulo,
                request.Introducao,
                request.Observacoes,
                request.ValidadeDias,
                BuildItensDados(request.Itens),
                templateVisual,
                request.DescontoValor,
                request.CondicoesPagamento,
                request.ItensInclusos,
                request.ItensNaoInclusos,
                request.Cronograma,
                request.Beneficios);
        }
        catch (ArgumentException exception)
        {
            ModelState.AddModelError(nameof(UpdatePropostaRequest), exception.Message);
            return ValidationProblem(ModelState);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }

        dbContext.PropostaItens.RemoveRange(itensAnteriores);

        foreach (var item in proposta.Itens)
        {
            dbContext.Entry(item).State = EntityState.Added;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(BuildPropostaResponse(proposta));
    }

    [HttpPost("{id:guid}/generate")]
    public async Task<ActionResult<PropostaResponse>> GenerateProposta(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await AlterarStatusProposta(
            id,
            proposta => proposta.GerarProposta(),
            cancellationToken,
            validarFluxoComercial: true,
            concluirOnboardingPrimeiraProposta: true);
    }

    [HttpPost("{id:guid}/duplicate")]
    public async Task<ActionResult<PropostaResponse>> DuplicateProposta(
        Guid id,
        CancellationToken cancellationToken)
    {
        var proposta = await FindPropostaConta(id, cancellationToken);

        if (proposta is null || proposta.Status == StatusProposta.Arquivada)
        {
            return NotFound();
        }

        var copia = proposta.DuplicarProposta(
            BuildTituloCopiaProposta(proposta.Titulo),
            await GetNextNumeroProposta(cancellationToken));

        dbContext.Propostas.Add(copia);
        await dbContext.SaveChangesAsync(cancellationToken);

        var propostaSalva = await FindPropostaConta(copia.Id, cancellationToken)
            ?? throw new InvalidOperationException("Proposta duplicada nao encontrada.");
        var response = BuildPropostaResponse(propostaSalva);

        return CreatedAtAction(
            nameof(GetProposta),
            new { id = copia.Id },
            response);
    }

    [HttpPost("{id:guid}/send")]
    public async Task<ActionResult<PropostaResponse>> SendProposta(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await AlterarStatusProposta(
            id,
            proposta => proposta.EnviarProposta(),
            cancellationToken,
            validarFluxoComercial: true);
    }

    [HttpPost("{id:guid}/accept")]
    public async Task<ActionResult<PropostaResponse>> AcceptProposta(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await AlterarStatusProposta(id, proposta => proposta.AceitarProposta(), cancellationToken);
    }

    [HttpPost("{id:guid}/reject")]
    public async Task<ActionResult<PropostaResponse>> RejectProposta(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await AlterarStatusProposta(id, proposta => proposta.RecusarProposta(), cancellationToken);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProposta(
        Guid id,
        CancellationToken cancellationToken)
    {
        var proposta = await FindPropostaConta(id, cancellationToken);

        if (proposta is null || proposta.Status == StatusProposta.Arquivada)
        {
            return NotFound();
        }

        proposta.ArquivarProposta();
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private Task<Proposta?> FindPropostaConta(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Propostas
            .Include(proposta => proposta.Cliente)
            .Include(proposta => proposta.Itens)
            .FirstOrDefaultAsync(
                proposta =>
                    proposta.Id == id &&
                    proposta.ContaId == currentContaContext.ContaId,
                cancellationToken);
    }

    private Task<Conta?> FindContaAtual(CancellationToken cancellationToken)
    {
        return dbContext.Contas.FirstOrDefaultAsync(
            conta => conta.Id == currentContaContext.ContaId,
            cancellationToken);
    }

    private async Task<ActionResult<PropostaResponse>?> ValidateContaCanUseFluxoComercialProposta(
        CancellationToken cancellationToken)
    {
        var conta = await FindContaAtual(cancellationToken);

        if (conta is null)
        {
            return NotFound();
        }

        var agora = DateTimeOffset.UtcNow;
        var diasGratisAtivo = await dbContext.DiasGratisConta.AnyAsync(
            dias => dias.ContaId == conta.Id && dias.InicioAt <= agora && dias.FimAt > agora,
            cancellationToken);

        if (conta.CanGenerateProposta(agora) || (conta.Status == StatusConta.Ativa && diasGratisAtivo))
        {
            return null;
        }

        return StatusCode(
            StatusCodes.Status403Forbidden,
            new
            {
                message = "Trial expirado. Fale com a Emprely pelo WhatsApp +55 (35) 99738-9755 para ativar o plano e gerar, imprimir ou compartilhar propostas.",
            });
    }

    private async Task<ActionResult<PropostaResponse>> AlterarStatusProposta(
        Guid id,
        Action<Proposta> alterarStatus,
        CancellationToken cancellationToken,
        bool validarFluxoComercial = false,
        bool concluirOnboardingPrimeiraProposta = false)
    {
        var proposta = await FindPropostaConta(id, cancellationToken);

        if (proposta is null || proposta.Status == StatusProposta.Arquivada)
        {
            return NotFound();
        }

        if (validarFluxoComercial)
        {
            var bloqueioComercial = await ValidateContaCanUseFluxoComercialProposta(cancellationToken);
            if (bloqueioComercial is not null)
            {
                return bloqueioComercial;
            }
        }

        try
        {
            alterarStatus(proposta);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }

        if (concluirOnboardingPrimeiraProposta)
        {
            var onboarding = await GetOrCreateOnboardingAsync(cancellationToken);
            onboarding.MarcarPrimeiraPropostaConcluida(proposta.Id);
            dbContext.OnboardingEventos.Add(OnboardingEvento.Create(
                currentContaContext.ContaId,
                currentContaContext.UsuarioId,
                "ConcluiuPrimeiraProposta",
                "geracao",
                proposta.Id));
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(BuildPropostaResponse(proposta));
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

    private async Task<bool> ValidateReferenciasProposta(
        Guid clienteId,
        IReadOnlyCollection<PropostaItemRequest> itens,
        CancellationToken cancellationToken)
    {
        var clienteExiste = await dbContext.Clientes
            .AnyAsync(
                cliente =>
                    cliente.Id == clienteId &&
                    cliente.ContaId == currentContaContext.ContaId &&
                    cliente.Status == StatusCliente.Ativo,
                cancellationToken);

        if (!clienteExiste)
        {
            ModelState.AddModelError(nameof(CreatePropostaRequest.ClienteId), "Cliente invalido para a conta atual.");
        }

        var servicoIds = itens
            .Where(item => item.ServicoId.HasValue)
            .Select(item => item.ServicoId!.Value)
            .Distinct()
            .ToList();

        if (servicoIds.Count > 0)
        {
            var servicoIdsValidos = await dbContext.Servicos
                .Where(servico =>
                    servico.ContaId == currentContaContext.ContaId &&
                    servico.Status == StatusServico.Ativo &&
                    servicoIds.Contains(servico.Id))
                .Select(servico => servico.Id)
                .ToListAsync(cancellationToken);

            if (servicoIds.Except(servicoIdsValidos).Any())
            {
                ModelState.AddModelError(nameof(CreatePropostaRequest.Itens), "Um ou mais servicos sao invalidos para a conta atual.");
            }
        }

        return ModelState.IsValid;
    }

    private static IEnumerable<PropostaItemDados> BuildItensDados(
        IEnumerable<PropostaItemRequest> itens)
    {
        return itens.Select(item => new PropostaItemDados(
            item.ServicoId,
            item.Nome,
            item.Descricao,
            item.Quantidade,
            item.ValorUnitario));
    }

    private static PropostaResponse BuildPropostaResponse(Proposta proposta)
    {
        return new PropostaResponse(
            proposta.Id,
            proposta.Numero,
            proposta.ClienteId,
            proposta.Cliente?.Nome ?? string.Empty,
            proposta.Titulo,
            proposta.Introducao,
            proposta.Observacoes,
            proposta.ValidadeDias,
            proposta.Status.ToString(),
            proposta.TemplateVisual.ToString(),
            proposta.Subtotal,
            proposta.DescontoValor,
            proposta.CondicoesPagamento,
            QuebrarLinhas(proposta.ItensInclusosTexto),
            QuebrarLinhas(proposta.ItensNaoInclusosTexto),
            QuebrarLinhas(proposta.CronogramaTexto),
            QuebrarLinhas(proposta.BeneficiosTexto),
            proposta.Total,
            proposta.Itens
                .OrderBy(item => item.Ordem)
                .Select(BuildPropostaItemResponse)
                .ToList(),
            proposta.CreatedAt,
            proposta.UpdatedAt);
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

    private static IReadOnlyList<string> QuebrarLinhas(string? texto)
    {
        if (string.IsNullOrWhiteSpace(texto))
        {
            return Array.Empty<string>();
        }

        return texto
            .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToList();
    }

    private async Task<int> GetNextNumeroProposta(CancellationToken cancellationToken)
    {
        var ultimoNumero = await dbContext.Propostas
            .Where(proposta => proposta.ContaId == currentContaContext.ContaId)
            .Select(proposta => (int?)proposta.Numero)
            .MaxAsync(cancellationToken);

        return (ultimoNumero ?? 0) + 1;
    }

    private static string BuildTituloCopiaProposta(string titulo)
    {
        var tituloBase = titulo.Trim();
        var tamanhoMaximoBase = TituloPropostaMaxLength - TituloCopiaSuffix.Length;

        if (tituloBase.Length > tamanhoMaximoBase)
        {
            tituloBase = tituloBase[..tamanhoMaximoBase].TrimEnd();
        }

        return $"{tituloBase}{TituloCopiaSuffix}";
    }

    private static PropostaItemResponse BuildPropostaItemResponse(PropostaItem item)
    {
        return new PropostaItemResponse(
            item.Id,
            item.ServicoId,
            item.Nome,
            item.Descricao,
            item.Quantidade,
            item.ValorUnitario,
            item.Total,
            item.Ordem);
    }
}
