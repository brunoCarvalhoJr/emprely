using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record ForgotSenhaUsuarioRequest(
    [Required, EmailAddress] string Email);
