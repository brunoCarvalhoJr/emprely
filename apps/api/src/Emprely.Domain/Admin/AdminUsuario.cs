using Emprely.Domain.Common;

namespace Emprely.Domain.Admin;

public sealed class AdminUsuario : EntidadeBase
{
    private AdminUsuario()
    {
        Nome = string.Empty;
        Email = string.Empty;
        SenhaHash = string.Empty;
        Perfil = PerfilAdminUsuario.Suporte;
        Status = StatusAdminUsuario.Ativo;
    }

    private AdminUsuario(string nome, string email, PerfilAdminUsuario perfil)
    {
        Nome = nome.Trim();
        Email = email.Trim().ToLowerInvariant();
        Perfil = perfil;
        Status = StatusAdminUsuario.Ativo;
        SenhaHash = string.Empty;
    }

    public string Nome { get; private set; }

    public string Email { get; private set; }

    public string SenhaHash { get; private set; }

    public PerfilAdminUsuario Perfil { get; private set; }

    public StatusAdminUsuario Status { get; private set; }

    public DateTimeOffset? UltimoLoginAt { get; private set; }

    public static AdminUsuario Create(string nome, string email, PerfilAdminUsuario perfil)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new ArgumentException("Nome do admin e obrigatorio.", nameof(nome));
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email do admin e obrigatorio.", nameof(email));
        }

        return new AdminUsuario(nome, email, perfil);
    }

    public void DefinirSenhaHash(string senhaHash)
    {
        if (string.IsNullOrWhiteSpace(senhaHash))
        {
            throw new ArgumentException("Hash de senha do admin e obrigatorio.", nameof(senhaHash));
        }

        SenhaHash = senhaHash;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void RegistrarLogin()
    {
        UltimoLoginAt = DateTimeOffset.UtcNow;
        UpdatedAt = UltimoLoginAt;
    }

    public void AlterarPerfil(PerfilAdminUsuario perfil)
    {
        Perfil = perfil;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Bloquear()
    {
        Status = StatusAdminUsuario.Bloqueado;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Desbloquear()
    {
        Status = StatusAdminUsuario.Ativo;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}
