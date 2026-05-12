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
        string? observacoes)
    {
        Nome = string.Empty;
        ContaId = contaId;
        Status = StatusCliente.Ativo;
        AtualizarCliente(nome, email, telefone, documento, observacoes);
        CreatedAt = UpdatedAt ?? CreatedAt;
        UpdatedAt = null;
    }

    public Guid ContaId { get; private set; }

    public string Nome { get; private set; }

    public string? Email { get; private set; }

    public string? Telefone { get; private set; }

    public string? Documento { get; private set; }

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
        string? observacoes)
    {
        return new Cliente(contaId, nome, email, telefone, documento, observacoes);
    }

    public void AtualizarCliente(
        string nome,
        string? email,
        string? telefone,
        string? documento,
        string? observacoes)
    {
        Nome = NormalizarObrigatorio(nome, nameof(nome));
        Email = NormalizarEmail(email);
        Telefone = NormalizarOpcional(telefone);
        Documento = NormalizarOpcional(documento);
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

    private static string? NormalizarOpcional(string? valor)
    {
        var valorNormalizado = valor?.Trim();
        return string.IsNullOrWhiteSpace(valorNormalizado) ? null : valorNormalizado;
    }
}
