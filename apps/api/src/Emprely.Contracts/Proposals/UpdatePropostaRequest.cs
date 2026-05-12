using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Proposals;

public sealed record UpdatePropostaRequest(
    Guid ClienteId,
    [Required, MaxLength(160)] string Titulo,
    [MaxLength(1000)] string? Introducao,
    [MaxLength(1000)] string? Observacoes,
    [Range(1, 365)] int? ValidadeDias,
    [Required, MinLength(1), MaxLength(50)] IReadOnlyList<PropostaItemRequest> Itens);
