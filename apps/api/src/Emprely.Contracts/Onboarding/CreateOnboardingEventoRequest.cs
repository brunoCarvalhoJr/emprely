namespace Emprely.Contracts.Onboarding;

public sealed record CreateOnboardingEventoRequest(
    string Tipo,
    string? Etapa = null,
    Guid? PropostaId = null);
