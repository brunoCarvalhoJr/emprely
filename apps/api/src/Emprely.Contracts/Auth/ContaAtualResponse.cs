namespace Emprely.Contracts.Auth;

public sealed record ContaAtualResponse(
    Guid Id,
    string Nome,
    string Slug,
    string Papel,
    string Plano,
    string StatusComercial,
    DateTimeOffset TrialEndsAt,
    int TrialDiasRestantes,
    DateTimeOffset? PlanoFundadorAtivadoAt,
    decimal PlanoFundadorPrecoMensal);
