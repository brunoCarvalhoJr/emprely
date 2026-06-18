using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record ResetSenhaUsuarioRequest(
    [Required] Guid UsuarioId,
    [Required] string Token,
    [Required, MinLength(8)] string NovaSenha,
    [Required] string ConfirmarNovaSenha);
