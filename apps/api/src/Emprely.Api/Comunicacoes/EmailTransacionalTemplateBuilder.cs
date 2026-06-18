using Emprely.Application.Comunicacoes;
using Emprely.Domain.Comunicacoes;
using System.Text;
using System.Text.Encodings.Web;

namespace Emprely.Api.Comunicacoes;

public static class EmailTransacionalTemplateBuilder
{
    public static EmailTransacionalMensagem Build(
        Guid? contaId,
        Guid? usuarioId,
        TipoEmailTransacional tipo,
        string destinatario,
        string assunto,
        string texto,
        string publicWebUrl,
        string? tokenHash = null)
    {
        var publicWebUrlNormalizada = NormalizarPublicWebUrl(publicWebUrl);
        var loginUrl = BuildPublicWebUrl(publicWebUrlNormalizada, "/login");
        var logoUrl = BuildPublicWebUrl(publicWebUrlNormalizada, "/brand/emprely-logo-dark.png");
        var conteudo = CriarConteudoEmail(tipo, assunto, texto, loginUrl);
        var html = BuildEmailHtml(conteudo, logoUrl);
        var textoAlternativo = BuildEmailTexto(assunto, conteudo);

        return new EmailTransacionalMensagem(
            contaId,
            usuarioId,
            tipo,
            destinatario,
            assunto,
            html,
            textoAlternativo,
            tokenHash);
    }

    private static EmailTransacionalConteudo CriarConteudoEmail(
        TipoEmailTransacional tipo,
        string assunto,
        string texto,
        string loginUrl)
    {
        var urlAcao = ExtrairPrimeiraUrl(texto);

        return tipo switch
        {
            TipoEmailTransacional.ConfirmacaoEmail => new EmailTransacionalConteudo(
                "Confirme seu e-mail e comece seu teste no Emprely.",
                "Seu teste do Emprely está quase pronto",
                "Falta só confirmar seu e-mail para acessar sua conta.",
                "O Emprely ajuda prestadores de serviço a transformar mensagens soltas em propostas profissionais, organizadas e prontas para enviar ao cliente.",
                "Confirmar e-mail",
                urlAcao,
                "Depois da confirmação, você já pode cadastrar clientes, montar serviços e criar sua primeira proposta.",
                "Se você não solicitou este cadastro, ignore este e-mail."),

            TipoEmailTransacional.RecuperacaoSenha => new EmailTransacionalConteudo(
                "Use este link para criar uma nova senha no Emprely.",
                "Redefina sua senha com segurança",
                "Recebemos uma solicitação para alterar a senha da sua conta.",
                "Clique no botão abaixo para criar uma nova senha e voltar a acessar suas propostas. O link vale por 1 hora.",
                "Redefinir senha",
                urlAcao,
                "Se você não pediu essa alteração, pode ignorar este e-mail.",
                "Por segurança, nunca compartilhe este e-mail ou o link de redefinição."),

            TipoEmailTransacional.BoasVindas => new EmailTransacionalConteudo(
                "Seu e-mail foi confirmado. Sua conta Emprely está pronta.",
                "Boas-vindas ao Emprely",
                "Sua conta foi confirmada com sucesso.",
                "Agora você pode organizar clientes, montar seus serviços e criar propostas profissionais com uma apresentação mais clara para vender melhor.",
                "Entrar no Emprely",
                loginUrl,
                "Comece cadastrando um cliente e salvando seus serviços mais vendidos. Isso ajuda você a montar os próximos orçamentos com mais rapidez."),

            TipoEmailTransacional.TrialIniciado => new EmailTransacionalConteudo(
                "Seu teste gratuito de 7 dias no Emprely começou.",
                "Seu teste de 7 dias começou",
                "Aproveite este período para sentir o fluxo completo.",
                "Crie alguns clientes, cadastre seus serviços e gere uma proposta real. Assim você consegue ver como o Emprely reduz retrabalho e deixa sua comunicação mais profissional.",
                "Criar primeira proposta",
                loginUrl,
                "Quanto mais completo estiver seu catálogo, mais rápido será montar os próximos orçamentos."),

            TipoEmailTransacional.TrialProximoFim => new EmailTransacionalConteudo(
                "Seu teste do Emprely está perto de terminar.",
                "Seu teste está chegando ao fim",
                "Ainda dá tempo de revisar seus clientes, serviços e propostas.",
                "Entre no Emprely, veja o que já foi criado e deixe seu fluxo pronto para continuar atendendo com propostas mais profissionais.",
                "Abrir Emprely",
                loginUrl,
                "Se precisar de ajuda para escolher o próximo passo, fale com a gente em contato@emprely.com.br."),

            TipoEmailTransacional.TrialExpirado => new EmailTransacionalConteudo(
                "Seu teste do Emprely terminou.",
                "Seu teste gratuito terminou",
                "Você ainda pode voltar e continuar de onde parou.",
                "Se o Emprely ajudou a organizar seus orçamentos, entre na sua conta para escolher o plano e manter seus clientes, serviços e propostas em um só lugar.",
                "Ver minha conta",
                loginUrl,
                "Se tiver dúvidas sobre plano ou pagamento, responda este e-mail ou escreva para contato@emprely.com.br."),

            TipoEmailTransacional.AlteracaoEmail => new EmailTransacionalConteudo(
                "Confirme o novo e-mail de acesso da sua conta Emprely.",
                "Confirme seu novo e-mail",
                "Recebemos uma solicitação para alterar o e-mail de acesso da sua conta.",
                "Clique no botão abaixo para confirmar este novo endereço e manter sua conta protegida.",
                "Confirmar novo e-mail",
                urlAcao,
                "Se você não solicitou essa alteração, ignore este e-mail e mantenha seu acesso atual.",
                "Por segurança, o e-mail só será alterado depois da confirmação."),

            TipoEmailTransacional.AvisoEmailAlterado => new EmailTransacionalConteudo(
                "O e-mail de acesso da sua conta Emprely foi alterado.",
                "E-mail de acesso alterado",
                "Confirmamos uma alteração importante na sua conta.",
                texto,
                "Abrir Emprely",
                loginUrl,
                "Se você não reconhece essa alteração, fale com a gente em contato@emprely.com.br.",
                "Este aviso foi enviado para proteger sua conta."),

            TipoEmailTransacional.SuporteRecebido => new EmailTransacionalConteudo(
                "Nova mensagem recebida pelo Emprely.",
                assunto,
                "Confira os dados da solicitação abaixo.",
                texto,
                null,
                null,
                null,
                null,
                MostrarBeneficios: false),

            _ => new EmailTransacionalConteudo(
                assunto,
                assunto,
                "Mensagem importante sobre sua conta Emprely.",
                texto,
                null,
                null,
                null,
                "Se você não solicitou esta ação, ignore este e-mail."),
        };
    }

