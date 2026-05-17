using Emprely.Domain.Propostas;

namespace Emprely.UnitTests.Propostas;

public sealed class PropostaTests
{
    [Fact]
    public void CreateProposta_DeveNormalizarCamposECalcularTotal()
    {
        var contaId = Guid.CreateVersion7();
        var clienteId = Guid.CreateVersion7();
        var servicoId = Guid.CreateVersion7();

        var proposta = Proposta.CreateProposta(
            contaId,
            1,
            clienteId,
            " Proposta Social Media ",
            " Introducao ",
            " Observacoes ",
            7,
            new[]
            {
                new PropostaItemDados(
                    servicoId,
                    " Pacote Mensal ",
                    " Gestao de conteudo ",
                    2m,
                    500m)
            });

        var item = Assert.Single(proposta.Itens);

        Assert.Equal(contaId, proposta.ContaId);
        Assert.Equal(1, proposta.Numero);
        Assert.Equal(clienteId, proposta.ClienteId);
        Assert.Equal("Proposta Social Media", proposta.Titulo);
        Assert.Equal("Introducao", proposta.Introducao);
        Assert.Equal("Observacoes", proposta.Observacoes);
        Assert.Equal(7, proposta.ValidadeDias);
        Assert.Equal(StatusProposta.Rascunho, proposta.Status);
        Assert.Equal("Pacote Mensal", item.Nome);
        Assert.Equal("Gestao de conteudo", item.Descricao);
        Assert.Equal(1000m, item.Total);
        Assert.Equal(1000m, proposta.Subtotal);
        Assert.Equal(1000m, proposta.Total);
        Assert.Equal(TemplateVisualProposta.ComercialMinimalista, proposta.TemplateVisual);
    }

    [Fact]
    public void CreateProposta_DeveAplicarTemplateDescontoETextosOpcionais()
    {
        var proposta = Proposta.CreateProposta(
            Guid.CreateVersion7(),
            1,
            Guid.CreateVersion7(),
            "Proposta",
            null,
            null,
            null,
            new[]
            {
                new PropostaItemDados(null, "Item", null, 2m, 500m)
            },
            TemplateVisualProposta.InstagramPremium,
            150m,
            " 50% na aprovacao ",
            new[] { " Planejamento mensal ", "" },
            new[] { " Midia paga " },
            new[] { " Inicio em 3 dias " },
            new[] { " Consistencia " });

        Assert.Equal(TemplateVisualProposta.InstagramPremium, proposta.TemplateVisual);
        Assert.Equal(1000m, proposta.Subtotal);
        Assert.Equal(150m, proposta.DescontoValor);
        Assert.Equal(850m, proposta.Total);
        Assert.Equal("50% na aprovacao", proposta.CondicoesPagamento);
        Assert.Equal("Planejamento mensal", proposta.ItensInclusosTexto);
        Assert.Equal("Midia paga", proposta.ItensNaoInclusosTexto);
        Assert.Equal("Inicio em 3 dias", proposta.CronogramaTexto);
        Assert.Equal("Consistencia", proposta.BeneficiosTexto);
    }

