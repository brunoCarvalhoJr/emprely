namespace Emprely.Contracts.Onboarding;

public sealed record UpdateOnboardingRequest(
    string? StatusConfiguracaoConta = null,
    string? EtapaConfiguracaoConta = null,
    string? StatusPrimeiraProposta = null,
    string? EtapaPrimeiraProposta = null,
    Guid? PropostaRascunhoId = null,
    string? StatusTour = null);
