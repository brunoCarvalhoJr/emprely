using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Suporte;

public sealed record CreateContatoPublicoRequest(
    [Required, MaxLength(120)] string Nome,
    [Required, EmailAddress, MaxLength(200)] string Email,
    [MaxLength(30)] string? Telefone,
    [MaxLength(120)] string? Empresa,
    [Required, MaxLength(80)] string Interesse,
    [Required, MaxLength(2000)] string Mensagem);