    [Fact]
    public void CreateProposta_DeveRejeitarDescontoMaiorQueSubtotal()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            Proposta.CreateProposta(
                Guid.CreateVersion7(),
                1,
                Guid.CreateVersion7(),
                "Proposta",
                null,
                null,
                null,
                new[]
                {
                    new PropostaItemDados(null, "Item", null, 1m, 100m)
                },
                descontoValor: 101m));

        Assert.Equal("descontoValor", exception.ParamName);
    }

    [Fact]
    public void CreateProposta_DeveRejeitarPropostaSemItem()
    {
        var exception = Assert.Throws<ArgumentException>(() =>
            Proposta.CreateProposta(
                Guid.CreateVersion7(),
                1,
                Guid.CreateVersion7(),
                "Proposta",
                null,
                null,
                null,
                Array.Empty<PropostaItemDados>()));

        Assert.Equal("itens", exception.ParamName);
    }

    [Fact]
    public void CreateProposta_DeveRejeitarQuantidadeInvalida()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            Proposta.CreateProposta(
                Guid.CreateVersion7(),
                1,
                Guid.CreateVersion7(),
                "Proposta",
                null,
                null,
                null,
                new[]
                {
                    new PropostaItemDados(null, "Item", null, 0m, 100m)
                }));

        Assert.Equal("quantidade", exception.ParamName);
    }

    [Fact]
    public void CreateProposta_DeveRejeitarNumeroInvalido()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            Proposta.CreateProposta(
                Guid.CreateVersion7(),
                0,
                Guid.CreateVersion7(),
                "Proposta",
                null,
                null,
                null,
                new[]
                {
                    new PropostaItemDados(null, "Item", null, 1m, 100m)
                }));

        Assert.Equal("numero", exception.ParamName);
    }


    [Fact]
    public void ArquivarProposta_DeveMudarStatus()
    {
        var proposta = CreatePropostaValida();

        proposta.ArquivarProposta();

        Assert.Equal(StatusProposta.Arquivada, proposta.Status);
        Assert.NotNull(proposta.UpdatedAt);
    }

    [Fact]
    public void GerarProposta_DeveMudarStatusParaGerada()
    {
        var proposta = CreatePropostaValida();

        proposta.GerarProposta();

        Assert.Equal(StatusProposta.Gerada, proposta.Status);
        Assert.NotNull(proposta.UpdatedAt);
    }

    [Fact]
    public void GerarProposta_DeveSerIdempotente()
    {
        var proposta = CreatePropostaValida();

        proposta.GerarProposta();
        var updatedAt = proposta.UpdatedAt;

        proposta.GerarProposta();

        Assert.Equal(StatusProposta.Gerada, proposta.Status);
        Assert.Equal(updatedAt, proposta.UpdatedAt);
    }

    [Fact]
    public void AtualizarProposta_DeveVoltarGeradaParaRascunho()
    {
        var proposta = CreatePropostaValida();
        proposta.GerarProposta();

        proposta.AtualizarProposta(
            Guid.CreateVersion7(),
            "Proposta ajustada",
            null,
            null,
            15,
            new[]
            {
                new PropostaItemDados(null, "Item ajustado", null, 1m, 150m)
            });

        Assert.Equal(StatusProposta.Rascunho, proposta.Status);
    }

    [Fact]
    public void AtualizarProposta_DeveVoltarStatusComercialParaRascunho()
    {
        var proposta = CreatePropostaValida();
        proposta.GerarProposta();
        proposta.EnviarProposta();
        proposta.AceitarProposta();

        proposta.AtualizarProposta(
            Guid.CreateVersion7(),
            "Proposta ajustada",
            null,
            null,
            15,
            new[]
            {
                new PropostaItemDados(null, "Item ajustado", null, 1m, 150m)
            });

        Assert.Equal(StatusProposta.Rascunho, proposta.Status);
    }

    [Fact]
    public void GerarProposta_DeveRejeitarPropostaArquivada()
    {
        var proposta = CreatePropostaValida();
        proposta.ArquivarProposta();

        var exception = Assert.Throws<InvalidOperationException>(proposta.GerarProposta);

        Assert.Equal("Proposta arquivada nao pode ser gerada.", exception.Message);
    }

    [Fact]
    public void GerarProposta_DeveRejeitarPropostaEnviada()
    {
        var proposta = CreatePropostaValida();
        proposta.GerarProposta();
        proposta.EnviarProposta();

        var exception = Assert.Throws<InvalidOperationException>(proposta.GerarProposta);

        Assert.Equal("Somente rascunho pode ser gerado.", exception.Message);
    }

    [Fact]
    public void EnviarProposta_DeveMudarStatusParaEnviada()
    {
        var proposta = CreatePropostaValida();
        proposta.GerarProposta();

        proposta.EnviarProposta();

        Assert.Equal(StatusProposta.Enviada, proposta.Status);
        Assert.NotNull(proposta.UpdatedAt);
    }

    [Fact]
    public void EnviarProposta_DeveRejeitarRascunho()
    {
        var proposta = CreatePropostaValida();

        var exception = Assert.Throws<InvalidOperationException>(proposta.EnviarProposta);

        Assert.Equal("Somente proposta gerada pode ser enviada.", exception.Message);
    }

    [Fact]
    public void AceitarProposta_DeveMudarStatusParaAceita()
    {
        var proposta = CreatePropostaValida();
        proposta.GerarProposta();
        proposta.EnviarProposta();

        proposta.AceitarProposta();

        Assert.Equal(StatusProposta.Aceita, proposta.Status);
        Assert.NotNull(proposta.UpdatedAt);
    }

    [Fact]
    public void AceitarProposta_DeveRejeitarPropostaGerada()
    {
        var proposta = CreatePropostaValida();
        proposta.GerarProposta();

        var exception = Assert.Throws<InvalidOperationException>(proposta.AceitarProposta);

        Assert.Equal("Somente proposta enviada pode ser aceita.", exception.Message);
    }

    [Fact]
    public void RecusarProposta_DeveMudarStatusParaRecusada()
    {
        var proposta = CreatePropostaValida();
        proposta.GerarProposta();
        proposta.EnviarProposta();

        proposta.RecusarProposta();

        Assert.Equal(StatusProposta.Recusada, proposta.Status);
        Assert.NotNull(proposta.UpdatedAt);
    }

    [Fact]
    public void RecusarProposta_DeveRejeitarPropostaArquivada()
    {
        var proposta = CreatePropostaValida();
        proposta.ArquivarProposta();

        var exception = Assert.Throws<InvalidOperationException>(proposta.RecusarProposta);

        Assert.Equal("Proposta arquivada nao pode ser recusada.", exception.Message);
    }

    [Fact]
    public void DuplicarProposta_DeveCriarRascunhoComDadosCopiados()
    {
        var proposta = Proposta.CreateProposta(
            Guid.CreateVersion7(),
            12,
            Guid.CreateVersion7(),
            "Proposta original",
            "Introducao",
            "Observacoes",
            15,
            new[]
            {
                new PropostaItemDados(
                    Guid.CreateVersion7(),
                    "Item original",
                    "Descricao",
                    2m,
                    250m)
            });
        proposta.GerarProposta();
        proposta.EnviarProposta();

        var copia = proposta.DuplicarProposta("Proposta original (copia)", 13);

        var itemCopia = Assert.Single(copia.Itens);
        var itemOriginal = Assert.Single(proposta.Itens);
        Assert.NotEqual(proposta.Id, copia.Id);
        Assert.Equal(proposta.ContaId, copia.ContaId);
        Assert.Equal(13, copia.Numero);
        Assert.Equal(proposta.ClienteId, copia.ClienteId);
        Assert.Equal("Proposta original (copia)", copia.Titulo);
        Assert.Equal(proposta.Introducao, copia.Introducao);
        Assert.Equal(proposta.Observacoes, copia.Observacoes);
        Assert.Equal(proposta.ValidadeDias, copia.ValidadeDias);
        Assert.Equal(proposta.TemplateVisual, copia.TemplateVisual);
        Assert.Equal(proposta.DescontoValor, copia.DescontoValor);
        Assert.Equal(proposta.CondicoesPagamento, copia.CondicoesPagamento);
        Assert.Equal(proposta.ItensInclusosTexto, copia.ItensInclusosTexto);
        Assert.Equal(StatusProposta.Rascunho, copia.Status);
        Assert.Equal(proposta.Total, copia.Total);
        Assert.NotEqual(itemOriginal.Id, itemCopia.Id);
        Assert.Equal(itemOriginal.ServicoId, itemCopia.ServicoId);
        Assert.Equal(itemOriginal.Nome, itemCopia.Nome);
        Assert.Equal(itemOriginal.Descricao, itemCopia.Descricao);
        Assert.Equal(itemOriginal.Quantidade, itemCopia.Quantidade);
        Assert.Equal(itemOriginal.ValorUnitario, itemCopia.ValorUnitario);
    }

    [Fact]
    public void DuplicarProposta_DeveRejeitarPropostaArquivada()
    {
        var proposta = CreatePropostaValida();
        proposta.ArquivarProposta();

        var exception = Assert.Throws<InvalidOperationException>(() =>
            proposta.DuplicarProposta("Copia", 2));

        Assert.Equal("Proposta arquivada nao pode ser duplicada.", exception.Message);
    }

    private static Proposta CreatePropostaValida()
    {
        return Proposta.CreateProposta(
            Guid.CreateVersion7(),
            1,
            Guid.CreateVersion7(),
            "Proposta",
            null,
            null,
            null,
            new[]
            {
                new PropostaItemDados(null, "Item", null, 1m, 100m)
            });
    }
}
