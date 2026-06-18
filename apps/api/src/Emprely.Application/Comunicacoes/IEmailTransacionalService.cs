using Emprely.Domain.Comunicacoes;

namespace Emprely.Application.Comunicacoes;

public sealed record EmailTransacionalMensagem(
    Guid? ContaId,
    Guid? UsuarioId,
    TipoEmailTransacional Tipo,
    string Destinatario,
    string Assunto,
    string Html,
    string Texto,
    string? TokenHash = null,
    IReadOnlyList<EmailTransacionalAnexo>? Anexos = null);

public sealed record EmailTransacionalAnexo(
    string NomeArquivo,
    string ContentType,
    string ConteudoBase64);

public interface IEmailTransacionalService
{
    Task EnviarAsync(EmailTransacionalMensagem mensagem, CancellationToken cancellationToken);
}
