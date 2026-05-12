namespace Emprely.Api.Auth;

public sealed record JwtTokenResult(string AccessToken, DateTimeOffset ExpiresAtUtc);
