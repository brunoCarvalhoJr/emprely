namespace Emprely.Contracts.Admin;

public sealed record AdminContaResponse(
    Guid Id,
    string Nome,
    string Slug,
    string Plano,
    string StatusComercial,
    DateTimeOffset TrialEndsAt,
    DateTimeOffset? PlanoFundadorAtivadoAt,
    decimal PlanoFundadorPrecoMensal);
