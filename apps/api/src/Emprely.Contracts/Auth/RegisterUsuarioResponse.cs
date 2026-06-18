namespace Emprely.Contracts.Auth;

public sealed record RegisterUsuarioResponse(
    Guid UsuarioId,
    string Email,
    bool EmailConfirmationRequired,
    string Message);