    private static string BuildEmailHtml(EmailTransacionalConteudo conteudo, string logoUrl)
    {
        var preHeaderHtml = EncodeHtml(conteudo.PreHeader);
        var tituloHtml = EncodeHtml(conteudo.Titulo);
        var subtituloHtml = EncodeHtml(conteudo.Subtitulo);
        var corpoHtml = EncodeHtmlMultiline(conteudo.Corpo);
        var botaoHtml = BuildBotaoEmailHtml(conteudo.BotaoTexto, conteudo.BotaoUrl);
        var rodapeAcaoHtml = string.IsNullOrWhiteSpace(conteudo.RodapeAcao)
            ? string.Empty
            : $"""
              <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#475569;">{EncodeHtml(conteudo.RodapeAcao)}</p>
              """;
        var notaSegurancaHtml = string.IsNullOrWhiteSpace(conteudo.NotaSeguranca)
            ? string.Empty
            : $"""
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-collapse:collapse;">
                <tr>
                  <td style="border-radius:12px;background:#f8fafc;border:1px solid #dbeafe;padding:14px 16px;font-size:13px;line-height:1.5;color:#475569;">
                    {EncodeHtml(conteudo.NotaSeguranca)}
                  </td>
                </tr>
              </table>
              """;
        var beneficiosHtml = conteudo.MostrarBeneficios
            ? """
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-collapse:collapse;">
                <tr>
                  <td style="padding:16px;border-radius:14px;background:#eefcff;border:1px solid #c7f9ff;">
                    <p style="margin:0 0 8px;font-size:14px;line-height:1.5;font-weight:700;color:#0f172a;">Por que usar o Emprely?</p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">Organize clientes, padronize serviços e envie propostas com uma apresentação mais profissional para cada negociação.</p>
                  </td>
                </tr>
              </table>
              """
            : string.Empty;

        return $"""
            <!doctype html>
            <html lang="pt-BR">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>{tituloHtml}</title>
            </head>
            <body style="margin:0;padding:0;background:#f3f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
              <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">{preHeaderHtml}</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f3f7fb;">
                <tr>
                  <td align="center" style="padding:24px 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;border-collapse:separate;background:#ffffff;border:1px solid #d8e3f0;border-radius:18px;overflow:hidden;">
                      <tr>
                        <td style="background:#071f3f;padding:28px 30px;color:#ffffff;">
                          <img src="{EncodeHtml(logoUrl)}" width="154" alt="Emprely" style="display:block;width:154px;max-width:154px;height:auto;border:0;margin:0 0 24px;">
                          <p style="margin:0 0 10px;font-size:13px;line-height:1.5;color:#8eeaf4;font-weight:700;letter-spacing:.02em;text-transform:uppercase;">Emprely Orçamentos</p>
                          <h1 style="margin:0 0 8px;font-size:28px;line-height:1.15;font-weight:800;color:#ffffff;">{tituloHtml}</h1>
                          <p style="margin:0;font-size:16px;line-height:1.6;color:#dbeafe;">{subtituloHtml}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:30px;">
                          <p style="margin:0;font-size:16px;line-height:1.7;color:#1e293b;">{corpoHtml}</p>
                          {botaoHtml}
                          {rodapeAcaoHtml}
                          {beneficiosHtml}
                          {notaSegurancaHtml}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 30px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                          <p style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">Emprely Orçamentos<br>contato@emprely.com.br | https://emprely.com.br</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """;
    }

