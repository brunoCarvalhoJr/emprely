using Emprely.Domain.Common;

namespace Emprely.Domain.Suporte;

public sealed class SuporteSolicitacao : EntidadeBase
{
    private SuporteSolicitacao()
    {
        Assunto = string.Empty;
        Mensagem = string.Empty;
        UsuarioEmail = string.Empty;
        UsuarioNome = string.Empty;
        Status = StatusSuporteSolicitacao.Aberta;
    }

    private SuporteSolicitacao(
        Guid contaId,
        Guid usuarioId,
        string usuarioNome,
        string usuarioEmail,
        string assunto,
        string mensagem)
    {
        ContaId = contaId;
        UsuarioId = usuarioId;
        UsuarioNome = usuarioNome.Trim();
        UsuarioEmail = usuarioEmail.Trim().ToLowerInvariant();
        Assunto = assunto.Trim();
        Mensagem = mensagem.Trim();
        Status = StatusSuporteSolicitacao.Aberta;
    }

    public Guid ContaId { get; private set; }

    public Guid UsuarioId { get; private set; }

    public string UsuarioNome { get; private set; }

    public string UsuarioEmail { get; private set; }

    public string Assunto { get; private set; }

    public string Mensagem { get; private set; }

    public StatusSuporteSolicitacao Status { get; private set; }

    public static SuporteSolicitacao Create(
        Guid contaId,
        Guid usuarioId,
        string usuarioNome,
        string usuarioEmail,
        string assunto,
        string mensagem)
    {
        return new SuporteSolicitacao(contaId, usuarioId, usuarioNome, usuarioEmail, assunto, mensagem);
    }
}
