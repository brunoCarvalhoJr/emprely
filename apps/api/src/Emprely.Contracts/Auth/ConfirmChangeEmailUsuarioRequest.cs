using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record ConfirmChangeEmailUsuarioRequest(
    [Required] Guid UsuarioId,
    [Required] string Token);
