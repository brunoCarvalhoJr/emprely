using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record ConfirmEmailUsuarioRequest(
    [Required] Guid UsuarioId,
    [Required] string Token);
