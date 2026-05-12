using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Services;

public sealed record CreateServicoRequest(
    [Required, MaxLength(160)] string Nome,
    [MaxLength(1000)] string? Descricao,
    [MaxLength(80)] string? Categoria,
    [Range(0, 9999999999.99)] decimal Preco,
    [Required, MaxLength(24)] string Unidade,
    [Required, MaxLength(24)] string Tipo);
