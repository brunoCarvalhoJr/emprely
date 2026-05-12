namespace Emprely.Application.Auth;

public interface ICurrentContaContext
{
    bool IsAuthenticated { get; }

    Guid UsuarioId { get; }

    Guid ContaId { get; }

    string? Papel { get; }
}
