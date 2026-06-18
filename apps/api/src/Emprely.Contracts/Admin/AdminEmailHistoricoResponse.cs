namespace Emprely.Contracts.Admin;

public sealed record AdminEmailHistoricoResponse(
    Guid Id,
    Guid? ContaId,
    Guid? UsuarioId,
    string Tipo,
    string Destinatario,
    string Status,
    string? ProviderMessageId,
    string? Erro,
    DateTimeOffset CreatedAt);
