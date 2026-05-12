using Emprely.Domain.Contas;

namespace Emprely.UnitTests.Contas;

public sealed class PerfilContaTests
{
    [Fact]
    public void CreatePerfilConta_DeveNormalizarCoresEInstagram()
    {
        var contaId = Guid.CreateVersion7();

        var perfilConta = PerfilConta.CreatePerfilConta(
            contaId,
            " Emprely Studio ",
            " contato@emprely.dev ",
            "+55 11 99999-9999",
            "https://emprely.com",
            "emprely",
            "00.000.000/0001-00",
            "#0f766e",
            "#2563eb",
            "https://emprely.com/logo.png");

        Assert.Equal(contaId, perfilConta.ContaId);
        Assert.Equal("Emprely Studio", perfilConta.NomeComercial);
        Assert.Equal("contato@emprely.dev", perfilConta.EmailContato);
        Assert.Equal("@emprely", perfilConta.Instagram);
        Assert.Equal("#0F766E", perfilConta.CorPrimaria);
        Assert.Equal("#2563EB", perfilConta.CorSecundaria);
    }

    [Fact]
    public void AtualizarPerfilConta_DeveRejeitarCorInvalida()
    {
        var perfilConta = PerfilConta.CreatePerfilConta(
            Guid.CreateVersion7(),
            "Emprely",
            null,
            null,
            null,
            null,
            null,
            PerfilConta.CorPrimariaPadrao,
            PerfilConta.CorSecundariaPadrao,
            null);

        var exception = Assert.Throws<ArgumentException>(() =>
            perfilConta.AtualizarPerfilConta(
                "Emprely",
                null,
                null,
                null,
                null,
                null,
                "azul",
                PerfilConta.CorSecundariaPadrao,
                null));

        Assert.Equal("corPrimaria", exception.ParamName);
    }
}