    private static string BuildBotaoEmailHtml(string? texto, string? url)
    {
        if (string.IsNullOrWhiteSpace(texto) || string.IsNullOrWhiteSpace(url))
        {
            return string.Empty;
        }

        var textoHtml = EncodeHtml(texto);
        var urlHtml = EncodeHtml(url);

        return $"""
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 0;border-collapse:collapse;">
            <tr>
              <td align="center" bgcolor="#4338ca" style="border-radius:12px;background:#4338ca;">
                <a href="{urlHtml}" target="_blank" style="display:inline-block;padding:14px 22px;font-size:16px;line-height:1.2;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">{textoHtml}</a>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
            Se o botão não funcionar, copie e cole este endereço no navegador:<br>
            <a href="{urlHtml}" target="_blank" style="color:#2563eb;text-decoration:underline;word-break:break-all;">{urlHtml}</a>
          </p>
          """;
    }

    private static string BuildEmailTexto(string assunto, EmailTransacionalConteudo conteudo)
    {
        var builder = new StringBuilder();
        builder.AppendLine(assunto);
        builder.AppendLine();
        builder.AppendLine(conteudo.Titulo);
        builder.AppendLine(conteudo.Subtitulo);
        builder.AppendLine();
        builder.AppendLine(conteudo.Corpo);

        if (!string.IsNullOrWhiteSpace(conteudo.BotaoTexto) && !string.IsNullOrWhiteSpace(conteudo.BotaoUrl))
        {
            builder.AppendLine();
            builder.AppendLine($"{conteudo.BotaoTexto}: {conteudo.BotaoUrl}");
        }

        if (!string.IsNullOrWhiteSpace(conteudo.RodapeAcao))
        {
            builder.AppendLine();
            builder.AppendLine(conteudo.RodapeAcao);
        }

        if (conteudo.MostrarBeneficios)
        {
            builder.AppendLine();
            builder.AppendLine("Por que usar o Emprely?");
            builder.AppendLine("Organize clientes, padronize serviços e envie propostas com uma apresentação mais profissional para cada negociação.");
        }

        if (!string.IsNullOrWhiteSpace(conteudo.NotaSeguranca))
        {
            builder.AppendLine();
            builder.AppendLine(conteudo.NotaSeguranca);
        }

        builder.AppendLine();
        builder.AppendLine("Emprely Orçamentos");
        builder.AppendLine("contato@emprely.com.br | https://emprely.com.br");

        return builder.ToString();
    }

    private static string? ExtrairPrimeiraUrl(string texto)
    {
        var inicioUrl = texto.IndexOf("https://", StringComparison.OrdinalIgnoreCase);
        if (inicioUrl < 0)
        {
            inicioUrl = texto.IndexOf("http://", StringComparison.OrdinalIgnoreCase);
        }

        if (inicioUrl < 0)
        {
            return null;
        }

        var fimUrl = texto.IndexOfAny([' ', '\r', '\n', '\t'], inicioUrl);
        var url = fimUrl < 0 ? texto[inicioUrl..] : texto[inicioUrl..fimUrl];
        return url.Trim().TrimEnd('.', ',', ';');
    }

    private static string NormalizarPublicWebUrl(string publicWebUrl)
    {
        return string.IsNullOrWhiteSpace(publicWebUrl)
            ? "https://app.emprely.com.br"
            : publicWebUrl.Trim().TrimEnd('/');
    }

    private static string BuildPublicWebUrl(string publicWebUrl, string path)
    {
        return $"{publicWebUrl}/{path.TrimStart('/')}";
    }

    private static string EncodeHtml(string value)
    {
        return HtmlEncoder.Default.Encode(value);
    }

    private static string EncodeHtmlMultiline(string value)
    {
        return EncodeHtml(value)
            .Replace("\r\n", "<br>")
            .Replace("\n", "<br>");
    }

    private sealed record EmailTransacionalConteudo(
        string PreHeader,
        string Titulo,
        string Subtitulo,
        string Corpo,
        string? BotaoTexto = null,
        string? BotaoUrl = null,
        string? RodapeAcao = null,
        string? NotaSeguranca = null,
        bool MostrarBeneficios = true);
}
