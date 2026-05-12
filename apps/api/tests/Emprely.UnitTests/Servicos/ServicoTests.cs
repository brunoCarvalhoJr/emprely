using Emprely.Domain.Servicos;

namespace Emprely.UnitTests.Servicos;

public sealed class ServicoTests
{
    [Fact]
    public void CreateServico_DeveNormalizarCampos()
    {
        var contaId = Guid.CreateVersion7();

        var servico = Servico.CreateServico(
            contaId,
            " Pacote Social Media ",
            " Planejamento mensal ",
            " Social Media ",
            1200.50m,
            UnidadeServico.Mensal,
            TipoServico.Pacote);

        Assert.Equal(contaId, servico.ContaId);
        Assert.Equal("Pacote Social Media", servico.Nome);
        Assert.Equal("Planejamento mensal", servico.Descricao);
        Assert.Equal("Social Media", servico.Categoria);
        Assert.Equal(1200.50m, servico.Preco);
        Assert.Equal(UnidadeServico.Mensal, servico.Unidade);
        Assert.Equal(TipoServico.Pacote, servico.Tipo);
        Assert.Equal(StatusServico.Ativo, servico.Status);
    }

    [Fact]
    public void CreateServico_DeveRejeitarPrecoNegativo()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            Servico.CreateServico(
                Guid.CreateVersion7(),
                "Consultoria",
                null,
                null,
                -1m,
                UnidadeServico.Unico,
                TipoServico.Servico));

        Assert.Equal("preco", exception.ParamName);
    }

    [Fact]
    public void ArquivarServico_DeveMudarStatus()
    {
        var servico = Servico.CreateServico(
            Guid.CreateVersion7(),
            "Consultoria",
            null,
            null,
            300m,
            UnidadeServico.Unico,
            TipoServico.Servico);

        servico.ArquivarServico();

        Assert.Equal(StatusServico.Arquivado, servico.Status);
        Assert.NotNull(servico.UpdatedAt);
    }
}
