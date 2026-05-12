namespace Emprely.Contracts.Proposals;

public sealed record PropostaResponse(
    Guid Id,
    Guid ClienteId,
    string ClienteNome,
    string Titulo,
    string? Introducao,
    string? Observacoes,
    int? ValidadeDias,
    string Status,
    decimal Total,
    IReadOnlyList<PropostaItemResponse> Itens,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);
