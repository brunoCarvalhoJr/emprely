using Emprely.Domain.Common;

namespace Emprely.Domain.Admin;

public sealed class AdminAuditoria : EntidadeBase
{
    private AdminAuditoria()
    {
        AdminEmail = string.Empty;
        AdminPerfil = string.Empty;
        Acao = string.Empty;
        AlvoTipo = string.Empty;
        Resultado = string.Empty;
    }

    private AdminAuditoria(
        Guid adminUsuarioId,
        string adminEmail,
        string adminPerfil,
        string acao,
        string alvoTipo,
        Guid? alvoId,
        string? motivo,
        string? detalhes,
        string? ip,
        string? userAgent,
        string resultado)
    {
        AdminUsuarioId = adminUsuarioId;
        AdminEmail = adminEmail.Trim().ToLowerInvariant();
        AdminPerfil = adminPerfil;
        Acao = acao;
        AlvoTipo = alvoTipo;
        AlvoId = alvoId;
        Motivo = string.IsNullOrWhiteSpace(motivo) ? null : motivo.Trim();
        Detalhes = string.IsNullOrWhiteSpace(detalhes) ? null : detalhes.Trim();
        Ip = string.IsNullOrWhiteSpace(ip) ? null : ip.Trim();
        UserAgent = string.IsNullOrWhiteSpace(userAgent) ? null : userAgent.Trim();
        Resultado = resultado;
    }

    public Guid AdminUsuarioId { get; private set; }

    public string AdminEmail { get; private set; }

    public string AdminPerfil { get; private set; }

    public string Acao { get; private set; }

    public string AlvoTipo { get; private set; }

    public Guid? AlvoId { get; private set; }

    public string? Motivo { get; private set; }

    public string? Detalhes { get; private set; }

    public string? Ip { get; private set; }

    public string? UserAgent { get; private set; }

    public string Resultado { get; private set; }

    public static AdminAuditoria Create(
        Guid adminUsuarioId,
        string adminEmail,
        string adminPerfil,
        string acao,
        string alvoTipo,
        Guid? alvoId,
        string? motivo,
        string? detalhes,
        string? ip,
        string? userAgent,
        string resultado = "Sucesso")
    {
        return new AdminAuditoria(
            adminUsuarioId,
            adminEmail,
            adminPerfil,
            acao,
            alvoTipo,
            alvoId,
            motivo,
            detalhes,
            ip,
            userAgent,
            resultado);
    }
}
