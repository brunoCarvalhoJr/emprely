namespace Emprely.Api.Auth;

public interface IJwtTokenService
{
    JwtTokenResult GenerateTokenUsuario(
        Guid usuarioId,
        string nome,
        string email,
        Guid contaId,
        string papel);

    JwtTokenResult GenerateTokenAdmin(
        Guid adminUsuarioId,
        string nome,
        string email,
        string perfil,
        bool isOwner);
}
