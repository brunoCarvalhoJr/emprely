namespace Emprely.Contracts.Onboarding;

public sealed record OnboardingJornadaResponse(
    string Status,
    string EtapaAtual,
    bool ConcluidoPorDados,
    DateTimeOffset? IniciadaAt,
    DateTimeOffset? PuladaAt,
    DateTimeOffset? ConcluidaAt);
