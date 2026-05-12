using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Proposals;

public sealed record PropostaItemRequest(
    Guid? ServicoId,
    [Required, MaxLength(160)] string Nome,
    [MaxLength(1000)] string? Descricao,
    [Range(0.01, 9999999999.99)] decimal Quantidade,
    [Range(0, 9999999999.99)] decimal ValorUnitario);
