using System.Security.Claims;
using Emprely.Api.Auth;
using Emprely.Domain.Admin;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace Emprely.Api.Controllers;

public abstract class AdminControllerBase : ControllerBase
{
    protected AdminAtualContext GetAdminAtual()
    {
        var idValor = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
        var perfil = User.FindFirstValue(JwtClaimsEmprely.PerfilAdmin) ?? string.Empty;
        var isOwner = string.Equals(
            User.FindFirstValue(JwtClaimsEmprely.IsAdminOwner),
            "true",
            StringComparison.OrdinalIgnoreCase);

        if (!Guid.TryParse(idValor, out var id) ||
            !string.Equals(
                User.FindFirstValue(JwtClaimsEmprely.TokenTipo),
                JwtClaimsEmprely.AdminTokenTipo,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new UnauthorizedAccessException("Sessao administrativa invalida.");
        }

        return new AdminAtualContext(id, email, perfil, isOwner);
    }

    protected ActionResult? ExigirSuperAdmin(AdminAtualContext admin)
    {
        return string.Equals(admin.Perfil, PerfilAdminUsuario.SuperAdmin.ToString(), StringComparison.OrdinalIgnoreCase)
            ? null
            : StatusCode(StatusCodes.Status403Forbidden, new { message = "Apenas Super Admin pode executar esta acao." });
    }

    protected ActionResult? ExigirOwner(AdminAtualContext admin)
    {
        return admin.IsOwner
            ? null
            : StatusCode(StatusCodes.Status403Forbidden, new { message = "Apenas o dono principal pode executar esta acao." });
    }

    protected async Task RegistrarAuditoriaAsync(
        EmprelyDbContext dbContext,
        AdminAtualContext admin,
        string acao,
        string alvoTipo,
        Guid? alvoId,
        string? motivo,
        string? detalhes,
        CancellationToken cancellationToken,
        string resultado = "Sucesso")
    {
        dbContext.AdminAuditorias.Add(AdminAuditoria.Create(
            admin.Id,
            admin.Email,
            admin.Perfil,
            acao,
            alvoTipo,
            alvoId,
            motivo,
            detalhes,
            HttpContext.Connection.RemoteIpAddress?.ToString(),
            Request.Headers.UserAgent.ToString(),
            resultado));

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

public sealed record AdminAtualContext(
    Guid Id,
    string Email,
    string Perfil,
    bool IsOwner);
