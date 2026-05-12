using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record LoginUsuarioRequest(
    [Required, EmailAddress] string Email,
    [Required] string Senha);
