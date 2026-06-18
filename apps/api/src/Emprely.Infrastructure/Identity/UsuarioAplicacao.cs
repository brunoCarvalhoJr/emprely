using Microsoft.AspNetCore.Identity;

namespace Emprely.Infrastructure.Identity;

public sealed class UsuarioAplicacao : IdentityUser<Guid>
{
    public string Nome { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? BloqueadoAdministrativamenteAt { get; set; }
}
