using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Proposals;

public sealed record PropostaItemRequest(
    Guid? ServicoId,
    [Required, MaxLength(160)] string Nome,
    [MaxLength(1000)] string? Descricao,
    [Range(1, 9999999999)] decimal Quantidade,
    [Range(0, 9999999999.99)] decimal ValorUnitario) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (decimal.Truncate(Quantidade) != Quantidade)
        {
            yield return new ValidationResult(
                "Quantidade deve ser um numero inteiro.",
                new[] { nameof(Quantidade) });
        }
    }
}
