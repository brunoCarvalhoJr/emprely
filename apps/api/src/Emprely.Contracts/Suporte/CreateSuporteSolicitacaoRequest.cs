using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Suporte;

public sealed record CreateSuporteSolicitacaoRequest(
    [Required, MaxLength(120)] string Assunto,
    [Required, MaxLength(4000)] string Mensagem);
