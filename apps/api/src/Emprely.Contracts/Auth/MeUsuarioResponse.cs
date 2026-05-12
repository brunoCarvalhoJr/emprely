namespace Emprely.Contracts.Auth;

public sealed record MeUsuarioResponse(
    UsuarioAtualResponse Usuario,
    ContaAtualResponse Conta);
