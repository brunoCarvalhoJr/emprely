namespace Emprely.Api.Auth;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; init; } = "Emprely";

    public string Audience { get; init; } = "Emprely";

    public string SigningKey { get; init; } = string.Empty;

    public int ExpirationMinutes { get; init; } = 120;
}
