using System.ComponentModel.DataAnnotations;

namespace Emprely.Contracts.Account;

public sealed record UpdatePerfilContaRequest(
    [Required, MaxLength(160)] string NomeComercial,
    [EmailAddress, MaxLength(256)] string? EmailContato,
    [MaxLength(40)] string? TelefoneContato,
    [MaxLength(300)] string? SiteUrl,
    [MaxLength(80)] string? Instagram,
    [MaxLength(40)] string? Documento,
    [Required, RegularExpression("^#[0-9A-Fa-f]{6}$")] string CorPrimaria,
    [Required, RegularExpression("^#[0-9A-Fa-f]{6}$")] string CorSecundaria,
    [MaxLength(500)] string? LogoUrl,
    [MaxLength(40)] string? TemplateVisualPadrao = null,
    [RegularExpression("^#[0-9A-Fa-f]{6}$")] string? CorSistemaPrimaria = null,
    [RegularExpression("^#[0-9A-Fa-f]{6}$")] string? CorSistemaSecundaria = null,
    [MaxLength(20)] string? FormatoArquivoPreferido = null,
    [MaxLength(80)] string? Segmento = null,
    [MaxLength(120)] string? CidadeUf = null);
