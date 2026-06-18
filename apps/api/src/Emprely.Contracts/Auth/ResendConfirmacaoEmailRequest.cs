using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record ResendConfirmacaoEmailRequest(
    [Required, EmailAddress] string Email);
