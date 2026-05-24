using Emprely.Domain.Clientes;

namespace Emprely.UnitTests.Clientes;

public sealed class ClienteTests
{
    [Fact]
    public void CreateCliente_DeveNormalizarCampos()
    {
        var contaId = Guid.CreateVersion7();

        var cliente = Cliente.CreateCliente(
            contaId,
            " Maria Cliente ",
            " MARIA@CLIENTE.COM ",
            " +55 11 99999-9999 ",
            " 123.456.789-00 ",
            " Rua das Flores ",
            " 123A ",
            " Sao Paulo ",
            " @mariacliente ",
            " facebook.com/mariacliente ",
            " @mariatiktok ",
            " Cliente recorrente ");

        Assert.Equal(contaId, cliente.ContaId);
        Assert.Equal("Maria Cliente", cliente.Nome);
        Assert.Equal("maria@cliente.com", cliente.Email);
        Assert.Equal("+55 11 99999-9999", cliente.Telefone);
        Assert.Equal("123.456.789-00", cliente.Documento);
        Assert.Equal("Rua das Flores", cliente.Endereco);
        Assert.Equal("123A", cliente.Numero);
        Assert.Equal("Sao Paulo", cliente.Cidade);
        Assert.Equal("@mariacliente", cliente.Instagram);
        Assert.Equal("facebook.com/mariacliente", cliente.Facebook);
        Assert.Equal("@mariatiktok", cliente.TikTok);
        Assert.Equal("Cliente recorrente", cliente.Observacoes);
        Assert.Equal(StatusCliente.Ativo, cliente.Status);
    }

    [Fact]
    public void ArquivarCliente_DeveMudarStatus()
    {
        var cliente = Cliente.CreateCliente(
            Guid.CreateVersion7(),
            "Maria Cliente",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null);

        cliente.ArquivarCliente();

        Assert.Equal(StatusCliente.Arquivado, cliente.Status);
        Assert.NotNull(cliente.UpdatedAt);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("(11) 99999-9999")]
    [InlineData("11999999999")]
    [InlineData("+55 11 99999-9999")]
    public void CreateCliente_DeveAceitarTelefoneWhatsappValido(string? telefone)
    {
        var cliente = Cliente.CreateCliente(
            Guid.CreateVersion7(),
            "Maria Cliente",
            null,
            telefone,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null);

        Assert.True(Cliente.IsTelefoneWhatsappValido(telefone));
        Assert.Equal(string.IsNullOrWhiteSpace(telefone) ? null : telefone.Trim(), cliente.Telefone);
    }

    [Theory]
    [InlineData("9999")]
    [InlineData("55")]
    [InlineData("+55 11 999")]
    [InlineData("123456789")]
    [InlineData("+1 555 123 4567")]
    public void CreateCliente_DeveRejeitarTelefoneWhatsappInvalido(string telefone)
    {
        var exception = Assert.Throws<ArgumentException>(() =>
            Cliente.CreateCliente(
                Guid.CreateVersion7(),
                "Maria Cliente",
                null,
                telefone,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null));

        Assert.False(Cliente.IsTelefoneWhatsappValido(telefone));
        Assert.Equal("telefone", exception.ParamName);
    }
}
