using Emprely.Domain.Common;
using Emprely.Domain.Contas;
using Emprely.Domain.Propostas;

namespace Emprely.Domain.Clientes;

public sealed class Cliente : EntidadeBase
{
    private Cliente()
    {
        Nome = string.Empty;
        Status = StatusCliente.Ativo;
    }

    private Cliente(
        Guid contaId,
        string nome,
        string? email,
        string? telefone,
        string? documento,
        string? endereco,
        string? numero,
        string? cidade,
        string? instagram,
        string? facebook,
        string? tiktok,
        string? observacoes)
    {
        Nome = string.Empty;
        ContaId = contaId;
        Status = StatusCliente.Ativo;
        AtualizarCliente(
            nome,
            email,
            telefone,
            documento,
            endereco,
            numero,
            cidade,
            instagram,
            facebook,
            tiktok,
            observacoes);
        CreatedAt = UpdatedAt ?? CreatedAt;
        UpdatedAt = null;
    }

    public Guid ContaId { get; private set; }

    public string Nome { get; private set; }

    public string? Email { get; private set; }

    public string? Telefone { get; private set; }

    public string? Documento { get; private set; }

    public string? Endereco { get; private set; }

    public string? Numero { get; private set; }

    public string? Cidade { get; private set; }

    public string? Instagram { get; private set; }

    public string? Facebook { get; private set; }

    public string? TikTok { get; private set; }

    public string? Observacoes { get; private set; }

    public StatusCliente Status { get; private set; }

    public Conta? Conta { get; private set; }

    public ICollection<Proposta> Propostas { get; private set; } = new List<Proposta>();

    public static Cliente CreateCliente(
        Guid contaId,
        string nome,
        string? email,
        string? telefone,
        string? documento,
        string? endereco,
        string? numero,
        string? cidade,
        string? instagram,
        string? facebook,
        string? tiktok,
        string? observacoes)
    {
        return new Cliente(
            contaId,
            nome,
            email,
            telefone,
            documento,
            endereco,
            numero,
            cidade,
            instagram,
            facebook,
            tiktok,
            observacoes);
    }

    public void AtualizarCliente(
        string nome,
        string? email,
        string? telefone,
        string? documento,
        string? endereco,
        string? numero,
        string? cidade,
        string? instagram,
        string? facebook,
        string? tiktok,
        string? observacoes)
    {
        Nome = NormalizarObrigatorio(nome, nameof(nome));
        Email = NormalizarEmail(email);
        Telefone = NormalizarTelefoneWhatsapp(telefone);
        Documento = NormalizarOpcional(documento);
        Endereco = NormalizarOpcional(endereco);
        Numero = NormalizarOpcional(numero);
        Cidade = NormalizarOpcional(cidade);
        Instagram = NormalizarOpcional(instagram);
        Facebook = NormalizarOpcional(facebook);
        TikTok = NormalizarOpcional(tiktok);
        Observacoes = NormalizarOpcional(observacoes);
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void ArquivarCliente()
    {
        if (Status == StatusCliente.Arquivado)
        {
            return;
        }

        Status = StatusCliente.Arquivado;
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

    private static string? NormalizarEmail(string? email)
    {
        return NormalizarOpcional(email)?.ToLowerInvariant();
    }

    public static bool IsTelefoneWhatsappValido(string? telefone)
    {
        var telefoneNormalizado = NormalizarOpcional(telefone);

        if (telefoneNormalizado is null)
        {
            return true;
        }

        if (telefoneNormalizado.StartsWith('+') &&
            !telefoneNormalizado.StartsWith("+55", StringComparison.Ordinal))
        {
            return false;
        }

        var digitos = new string(telefoneNormalizado.Where(char.IsDigit).ToArray());

        if (digitos.StartsWith("55", StringComparison.Ordinal))
        {
            return digitos.Length is 12 or 13;
        }

        return digitos.Length is 10 or 11;
    }

    private static string? NormalizarTelefoneWhatsapp(string? telefone)
    {
        var telefoneNormalizado = NormalizarOpcional(telefone);

        if (telefoneNormalizado is null)
        {
            return null;
        }

        if (!IsTelefoneWhatsappValido(telefoneNormalizado))
        {
            throw new ArgumentException(
                "Telefone deve conter DDD e numero, com ou sem prefixo 55.",
                nameof(telefone));
        }

        return telefoneNormalizado;
    }

    private static string? NormalizarOpcional(string? valor)
    {
        var valorNormalizado = valor?.Trim();
        return string.IsNullOrWhiteSpace(valorNormalizado) ? null : valorNormalizado;
    }
}
