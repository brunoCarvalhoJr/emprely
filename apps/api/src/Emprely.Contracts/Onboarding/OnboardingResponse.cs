namespace Emprely.Contracts.Onboarding;

public sealed record OnboardingResponse(
    Guid? Id,
    Guid ContaId,
    Guid UsuarioId,
    OnboardingJornadaResponse ConfiguracaoConta,
    OnboardingJornadaResponse PrimeiraProposta,
    OnboardingJornadaResponse Tour,
    Guid? PropostaRascunhoId,
    bool DeveAbrirAutomaticamente,
    bool DeveLembrarAposPular,
    DateTimeOffset? UpdatedAt);
