using Emprely.Domain.Clientes;
using Emprely.Domain.Common;
using Emprely.Domain.Contas;

namespace Emprely.Domain.Propostas;

public sealed class Proposta : EntidadeBase
{
    private const int TextoCurtoMaxLength = 1000;
    private const int TextoListaMaxLength = 4000;

    private Proposta()
    {
        Titulo = string.Empty;
        Status = StatusProposta.Rascunho;
        TemplateVisual = TemplateVisualProposta.ComercialMinimalista;
    }

    private Proposta(
        Guid contaId,
        int numero,
        Guid clienteId,
        string titulo,
        string? introducao,
        string? observacoes,
        int? validadeDias,
        IEnumerable<PropostaItemDados> itens,
        TemplateVisualProposta templateVisual,
        decimal descontoValor,
        string? condicoesPagamento,
        IEnumerable<string>? itensInclusos,
        IEnumerable<string>? itensNaoInclusos,
        IEnumerable<string>? cronograma,
        IEnumerable<string>? beneficios)
    {
        Titulo = string.Empty;
        ContaId = contaId;
        Numero = ValidarNumeroProposta(numero);
        Status = StatusProposta.Rascunho;
        TemplateVisual = TemplateVisualProposta.ComercialMinimalista;
        AtualizarProposta(
            clienteId,
            titulo,
            introducao,
            observacoes,
            validadeDias,
            itens,
            templateVisual,
            descontoValor,
            condicoesPagamento,
            itensInclusos,
            itensNaoInclusos,
            cronograma,
            beneficios);
        CreatedAt = UpdatedAt ?? CreatedAt;
        UpdatedAt = null;
    }

    public Guid ContaId { get; private set; }

    public int Numero { get; private set; }

    public Guid ClienteId { get; private set; }

    public string Titulo { get; private set; }

    public string? Introducao { get; private set; }

    public string? Observacoes { get; private set; }

    public int? ValidadeDias { get; private set; }

    public StatusProposta Status { get; private set; }

    public TemplateVisualProposta TemplateVisual { get; private set; }

    public decimal DescontoValor { get; private set; }

    public string? CondicoesPagamento { get; private set; }

    public string? ItensInclusosTexto { get; private set; }

    public string? ItensNaoInclusosTexto { get; private set; }

    public string? CronogramaTexto { get; private set; }

    public string? BeneficiosTexto { get; private set; }

    public ICollection<PropostaItem> Itens { get; private set; } = new List<PropostaItem>();

    public decimal Subtotal => Itens.Sum(item => item.Total);

    public decimal Total => Subtotal - DescontoValor;

    public Conta? Conta { get; private set; }

    public Cliente? Cliente { get; private set; }

    public static Proposta CreateProposta(
        Guid contaId,
        int numero,
        Guid clienteId,
        string titulo,
        string? introducao,
        string? observacoes,
        int? validadeDias,
        IEnumerable<PropostaItemDados> itens,
        TemplateVisualProposta templateVisual = TemplateVisualProposta.ComercialMinimalista,
        decimal descontoValor = 0,
        string? condicoesPagamento = null,
        IEnumerable<string>? itensInclusos = null,
        IEnumerable<string>? itensNaoInclusos = null,
        IEnumerable<string>? cronograma = null,
        IEnumerable<string>? beneficios = null)
    {
        return new Proposta(
            contaId,
            numero,
            clienteId,
            titulo,
            introducao,
            observacoes,
            validadeDias,
            itens,
            templateVisual,
            descontoValor,
            condicoesPagamento,
            itensInclusos,
            itensNaoInclusos,
            cronograma,
            beneficios);
    }

    public void AtualizarProposta(
        Guid clienteId,
        string titulo,
        string? introducao,
        string? observacoes,
        int? validadeDias,
        IEnumerable<PropostaItemDados> itens,
        TemplateVisualProposta templateVisual = TemplateVisualProposta.ComercialMinimalista,
        decimal descontoValor = 0,
        string? condicoesPagamento = null,
        IEnumerable<string>? itensInclusos = null,
        IEnumerable<string>? itensNaoInclusos = null,
        IEnumerable<string>? cronograma = null,
        IEnumerable<string>? beneficios = null)
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

        var novosItens = new List<PropostaItem>();
        var ordem = 1;
        foreach (var item in itensNormalizados)
        {
            novosItens.Add(PropostaItem.CreatePropostaItem(
                Id,
                item.ServicoId,
                item.Nome,
                item.Descricao,
                item.Quantidade,
                item.ValorUnitario,
                ordem));
            ordem++;
        }

        var subtotal = novosItens.Sum(item => item.Total);
        var descontoNormalizado = ValidarDesconto(descontoValor, subtotal);

        ClienteId = clienteId;
        Titulo = NormalizarObrigatorio(titulo, nameof(titulo));
        Introducao = NormalizarTextoOpcional(introducao, nameof(introducao), TextoCurtoMaxLength);
        Observacoes = NormalizarTextoOpcional(observacoes, nameof(observacoes), TextoCurtoMaxLength);
        ValidadeDias = validadeDias;
        TemplateVisual = templateVisual;
        DescontoValor = descontoNormalizado;
        CondicoesPagamento = NormalizarTextoOpcional(condicoesPagamento, nameof(condicoesPagamento), TextoCurtoMaxLength);
        ItensInclusosTexto = NormalizarLinhas(itensInclusos, nameof(itensInclusos));
        ItensNaoInclusosTexto = NormalizarLinhas(itensNaoInclusos, nameof(itensNaoInclusos));
        CronogramaTexto = NormalizarLinhas(cronograma, nameof(cronograma));
        BeneficiosTexto = NormalizarLinhas(beneficios, nameof(beneficios));

