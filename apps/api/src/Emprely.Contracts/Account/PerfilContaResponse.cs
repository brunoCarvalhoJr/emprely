namespace Emprely.Contracts.Account;

public sealed record PerfilContaResponse(
    Guid? Id,
    Guid ContaId,
    string NomeComercial,
    string? EmailContato,
    string? TelefoneContato,
    string? SiteUrl,
    string? Instagram,
    string? Documento,
    string CorPrimaria,
    string CorSecundaria,
    string? LogoUrl,
    DateTimeOffset? UpdatedAt);
