using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Proposals;

public sealed record UpdatePropostaRequest(
    Guid ClienteId,
    [Required, MaxLength(160)] string Titulo,
    [MaxLength(1000)] string? Introducao,
    [MaxLength(1000)] string? Observacoes,
    [Range(1, 365)] int? ValidadeDias,
    [Required, MinLength(1), MaxLength(50)] IReadOnlyList<PropostaItemRequest> Itens,
    [MaxLength(40)] string? TemplateVisual = null,
    [Range(0, 999999999)] decimal DescontoValor = 0,
    [MaxLength(1000)] string? CondicoesPagamento = null,
    [MaxLength(40)] IReadOnlyList<string>? ItensInclusos = null,
    [MaxLength(40)] IReadOnlyList<string>? ItensNaoInclusos = null,
    [MaxLength(40)] IReadOnlyList<string>? Cronograma = null,
    [MaxLength(40)] IReadOnlyList<string>? Beneficios = null);
