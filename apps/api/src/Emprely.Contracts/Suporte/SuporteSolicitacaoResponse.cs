namespace Emprely.Contracts.Suporte;

public sealed record SuporteSolicitacaoResponse(
    Guid Id,
    string Assunto,
    string Status,
    DateTimeOffset CreatedAt);
