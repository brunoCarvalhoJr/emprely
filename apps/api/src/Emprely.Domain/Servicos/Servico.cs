using Emprely.Domain.Common;
using Emprely.Domain.Contas;

namespace Emprely.Domain.Servicos;

public sealed class Servico : EntidadeBase
{
    private Servico()
    {
        Nome = string.Empty;
        Unidade = UnidadeServico.Unico;
        Tipo = TipoServico.Servico;
        Status = StatusServico.Ativo;
    }

    private Servico(
        Guid contaId,
        string nome,
        string? descricao,
        string? categoria,
        decimal preco,
        UnidadeServico unidade,
        TipoServico tipo)
    {
        Nome = string.Empty;
        ContaId = contaId;
        Status = StatusServico.Ativo;
        AtualizarServico(nome, descricao, categoria, preco, unidade, tipo);
        CreatedAt = UpdatedAt ?? CreatedAt;
        UpdatedAt = null;
    }

    public Guid ContaId { get; private set; }

    public string Nome { get; private set; }

    public string? Descricao { get; private set; }

    public string? Categoria { get; private set; }

    public decimal Preco { get; private set; }

    public UnidadeServico Unidade { get; private set; }

    public TipoServico Tipo { get; private set; }

    public StatusServico Status { get; private set; }

    public Conta? Conta { get; private set; }

    public static Servico CreateServico(
        Guid contaId,
        string nome,
        string? descricao,
        string? categoria,
        decimal preco,
        UnidadeServico unidade,
        TipoServico tipo)
    {
        return new Servico(contaId, nome, descricao, categoria, preco, unidade, tipo);
    }

    public void AtualizarServico(
        string nome,
        string? descricao,
        string? categoria,
        decimal preco,
        UnidadeServico unidade,
        TipoServico tipo)
    {
        if (preco < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(preco), "Preco deve ser maior ou igual a zero.");
        }

        Nome = NormalizarObrigatorio(nome, nameof(nome));
        Descricao = NormalizarOpcional(descricao);
        Categoria = NormalizarOpcional(categoria);
        Preco = preco;
        Unidade = unidade;
        Tipo = tipo;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void ArquivarServico()
    {
        if (Status == StatusServico.Arquivado)
        {
            return;
        }

        Status = StatusServico.Arquivado;
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
