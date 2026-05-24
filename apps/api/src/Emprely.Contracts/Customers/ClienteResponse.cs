using System.Text.Json.Serialization;

namespace Emprely.Contracts.Customers;

public sealed record ClienteResponse(
    Guid Id,
    string Nome,
    string? Email,
    string? Telefone,
    string? Documento,
    string? Endereco,
    string? Numero,
    string? Cidade,
    string? Instagram,
    string? Facebook,
    [property: JsonPropertyName("tiktok")]
    string? TikTok,
    string? Observacoes,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);
