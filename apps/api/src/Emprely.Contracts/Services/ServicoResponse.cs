namespace Emprely.Contracts.Services;

public sealed record ServicoResponse(
    Guid Id,
    string Nome,
    string? Descricao,
    string? Categoria,
    decimal Preco,
    string Unidade,
    string Tipo,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);
