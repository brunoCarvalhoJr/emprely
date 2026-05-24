using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Emprely.Contracts.Customers;

public sealed record CreateClienteRequest(
    [Required, MaxLength(160)] string Nome,
    [EmailAddress, MaxLength(256)] string? Email,
    [MaxLength(40)] string? Telefone,
    [MaxLength(40)] string? Documento,
    [MaxLength(200)] string? Endereco,
    [MaxLength(30)] string? Numero,
    [MaxLength(120)] string? Cidade,
    [MaxLength(160)] string? Instagram,
    [MaxLength(160)] string? Facebook,
    [property: JsonPropertyName("tiktok")]
    [MaxLength(160)] string? TikTok,
    [MaxLength(1000)] string? Observacoes);
