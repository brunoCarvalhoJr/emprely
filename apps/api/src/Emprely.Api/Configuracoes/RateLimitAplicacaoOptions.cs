namespace Emprely.Api.Configuracoes;

public sealed class RateLimitAplicacaoOptions
{
    public const string AdminPolicyName = "Admin";

    public const string AuthPolicyName = "Auth";

    public const string SectionName = "RateLimit";

    public int AuthPermitLimit { get; init; } = 120;

    public int AdminPermitLimit { get; init; } = 60;

    public int WindowSeconds { get; init; } = 60;
}
