using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record ChangeEmailUsuarioRequest(
    [Required, EmailAddress, MaxLength(256)] string NovoEmail);
