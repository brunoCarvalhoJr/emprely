using Emprely.Application.Auth;
using Emprely.Contracts.Customers;
using Emprely.Domain.Clientes;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/customers")]
public sealed class CustomersController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;

    public CustomersController(ICurrentContaContext currentContaContext, EmprelyDbContext dbContext)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ClienteResponse>>> GetClientesConta(
        CancellationToken cancellationToken)
    {
        var clientes = await dbContext.Clientes
            .AsNoTracking()
            .Where(cliente =>
                cliente.ContaId == currentContaContext.ContaId &&
                cliente.Status == StatusCliente.Ativo)
            .OrderBy(cliente => cliente.Nome)
            .Select(cliente => BuildClienteResponse(cliente))
            .ToListAsync(cancellationToken);

        return Ok(clientes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ClienteResponse>> GetCliente(
        Guid id,
        CancellationToken cancellationToken)
    {
        var cliente = await FindClienteConta(id, cancellationToken);

        if (cliente is null || cliente.Status != StatusCliente.Ativo)
        {
            return NotFound();
        }

        return Ok(BuildClienteResponse(cliente));
    }

    [HttpPost]
    public async Task<ActionResult<ClienteResponse>> CreateCliente(
        CreateClienteRequest request,
        CancellationToken cancellationToken)
    {
        var cliente = Cliente.CreateCliente(
            currentContaContext.ContaId,
            request.Nome,
            request.Email,
            request.Telefone,
            request.Documento,
            request.Observacoes);

        dbContext.Clientes.Add(cliente);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = BuildClienteResponse(cliente);

        return CreatedAtAction(
            nameof(GetCliente),
            new { id = cliente.Id },
            response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ClienteResponse>> UpdateCliente(
        Guid id,
        UpdateClienteRequest request,
        CancellationToken cancellationToken)
    {
        var cliente = await FindClienteConta(id, cancellationToken);

        if (cliente is null || cliente.Status != StatusCliente.Ativo)
        {
            return NotFound();
        }

        cliente.AtualizarCliente(
            request.Nome,
            request.Email,
            request.Telefone,
            request.Documento,
            request.Observacoes);

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(BuildClienteResponse(cliente));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCliente(
        Guid id,
        CancellationToken cancellationToken)
    {
        var cliente = await FindClienteConta(id, cancellationToken);

        if (cliente is null || cliente.Status != StatusCliente.Ativo)
        {
            return NotFound();
        }

        cliente.ArquivarCliente();
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private Task<Cliente?> FindClienteConta(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Clientes
            .FirstOrDefaultAsync(
                cliente =>
                    cliente.Id == id &&
                    cliente.ContaId == currentContaContext.ContaId,
                cancellationToken);
    }

    private static ClienteResponse BuildClienteResponse(Cliente cliente)
    {
        return new ClienteResponse(
            cliente.Id,
            cliente.Nome,
            cliente.Email,
            cliente.Telefone,
            cliente.Documento,
            cliente.Observacoes,
            cliente.Status.ToString(),
            cliente.CreatedAt,
            cliente.UpdatedAt);
    }
}
