using Emprely.Domain.Common;

namespace Emprely.Domain.Comunicacoes;

public sealed class EmailAlteracaoPendente : EntidadeBase
{
    private EmailAlteracaoPendente()
    {
        EmailAtual = string.Empty;
        NovoEmail = string.Empty;
    }

    private EmailAlteracaoPendente(Guid usuarioId, string emailAtual, string novoEmail)
    {
        UsuarioId = usuarioId;
        EmailAtual = emailAtual.Trim().ToLowerInvariant();
        NovoEmail = novoEmail.Trim().ToLowerInvariant();
        Confirmado = false;
    }

    public Guid UsuarioId { get; private set; }

    public string EmailAtual { get; private set; }

    public string NovoEmail { get; private set; }

    public bool Confirmado { get; private set; }

    public DateTimeOffset? ConfirmadoAt { get; private set; }

    public static EmailAlteracaoPendente Create(Guid usuarioId, string emailAtual, string novoEmail)
    {
        return new EmailAlteracaoPendente(usuarioId, emailAtual, novoEmail);
    }

    public void Confirmar()
    {
        Confirmado = true;
        ConfirmadoAt = DateTimeOffset.UtcNow;
        UpdatedAt = ConfirmadoAt.Value;
    }
}
