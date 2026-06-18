using Amazon;
using Amazon.SimpleEmailV2;
using Amazon.SimpleEmailV2.Model;
using Emprely.Application.Comunicacoes;
using Emprely.Domain.Comunicacoes;
using Emprely.Infrastructure.Persistence;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text;

namespace Emprely.Infrastructure.Comunicacoes;

public sealed class EmailTransacionalService : IEmailTransacionalService
{
    private readonly EmprelyDbContext dbContext;
    private readonly EmailTransacionalOptions options;
    private readonly ILogger<EmailTransacionalService> logger;

    public EmailTransacionalService(
        EmprelyDbContext dbContext,
        IOptions<EmailTransacionalOptions> options,
        ILogger<EmailTransacionalService> logger)
    {
        this.dbContext = dbContext;
        this.options = options.Value;
        this.logger = logger;
    }

    public async Task EnviarAsync(EmailTransacionalMensagem mensagem, CancellationToken cancellationToken)
    {
        var registro = EmailTransacional.Create(
            mensagem.ContaId,
            mensagem.UsuarioId,
            mensagem.Tipo,
            mensagem.Destinatario,
            mensagem.Assunto,
            mensagem.TokenHash);

        dbContext.EmailsTransacionais.Add(registro);
        await dbContext.SaveChangesAsync(cancellationToken);

        try
        {
            var provider = options.Provider.Trim();
            var providerMessageId = provider.Equals("Ses", StringComparison.OrdinalIgnoreCase)
                ? await EnviarViaSesAsync(mensagem, cancellationToken)
                : EnviarViaFake(mensagem);

            registro.RegistrarEnvio(providerMessageId);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            registro.RegistrarFalha(exception.Message);
            await dbContext.SaveChangesAsync(cancellationToken);

            logger.LogWarning(
                exception,
                "Falha ao enviar email transacional {Tipo} para usuario {UsuarioId}.",
                mensagem.Tipo,
                mensagem.UsuarioId);
        }
    }

    private string EnviarViaFake(EmailTransacionalMensagem mensagem)
    {
        logger.LogInformation(
            "Email transacional fake registrado. Tipo={Tipo}; Destinatario={Destinatario}; Assunto={Assunto}; Anexos={Anexos}",
            mensagem.Tipo,
            MascararEmail(mensagem.Destinatario),
            mensagem.Assunto,
            mensagem.Anexos?.Count ?? 0);

        return $"fake-{Guid.NewGuid():N}";
    }

    private async Task<string?> EnviarViaSesAsync(
        EmailTransacionalMensagem mensagem,
        CancellationToken cancellationToken)
    {
        using var client = new AmazonSimpleEmailServiceV2Client(RegionEndpoint.GetBySystemName(options.SesRegion));
        var anexos = mensagem.Anexos ?? [];
        if (anexos.Count > 0)
        {
            var responseRaw = await client.SendEmailAsync(new SendEmailRequest
            {
                Content = new EmailContent
                {
                    Raw = new RawMessage
                    {
                        Data = new MemoryStream(Encoding.UTF8.GetBytes(BuildMimeRaw(mensagem, anexos))),
                    },
                },
            }, cancellationToken);

            return responseRaw.MessageId;
        }

        var response = await client.SendEmailAsync(new SendEmailRequest
        {
            FromEmailAddress = $"{options.FromName} <{options.FromEmail}>",
            Destination = new Destination
            {
                ToAddresses = [mensagem.Destinatario],
            },
            Content = new EmailContent
            {
                Simple = new Message
                {
                    Subject = new Content
                    {
                        Data = mensagem.Assunto,
                        Charset = "UTF-8",
                    },
                    Body = new Body
                    {
                        Html = new Content
                        {
                            Data = mensagem.Html,
                            Charset = "UTF-8",
                        },
                        Text = new Content
                        {
                            Data = mensagem.Texto,
                            Charset = "UTF-8",
                        },
                    },
                },
            },
        }, cancellationToken);

        return response.MessageId;
    }

    private string BuildMimeRaw(EmailTransacionalMensagem mensagem, IReadOnlyList<EmailTransacionalAnexo> anexos)
    {
        var boundaryMixed = $"emprely-mixed-{Guid.NewGuid():N}";
        var boundaryAlt = $"emprely-alt-{Guid.NewGuid():N}";
        var builder = new StringBuilder();

        builder.AppendLine($"From: {options.FromName} <{options.FromEmail}>");
        builder.AppendLine($"To: {mensagem.Destinatario}");
        builder.AppendLine($"Subject: {EncodeHeader(mensagem.Assunto)}");
        builder.AppendLine("MIME-Version: 1.0");
        builder.AppendLine($"Content-Type: multipart/mixed; boundary=\"{boundaryMixed}\"");
        builder.AppendLine();
        builder.AppendLine($"--{boundaryMixed}");
        builder.AppendLine($"Content-Type: multipart/alternative; boundary=\"{boundaryAlt}\"");
        builder.AppendLine();
        builder.AppendLine($"--{boundaryAlt}");
        builder.AppendLine("Content-Type: text/plain; charset=UTF-8");
        builder.AppendLine("Content-Transfer-Encoding: base64");
        builder.AppendLine();
        builder.AppendLine(ToBase64Lines(mensagem.Texto));
        builder.AppendLine($"--{boundaryAlt}");
        builder.AppendLine("Content-Type: text/html; charset=UTF-8");
        builder.AppendLine("Content-Transfer-Encoding: base64");
        builder.AppendLine();
        builder.AppendLine(ToBase64Lines(mensagem.Html));
        builder.AppendLine($"--{boundaryAlt}--");

        foreach (var anexo in anexos)
        {
            builder.AppendLine($"--{boundaryMixed}");
            builder.AppendLine($"Content-Type: {anexo.ContentType}; name=\"{SanitizeHeaderValue(anexo.NomeArquivo)}\"");
            builder.AppendLine("Content-Transfer-Encoding: base64");
            builder.AppendLine($"Content-Disposition: attachment; filename=\"{SanitizeHeaderValue(anexo.NomeArquivo)}\"");
            builder.AppendLine();
            builder.AppendLine(ToBase64LinesFromBase64(anexo.ConteudoBase64));
        }

        builder.AppendLine($"--{boundaryMixed}--");
        return builder.ToString();
    }

    private static string EncodeHeader(string valor)
    {
        return $"=?UTF-8?B?{Convert.ToBase64String(Encoding.UTF8.GetBytes(valor))}?=";
    }

    private static string SanitizeHeaderValue(string valor)
    {
        return valor.Replace("\"", string.Empty).Replace("\r", string.Empty).Replace("\n", string.Empty);
    }

    private static string ToBase64Lines(string valor)
    {
        return ToBase64LinesFromBase64(Convert.ToBase64String(Encoding.UTF8.GetBytes(valor)));
    }

    private static string ToBase64LinesFromBase64(string base64)
    {
        var limpo = base64.Replace("\r", string.Empty).Replace("\n", string.Empty);
        return string.Join(
            Environment.NewLine,
            Enumerable.Range(0, (int)Math.Ceiling(limpo.Length / 76m))
                .Select(indice => limpo.Substring(indice * 76, Math.Min(76, limpo.Length - indice * 76))));
    }

    private static string MascararEmail(string email)
    {
        var partes = email.Split('@', 2);
        if (partes.Length != 2 || partes[0].Length == 0)
        {
            return "email-mascarado";
        }

        return $"{partes[0][0]}***@{partes[1]}";
    }
}
