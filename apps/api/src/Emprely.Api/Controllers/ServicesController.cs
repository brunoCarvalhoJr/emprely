using Emprely.Application.Auth;
using Emprely.Contracts.Services;
using Emprely.Domain.Servicos;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/services")]
public sealed class ServicesController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;

    public ServicesController(ICurrentContaContext currentContaContext, EmprelyDbContext dbContext)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServicoResponse>>> GetServicosConta(
        CancellationToken cancellationToken)
    {
        var servicos = await dbContext.Servicos
            .AsNoTracking()
            .Where(servico =>
                servico.ContaId == currentContaContext.ContaId &&
                servico.Status == StatusServico.Ativo)
            .OrderBy(servico => servico.Nome)
            .Select(servico => BuildServicoResponse(servico))
            .ToListAsync(cancellationToken);

        return Ok(servicos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServicoResponse>> GetServico(
        Guid id,
        CancellationToken cancellationToken)
    {
        var servico = await FindServicoConta(id, cancellationToken);

        if (servico is null || servico.Status != StatusServico.Ativo)
        {
            return NotFound();
        }

        return Ok(BuildServicoResponse(servico));
    }

    [HttpPost]
    public async Task<ActionResult<ServicoResponse>> CreateServico(
        CreateServicoRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryParseServicoEnums(request.Unidade, request.Tipo, out var unidade, out var tipo))
        {
            return ValidationProblem(ModelState);
        }

        var servico = Servico.CreateServico(
            currentContaContext.ContaId,
            request.Nome,
            request.Descricao,
            request.Categoria,
            request.Preco,
            unidade,
            tipo);

        dbContext.Servicos.Add(servico);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = BuildServicoResponse(servico);

        return CreatedAtAction(
            nameof(GetServico),
            new { id = servico.Id },
            response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServicoResponse>> UpdateServico(
        Guid id,
        UpdateServicoRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryParseServicoEnums(request.Unidade, request.Tipo, out var unidade, out var tipo))
        {
            return ValidationProblem(ModelState);
        }

        var servico = await FindServicoConta(id, cancellationToken);

        if (servico is null || servico.Status != StatusServico.Ativo)
        {
            return NotFound();
        }

        servico.AtualizarServico(
            request.Nome,
            request.Descricao,
            request.Categoria,
            request.Preco,
            unidade,
            tipo);

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(BuildServicoResponse(servico));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteServico(
        Guid id,
        CancellationToken cancellationToken)
    {
        var servico = await FindServicoConta(id, cancellationToken);

        if (servico is null || servico.Status != StatusServico.Ativo)
        {
            return NotFound();
        }

        servico.ArquivarServico();
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private Task<Servico?> FindServicoConta(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Servicos
            .FirstOrDefaultAsync(
                servico =>
                    servico.Id == id &&
                    servico.ContaId == currentContaContext.ContaId,
                cancellationToken);
    }

    private bool TryParseServicoEnums(
        string unidadeInput,
        string tipoInput,
        out UnidadeServico unidade,
        out TipoServico tipo)
    {
        var unidadeValida = Enum.TryParse(unidadeInput, true, out unidade) &&
            Enum.IsDefined(unidade);
        var tipoValido = Enum.TryParse(tipoInput, true, out tipo) &&
            Enum.IsDefined(tipo);

        if (!unidadeValida)
        {
            ModelState.AddModelError(nameof(CreateServicoRequest.Unidade), "Unidade invalida.");
        }

        if (!tipoValido)
        {
            ModelState.AddModelError(nameof(CreateServicoRequest.Tipo), "Tipo invalido.");
        }

        return unidadeValida && tipoValido;
    }

    private static ServicoResponse BuildServicoResponse(Servico servico)
    {
        return new ServicoResponse(
            servico.Id,
            servico.Nome,
            servico.Descricao,
            servico.Categoria,
            servico.Preco,
            servico.Unidade.ToString(),
            servico.Tipo.ToString(),
            servico.Status.ToString(),
            servico.CreatedAt,
            servico.UpdatedAt);
    }
}
