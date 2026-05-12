using Emprely.Application.Auth;
using Emprely.Contracts.Proposals;
using Emprely.Domain.Clientes;
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
        if (!await ValidateReferenciasProposta(request.ClienteId, request.Itens, cancellationToken))
        {
            return ValidationProblem(ModelState);
        }

        var proposta = Proposta.CreateProposta(
            currentContaContext.ContaId,
            request.ClienteId,
            request.Titulo,
            request.Introducao,
            request.Observacoes,
            request.ValidadeDias,
            BuildItensDados(request.Itens));

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
        if (!await ValidateReferenciasProposta(request.ClienteId, request.Itens, cancellationToken))
        {
            return ValidationProblem(ModelState);
        }

        var proposta = await FindPropostaConta(id, cancellationToken);

        if (proposta is null || proposta.Status == StatusProposta.Arquivada)
        {
            return NotFound();
        }

        var itensAnteriores = proposta.Itens.ToList();

        proposta.AtualizarProposta(
            request.ClienteId,
            request.Titulo,
            request.Introducao,
            request.Observacoes,
            request.ValidadeDias,
            BuildItensDados(request.Itens));

        dbContext.PropostaItens.RemoveRange(itensAnteriores);

        foreach (var item in proposta.Itens)
        {
            dbContext.Entry(item).State = EntityState.Added;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(BuildPropostaResponse(proposta));
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
            proposta.ClienteId,
            proposta.Cliente?.Nome ?? string.Empty,
            proposta.Titulo,
            proposta.Introducao,
            proposta.Observacoes,
            proposta.ValidadeDias,
            proposta.Status.ToString(),
            proposta.Total,
            proposta.Itens
                .OrderBy(item => item.Ordem)
                .Select(BuildPropostaItemResponse)
                .ToList(),
            proposta.CreatedAt,
            proposta.UpdatedAt);
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
