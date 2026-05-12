namespace Emprely.Contracts.Auth;

public sealed record AuthUsuarioResponse(
    string AccessToken,
    DateTimeOffset ExpiresAtUtc,
    UsuarioAtualResponse Usuario,
    ContaAtualResponse Conta);
