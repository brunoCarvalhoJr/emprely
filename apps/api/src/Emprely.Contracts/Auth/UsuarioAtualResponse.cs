namespace Emprely.Contracts.Auth;

public sealed record UsuarioAtualResponse(
    Guid Id,
    string Nome,
    string Email);
