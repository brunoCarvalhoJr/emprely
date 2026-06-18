using Emprely.Domain.Common;

namespace Emprely.Domain.Comunicacoes;

public sealed class EmailTransacional : EntidadeBase
{
    private EmailTransacional()
    {
        Destinatario = string.Empty;
        Assunto = string.Empty;
        Status = StatusEmailTransacional.Pendente;
        Tipo = TipoEmailTransacional.ConfirmacaoEmail;
    }

    private EmailTransacional(
        Guid? contaId,
        Guid? usuarioId,
        TipoEmailTransacional tipo,
        string destinatario,
        string assunto,
        string? tokenHash = null)
    {
        ContaId = contaId;
        UsuarioId = usuarioId;
        Tipo = tipo;
        Destinatario = destinatario.Trim().ToLowerInvariant();
        Assunto = assunto.Trim();
        TokenHash = tokenHash;
        Status = StatusEmailTransacional.Pendente;
    }

    public Guid? ContaId { get; private set; }

    public Guid? UsuarioId { get; private set; }

    public TipoEmailTransacional Tipo { get; private set; }

    public string Destinatario { get; private set; }

    public string Assunto { get; private set; }

    public StatusEmailTransacional Status { get; private set; }

    public string? ProviderMessageId { get; private set; }

    public string? TokenHash { get; private set; }

    public string? Erro { get; private set; }

    public static EmailTransacional Create(
        Guid? contaId,
        Guid? usuarioId,
        TipoEmailTransacional tipo,
        string destinatario,
        string assunto,
        string? tokenHash = null)
    {
        return new EmailTransacional(contaId, usuarioId, tipo, destinatario, assunto, tokenHash);
    }

    public void RegistrarEnvio(string? providerMessageId)
    {
        Status = StatusEmailTransacional.Enviado;
        ProviderMessageId = providerMessageId;
        Erro = null;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void RegistrarFalha(string erro)
    {
        Status = StatusEmailTransacional.Falhou;
        Erro = erro.Length > 1000 ? erro[..1000] : erro;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}
