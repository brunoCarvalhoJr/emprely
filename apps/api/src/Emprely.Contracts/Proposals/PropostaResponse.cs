namespace Emprely.Contracts.Proposals;

public sealed record PropostaResponse(
    Guid Id,
    int Numero,
    Guid ClienteId,
    string ClienteNome,
    string Titulo,
    string? Introducao,
    string? Observacoes,
    int? ValidadeDias,
    string Status,
    string TemplateVisual,
    decimal Subtotal,
    decimal DescontoValor,
    string? CondicoesPagamento,
    IReadOnlyList<string> ItensInclusos,
    IReadOnlyList<string> ItensNaoInclusos,
    IReadOnlyList<string> Cronograma,
    IReadOnlyList<string> Beneficios,
    decimal Total,
    IReadOnlyList<PropostaItemResponse> Itens,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);
