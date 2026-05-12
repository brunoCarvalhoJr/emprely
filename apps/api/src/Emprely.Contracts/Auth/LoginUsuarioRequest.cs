using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record LoginUsuarioRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required] string Senha);
