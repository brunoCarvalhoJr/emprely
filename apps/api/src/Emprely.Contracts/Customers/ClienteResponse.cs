namespace Emprely.Contracts.Customers;

public sealed record ClienteResponse(
    Guid Id,
    string Nome,
    string? Email,
    string? Telefone,
    string? Documento,
    string? Observacoes,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);
