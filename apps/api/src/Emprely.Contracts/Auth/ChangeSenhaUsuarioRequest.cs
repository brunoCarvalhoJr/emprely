using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Auth;

public sealed record ChangeSenhaUsuarioRequest(
    [Required] string SenhaAtual,
    [Required, MinLength(8)] string NovaSenha,
    [Required] string ConfirmarNovaSenha);
