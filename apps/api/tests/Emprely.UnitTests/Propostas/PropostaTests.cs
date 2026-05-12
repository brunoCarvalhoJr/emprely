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
        Assert.Equal(clienteId, proposta.ClienteId);
        Assert.Equal("Proposta Social Media", proposta.Titulo);
        Assert.Equal("Introducao", proposta.Introducao);
        Assert.Equal("Observacoes", proposta.Observacoes);
        Assert.Equal(7, proposta.ValidadeDias);
        Assert.Equal(StatusProposta.Rascunho, proposta.Status);
        Assert.Equal("Pacote Mensal", item.Nome);
        Assert.Equal("Gestao de conteudo", item.Descricao);
        Assert.Equal(1000m, item.Total);
        Assert.Equal(1000m, proposta.Total);
    }

    [Fact]
    public void CreateProposta_DeveRejeitarPropostaSemItem()
    {
        var exception = Assert.Throws<ArgumentException>(() =>
            Proposta.CreateProposta(
                Guid.CreateVersion7(),
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
    public void ArquivarProposta_DeveMudarStatus()
    {
        var proposta = Proposta.CreateProposta(
            Guid.CreateVersion7(),
            Guid.CreateVersion7(),
            "Proposta",
            null,
            null,
            null,
            new[]
            {
                new PropostaItemDados(null, "Item", null, 1m, 100m)
            });

        proposta.ArquivarProposta();

        Assert.Equal(StatusProposta.Arquivada, proposta.Status);
        Assert.NotNull(proposta.UpdatedAt);
    }
}