        Itens.Clear();
        foreach (var item in novosItens)
        {
            Itens.Add(item);
        }

        if (Status != StatusProposta.Rascunho && Status != StatusProposta.Arquivada)
        {
            Status = StatusProposta.Rascunho;
        }

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void GerarProposta()
    {
        if (Status == StatusProposta.Arquivada)
        {
            throw new InvalidOperationException("Proposta arquivada nao pode ser gerada.");
        }

        if (Status == StatusProposta.Gerada)
        {
            return;
        }

        if (Status != StatusProposta.Rascunho)
        {
            throw new InvalidOperationException("Somente rascunho pode ser gerado.");
        }

        if (Itens.Count == 0)
        {
            throw new InvalidOperationException("Proposta deve ter pelo menos um item.");
        }

        if (string.IsNullOrWhiteSpace(Titulo))
        {
            throw new InvalidOperationException("Proposta deve ter titulo.");
        }

        Status = StatusProposta.Gerada;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void EnviarProposta()
    {
        if (Status == StatusProposta.Arquivada)
        {
            throw new InvalidOperationException("Proposta arquivada nao pode ser enviada.");
        }

        if (Status != StatusProposta.Gerada)
        {
            throw new InvalidOperationException("Somente proposta gerada pode ser enviada.");
        }

        Status = StatusProposta.Enviada;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AceitarProposta()
    {
        if (Status == StatusProposta.Arquivada)
        {
            throw new InvalidOperationException("Proposta arquivada nao pode ser aceita.");
        }

        if (Status != StatusProposta.Enviada)
        {
            throw new InvalidOperationException("Somente proposta enviada pode ser aceita.");
        }

        Status = StatusProposta.Aceita;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void RecusarProposta()
    {
        if (Status == StatusProposta.Arquivada)
        {
            throw new InvalidOperationException("Proposta arquivada nao pode ser recusada.");
        }

        if (Status != StatusProposta.Enviada)
        {
            throw new InvalidOperationException("Somente proposta enviada pode ser recusada.");
        }

        Status = StatusProposta.Recusada;
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

    public Proposta DuplicarProposta(string tituloCopia, int numeroCopia)
    {
        if (Status == StatusProposta.Arquivada)
        {
            throw new InvalidOperationException("Proposta arquivada nao pode ser duplicada.");
        }

        var itensCopia = Itens
            .OrderBy(item => item.Ordem)
            .Select(item => new PropostaItemDados(
                item.ServicoId,
                item.Nome,
                item.Descricao,
                item.Quantidade,
                item.ValorUnitario))
            .ToList();

        return CreateProposta(
            ContaId,
            numeroCopia,
            ClienteId,
            tituloCopia,
            Introducao,
            Observacoes,
            ValidadeDias,
            itensCopia,
            TemplateVisual,
            DescontoValor,
            CondicoesPagamento,
            QuebrarLinhas(ItensInclusosTexto),
            QuebrarLinhas(ItensNaoInclusosTexto),
            QuebrarLinhas(CronogramaTexto),
            QuebrarLinhas(BeneficiosTexto));
    }

    private static int ValidarNumeroProposta(int numero)
    {
        if (numero < 1)
        {
            throw new ArgumentOutOfRangeException(nameof(numero), "Numero da proposta deve ser maior que zero.");
        }

        return numero;
    }

    private static decimal ValidarDesconto(decimal descontoValor, decimal subtotal)
    {
        if (descontoValor < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(descontoValor), "Desconto nao pode ser negativo.");
        }

        if (descontoValor > subtotal)
        {
            throw new ArgumentOutOfRangeException(nameof(descontoValor), "Desconto nao pode ser maior que o subtotal.");
        }

        return decimal.Round(descontoValor, 2, MidpointRounding.AwayFromZero);
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

    private static string? NormalizarTextoOpcional(string? valor, string nomeParametro, int maxLength)
    {
        var valorNormalizado = valor?.Trim();

        if (string.IsNullOrWhiteSpace(valorNormalizado))
        {
            return null;
        }

        if (valorNormalizado.Length > maxLength)
        {
            throw new ArgumentException($"Texto deve ter no maximo {maxLength} caracteres.", nomeParametro);
        }

        return valorNormalizado;
    }

    private static string? NormalizarLinhas(IEnumerable<string>? valores, string nomeParametro)
    {
        if (valores is null)
        {
            return null;
        }

        var linhas = valores
            .Select(valor => valor.Trim())
            .Where(valor => !string.IsNullOrWhiteSpace(valor))
            .ToList();

        if (linhas.Count == 0)
        {
            return null;
        }

        var texto = string.Join('\n', linhas);
        if (texto.Length > TextoListaMaxLength)
        {
            throw new ArgumentException($"Texto deve ter no maximo {TextoListaMaxLength} caracteres.", nomeParametro);
        }

        return texto;
    }

    private static IReadOnlyList<string> QuebrarLinhas(string? texto)
    {
        if (string.IsNullOrWhiteSpace(texto))
        {
            return Array.Empty<string>();
        }

        return texto
            .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToList();
    }
}
