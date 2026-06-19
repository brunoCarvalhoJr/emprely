using Emprely.Api.Comunicacoes;
using Emprely.Domain.Comunicacoes;

namespace Emprely.IntegrationTests;

public sealed class EmailTransacionalTemplateBuilderTests
{
    public static IEnumerable<object[]> TiposEmailTransacional()
    {
        foreach (var tipo in Enum.GetValues<TipoEmailTransacional>())
        {
            yield return [tipo];
        }
    }

    [Theory]
    [MemberData(nameof(TiposEmailTransacional))]
    public void Build_DeveGerarTextosEmUtf8SemMojibake(TipoEmailTransacional tipo)
    {
        var mensagem = EmailTransacionalTemplateBuilder.Build(
            contaId: null,
            usuarioId: Guid.CreateVersion7(),
            tipo,
            destinatario: "cliente@exemplo.com",
            assunto: "Confirmação de teste no Emprely",
            texto: "Confirme sua solicitação em https://app.emprely.com.br/?token=abc para acessar seus orçamentos.",
            publicWebUrl: "https://app.emprely.com.br",
            tokenHash: null);

        var conteudo = $"{mensagem.Assunto}\n{mensagem.Html}\n{mensagem.Texto}";

        Assert.DoesNotContain("Ã", conteudo);
        Assert.DoesNotContain("Â", conteudo);
        Assert.Contains("Confirmação de teste no Emprely", conteudo);
        Assert.Contains("orçamentos", conteudo, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Build_ConfirmacaoEmail_DeveManterAcentuacaoPtBr()
    {
        var mensagem = EmailTransacionalTemplateBuilder.Build(
            contaId: null,
            usuarioId: Guid.CreateVersion7(),
            TipoEmailTransacional.ConfirmacaoEmail,
            destinatario: "cliente@exemplo.com",
            assunto: "Confirme seu e-mail no Emprely",
            texto: "Confirme seu e-mail em https://app.emprely.com.br/?auth=confirm-email.",
            publicWebUrl: "https://app.emprely.com.br",
            tokenHash: null);

        Assert.Contains("Depois da confirmação, você já pode cadastrar clientes", mensagem.Texto);
        Assert.Contains("serviços", mensagem.Texto);
        Assert.Contains("Se você não solicitou este cadastro", mensagem.Texto);
    }
}
