using System.Security.Claims;
using Emprely.Application.Auth;

namespace Emprely.Api.Auth;

public sealed class CurrentContaContext : ICurrentContaContext
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public CurrentContaContext(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public bool IsAuthenticated =>
        httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true;

    public Guid UsuarioId => GetGuidClaim(ClaimTypes.NameIdentifier);

    public Guid ContaId => GetGuidClaim(JwtClaimsEmprely.ContaId);

    public string? Papel =>
        httpContextAccessor.HttpContext?.User.FindFirstValue(JwtClaimsEmprely.Papel);

    private Guid GetGuidClaim(string claimType)
    {
        var valor = httpContextAccessor.HttpContext?.User.FindFirstValue(claimType);

        if (!Guid.TryParse(valor, out var id))
        {
            throw new UnauthorizedAccessException($"Claim obrigatoria ausente: {claimType}.");
        }

        return id;
    }
}
