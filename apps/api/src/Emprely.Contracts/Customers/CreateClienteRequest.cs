using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Customers;

public sealed record CreateClienteRequest(
    [Required, MaxLength(160)] string Nome,
    [EmailAddress, MaxLength(256)] string? Email,
    [MaxLength(40)] string? Telefone,
    [MaxLength(40)] string? Documento,
    [MaxLength(1000)] string? Observacoes);
