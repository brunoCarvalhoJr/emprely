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
        if (!ValidateTelefoneCliente(request.Telefone))
        {
            return ValidationProblem(ModelState);
        }

        if (!await ValidateClienteUnico(
                request.Nome,
                request.Email,
                request.Telefone,
                request.Documento,
                clienteIdIgnorado: null,
                cancellationToken))
        {
            return ValidationProblem(ModelState);
        }

        var cliente = Cliente.CreateCliente(
            currentContaContext.ContaId,
            request.Nome,
            request.Email,
            request.Telefone,
            request.Documento,
            request.Endereco,
            request.Numero,
            request.Cidade,
            request.Instagram,
            request.Facebook,
            request.TikTok,
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

        if (!ValidateTelefoneCliente(request.Telefone))
        {
            return ValidationProblem(ModelState);
        }

        if (!await ValidateClienteUnico(
                request.Nome,
                request.Email,
                request.Telefone,
                request.Documento,
                clienteIdIgnorado: id,
                cancellationToken))
        {
            return ValidationProblem(ModelState);
        }

        cliente.AtualizarCliente(
            request.Nome,
            request.Email,
            request.Telefone,
            request.Documento,
            request.Endereco,
            request.Numero,
            request.Cidade,
            request.Instagram,
            request.Facebook,
            request.TikTok,
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

    private async Task<bool> ValidateClienteUnico(
        string nome,
        string? email,
        string? telefone,
        string? documento,
        Guid? clienteIdIgnorado,
        CancellationToken cancellationToken)
    {
        var clientesAtivos = await dbContext.Clientes
            .AsNoTracking()
            .Where(cliente =>
                cliente.ContaId == currentContaContext.ContaId &&
                cliente.Status == StatusCliente.Ativo &&
                (!clienteIdIgnorado.HasValue || cliente.Id != clienteIdIgnorado.Value))
            .Select(cliente => new ClienteUnicoComparacao(
                cliente.Nome,
                cliente.Email,
                cliente.Telefone,
                cliente.Documento))
            .ToListAsync(cancellationToken);

        var nomeComparacao = NormalizarTextoComparacao(nome);
        var emailComparacao = NormalizarEmailComparacao(email);
        var telefoneComparacao = NormalizarTelefoneComparacao(telefone);
        var documentoComparacao = NormalizarDigitosComparacao(documento);

        if (nomeComparacao.Length > 0 &&
            clientesAtivos.Any(cliente =>
                NormalizarTextoComparacao(cliente.Nome) == nomeComparacao))
        {
            ModelState.AddModelError(
                nameof(CreateClienteRequest.Nome),
                "Ja existe um cliente ativo com este nome.");
        }

        if (telefoneComparacao is not null &&
            clientesAtivos.Any(cliente =>
                NormalizarTelefoneComparacao(cliente.Telefone) == telefoneComparacao))
        {
            ModelState.AddModelError(
                nameof(CreateClienteRequest.Telefone),
                "Ja existe um cliente ativo com este telefone.");
        }

        if (emailComparacao is not null &&
            clientesAtivos.Any(cliente =>
                NormalizarEmailComparacao(cliente.Email) == emailComparacao))
        {
            ModelState.AddModelError(
                nameof(CreateClienteRequest.Email),
                "Ja existe um cliente ativo com este e-mail.");
        }

        if (documentoComparacao is not null &&
            clientesAtivos.Any(cliente =>
                NormalizarDigitosComparacao(cliente.Documento) == documentoComparacao))
        {
            ModelState.AddModelError(
                nameof(CreateClienteRequest.Documento),
                "Ja existe um cliente ativo com este CPF/CNPJ.");
        }

        return ModelState.IsValid;
    }

    private static ClienteResponse BuildClienteResponse(Cliente cliente)
    {
        return new ClienteResponse(
            cliente.Id,
            cliente.Nome,
            cliente.Email,
            cliente.Telefone,
            cliente.Documento,
            cliente.Endereco,
            cliente.Numero,
            cliente.Cidade,
            cliente.Instagram,
            cliente.Facebook,
            cliente.TikTok,
            cliente.Observacoes,
            cliente.Status.ToString(),
            cliente.CreatedAt,
            cliente.UpdatedAt);
    }

    private bool ValidateTelefoneCliente(string? telefone)
    {
        if (Cliente.IsTelefoneWhatsappValido(telefone))
        {
            return true;
        }

        ModelState.AddModelError(
            nameof(CreateClienteRequest.Telefone),
            "Telefone deve conter DDD e numero, com ou sem prefixo 55.");
        return false;
    }

    private static string NormalizarTextoComparacao(string? valor)
    {
        var partes = (valor ?? string.Empty)
            .Trim()
            .Split(Array.Empty<char>(), StringSplitOptions.RemoveEmptyEntries);

        return string.Join(' ', partes).ToUpperInvariant();
    }

    private static string? NormalizarEmailComparacao(string? email)
    {
        var emailNormalizado = email?.Trim();
        return string.IsNullOrWhiteSpace(emailNormalizado)
            ? null
            : emailNormalizado.ToUpperInvariant();
    }

    private static string? NormalizarTelefoneComparacao(string? telefone)
    {
        var digitos = NormalizarDigitosComparacao(telefone);

        if (digitos is null)
        {
            return null;
        }

        return digitos.StartsWith("55", StringComparison.Ordinal) &&
            digitos.Length is 12 or 13
            ? digitos[2..]
            : digitos;
    }

    private static string? NormalizarDigitosComparacao(string? valor)
    {
        var digitos = new string((valor ?? string.Empty).Where(char.IsDigit).ToArray());
        return digitos.Length == 0 ? null : digitos;
    }

    private sealed record ClienteUnicoComparacao(
        string Nome,
        string? Email,
        string? Telefone,
        string? Documento);
}
