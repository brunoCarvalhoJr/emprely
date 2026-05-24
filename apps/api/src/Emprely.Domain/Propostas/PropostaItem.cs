using Emprely.Domain.Common;
using Emprely.Domain.Servicos;

namespace Emprely.Domain.Propostas;

public sealed class PropostaItem : EntidadeBase
{
    private PropostaItem()
    {
        Nome = string.Empty;
    }

    private PropostaItem(
        Guid propostaId,
        Guid? servicoId,
        string nome,
        string? descricao,
        decimal quantidade,
        decimal valorUnitario,
        int ordem)
    {
        Nome = string.Empty;
        PropostaId = propostaId;
        AtualizarItem(servicoId, nome, descricao, quantidade, valorUnitario, ordem);
        CreatedAt = UpdatedAt ?? CreatedAt;
        UpdatedAt = null;
    }

    public Guid PropostaId { get; private set; }

    public Guid? ServicoId { get; private set; }

    public string Nome { get; private set; }

    public string? Descricao { get; private set; }

    public decimal Quantidade { get; private set; }

    public decimal ValorUnitario { get; private set; }

    public int Ordem { get; private set; }

    public decimal Total => Quantidade * ValorUnitario;

    public Proposta? Proposta { get; private set; }

    public Servico? Servico { get; private set; }

    public static PropostaItem CreatePropostaItem(
        Guid propostaId,
        Guid? servicoId,
        string nome,
        string? descricao,
        decimal quantidade,
        decimal valorUnitario,
        int ordem)
    {
        return new PropostaItem(
            propostaId,
            servicoId,
            nome,
            descricao,
            quantidade,
            valorUnitario,
            ordem);
    }

    private void AtualizarItem(
        Guid? servicoId,
        string nome,
        string? descricao,
        decimal quantidade,
        decimal valorUnitario,
        int ordem)
    {
        if (quantidade <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(quantidade), "Quantidade deve ser maior que zero.");
        }

        if (decimal.Truncate(quantidade) != quantidade)
        {
            throw new ArgumentOutOfRangeException(nameof(quantidade), "Quantidade deve ser um numero inteiro.");
        }

        if (valorUnitario < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(valorUnitario), "Valor unitario deve ser maior ou igual a zero.");
        }

        if (ordem <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(ordem), "Ordem deve ser maior que zero.");
        }

        ServicoId = servicoId;
        Nome = NormalizarObrigatorio(nome, nameof(nome));
        Descricao = NormalizarOpcional(descricao);
        Quantidade = quantidade;
        ValorUnitario = valorUnitario;
        Ordem = ordem;
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
}
