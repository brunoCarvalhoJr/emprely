using Emprely.Domain.Common;
using Emprely.Domain.Propostas;

namespace Emprely.Domain.Contas;

public sealed class PerfilConta : EntidadeBase
{
    public const string CorPrimariaPadrao = "#6E38FF";
    public const string CorSecundariaPadrao = "#13C7BD";
    public const string CorSistemaPrimariaPadrao = "#6E38FF";
    public const string CorSistemaSecundariaPadrao = "#13C7BD";

    private PerfilConta()
    {
        NomeComercial = string.Empty;
        CorPrimaria = CorPrimariaPadrao;
        CorSecundaria = CorSecundariaPadrao;
        CorSistemaPrimaria = CorSistemaPrimariaPadrao;
        CorSistemaSecundaria = CorSistemaSecundariaPadrao;
        TemplateVisualPadrao = TemplateVisualProposta.ComercialMinimalista;
    }

    private PerfilConta(
        Guid contaId,
        string nomeComercial,
        string? emailContato,
        string? telefoneContato,
        string? siteUrl,
        string? instagram,
        string? documento,
        string corPrimaria,
        string corSecundaria,
        string? logoUrl,
        TemplateVisualProposta templateVisualPadrao,
        string corSistemaPrimaria,
        string corSistemaSecundaria)
    {
        ContaId = contaId;
        NomeComercial = nomeComercial;
        EmailContato = emailContato;
        TelefoneContato = telefoneContato;
        SiteUrl = siteUrl;
        Instagram = instagram;
        Documento = documento;
        CorPrimaria = corPrimaria;
        CorSecundaria = corSecundaria;
        CorSistemaPrimaria = corSistemaPrimaria;
        CorSistemaSecundaria = corSistemaSecundaria;
        LogoUrl = logoUrl;
        TemplateVisualPadrao = templateVisualPadrao;
    }

    public Guid ContaId { get; private set; }

    public string NomeComercial { get; private set; }

    public string? EmailContato { get; private set; }

    public string? TelefoneContato { get; private set; }

    public string? SiteUrl { get; private set; }

    public string? Instagram { get; private set; }

    public string? Documento { get; private set; }

    public string CorPrimaria { get; private set; }

    public string CorSecundaria { get; private set; }

    public string CorSistemaPrimaria { get; private set; }

    public string CorSistemaSecundaria { get; private set; }

    public string? LogoUrl { get; private set; }

    public TemplateVisualProposta TemplateVisualPadrao { get; private set; }

    public Conta? Conta { get; private set; }

    public static PerfilConta CreatePerfilConta(
        Guid contaId,
        string nomeComercial,
        string? emailContato,
        string? telefoneContato,
        string? siteUrl,
        string? instagram,
        string? documento,
        string corPrimaria,
        string corSecundaria,
        string? logoUrl,
        TemplateVisualProposta templateVisualPadrao = TemplateVisualProposta.ComercialMinimalista,
        string? corSistemaPrimaria = null,
        string? corSistemaSecundaria = null)
    {
        var perfilConta = new PerfilConta();
        perfilConta.ContaId = contaId;
        perfilConta.AtualizarPerfilConta(
            nomeComercial,
            emailContato,
            telefoneContato,
            siteUrl,
            instagram,
            documento,
            corPrimaria,
            corSecundaria,
            logoUrl,
            templateVisualPadrao,
            corSistemaPrimaria,
            corSistemaSecundaria);

        return perfilConta;
    }

    public void AtualizarPerfilConta(
        string nomeComercial,
        string? emailContato,
        string? telefoneContato,
        string? siteUrl,
        string? instagram,
        string? documento,
        string corPrimaria,
        string corSecundaria,
        string? logoUrl,
        TemplateVisualProposta templateVisualPadrao = TemplateVisualProposta.ComercialMinimalista,
        string? corSistemaPrimaria = null,
        string? corSistemaSecundaria = null)
    {
        NomeComercial = NormalizarObrigatorio(nomeComercial, nameof(nomeComercial));
        EmailContato = NormalizarOpcional(emailContato);
        TelefoneContato = NormalizarOpcional(telefoneContato);
        SiteUrl = NormalizarOpcional(siteUrl);
        Instagram = NormalizarInstagram(instagram);
        Documento = NormalizarOpcional(documento);
        CorPrimaria = NormalizarCor(corPrimaria, nameof(corPrimaria));
        CorSecundaria = NormalizarCor(corSecundaria, nameof(corSecundaria));
        CorSistemaPrimaria = NormalizarCor(
            corSistemaPrimaria ?? CorSistemaPrimariaPadrao,
            nameof(corSistemaPrimaria));
        CorSistemaSecundaria = NormalizarCor(
            corSistemaSecundaria ?? CorSistemaSecundariaPadrao,
            nameof(corSistemaSecundaria));
        LogoUrl = NormalizarOpcional(logoUrl);
        TemplateVisualPadrao = templateVisualPadrao;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static string NormalizarObrigatorio(string valor, string nomeParametro)
    {
        var valorNormalizado = valor.Trim();

        if (string.IsNullOrWhiteSpace(valorNormalizado))
        {
            throw new ArgumentException("Valor obrigatorio.", nomeParametro);
        }

        return valorNormalizado;
    }

    private static string? NormalizarOpcional(string? valor)
    {
        var valorNormalizado = valor?.Trim();
        return string.IsNullOrWhiteSpace(valorNormalizado) ? null : valorNormalizado;
    }

    private static string? NormalizarInstagram(string? instagram)
    {
        var instagramNormalizado = NormalizarOpcional(instagram);

        if (instagramNormalizado is null || instagramNormalizado.StartsWith('@'))
        {
            return instagramNormalizado;
        }

        return $"@{instagramNormalizado}";
    }

    private static string NormalizarCor(string valor, string nomeParametro)
    {
        var cor = NormalizarObrigatorio(valor, nomeParametro).ToUpperInvariant();

        if (cor.Length != 7 || cor[0] != '#' || cor.Skip(1).Any(caractere => !Uri.IsHexDigit(caractere)))
        {
            throw new ArgumentException("Cor deve usar formato #RRGGBB.", nomeParametro);
        }

        return cor;
    }
}
