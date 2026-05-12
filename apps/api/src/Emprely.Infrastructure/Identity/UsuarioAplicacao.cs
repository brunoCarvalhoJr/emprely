using Microsoft.AspNetCore.Identity;

namespace Emprely.Infrastructure.Identity;

public sealed class UsuarioAplicacao : IdentityUser<Guid>
{
    public string Nome { get; set; } = string.Empty;
}
