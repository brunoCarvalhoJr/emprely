using Emprely.Domain.Clientes;
using Emprely.Domain.Common;
using Emprely.Domain.Contas;

namespace Emprely.Domain.Propostas;

public sealed class Proposta : EntidadeBase
{
    private Proposta()
    {
        Titulo = string.Empty;
        Status = StatusProposta.Rascunho;
    }

    private Proposta(
        Guid contaId,
        Guid clienteId,
        string titulo,
        string? introducao,
        string? observacoes,
        int? validadeDias,
        IEnumerable<PropostaItemDados> itens)
    {
        Titulo = string.Empty;
        ContaId = contaId;
        Status = StatusProposta.Rascunho;
        AtualizarProposta(clienteId, titulo, introducao, observacoes, validadeDias, itens);
        CreatedAt = UpdatedAt ?? CreatedAt;
        UpdatedAt = null;
    }

    public Guid ContaId { get; private set; }

    public Guid ClienteId { get; private set; }

    public string Titulo { get; private set; }

    public string? Introducao { get; private set; }

    public string? Observacoes { get; private set; }

    public int? ValidadeDias { get; private set; }

    public StatusProposta Status { get; private set; }

    public ICollection<PropostaItem> Itens { get; private set; } = new List<PropostaItem>();

    public decimal Total => Itens.Sum(item => item.Total);

    public Conta? Conta { get; private set; }

    public Cliente? Cliente { get; private set; }

    public static Proposta CreateProposta(
        Guid contaId,
        Guid clienteId,
        string titulo,
        string? introducao,
        string? observacoes,
        int? validadeDias,
        IEnumerable<PropostaItemDados> itens)
    {
        return new Proposta(contaId, clienteId, titulo, introducao, observacoes, validadeDias, itens);
    }

    public void AtualizarProposta(
        Guid clienteId,
        string titulo,
        string? introducao,
        string? observacoes,
        int? validadeDias,
        IEnumerable<PropostaItemDados> itens)
    {
        var itensNormalizados = itens.ToList();

        if (itensNormalizados.Count == 0)
        {
            throw new ArgumentException("Proposta deve ter pelo menos um item.", nameof(itens));
        }

        if (itensNormalizados.Count > 50)
        {
            throw new ArgumentException("Proposta deve ter no maximo 50 itens.", nameof(itens));
        }

        if (validadeDias is < 1 or > 365)
        {
            throw new ArgumentOutOfRangeException(nameof(validadeDias), "Validade deve estar entre 1 e 365 dias.");
        }

        ClienteId = clienteId;
        Titulo = NormalizarObrigatorio(titulo, nameof(titulo));
        Introducao = NormalizarOpcional(introducao);
        Observacoes = NormalizarOpcional(observacoes);
        ValidadeDias = validadeDias;
        Itens.Clear();

        var ordem = 1;
        foreach (var item in itensNormalizados)
        {
            Itens.Add(PropostaItem.CreatePropostaItem(
                Id,
                item.ServicoId,
                item.Nome,
                item.Descricao,
                item.Quantidade,
                item.ValorUnitario,
                ordem));
            ordem++;
        }

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void ArquivarProposta()
    {
        if (Status == StatusProposta.Arquivada)
        {
            return;
        }

        Status = StatusProposta.Arquivada;
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
