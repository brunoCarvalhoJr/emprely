using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Admin;

public sealed record AdminResendConfirmacaoEmailRequest(
    [Required, EmailAddress] string Email);
