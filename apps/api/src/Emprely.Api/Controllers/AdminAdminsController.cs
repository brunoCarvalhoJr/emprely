using Emprely.Contracts.Admin;
using Emprely.Domain.Admin;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/admin/admins")]
public sealed class AdminAdminsController : AdminControllerBase
{
    private readonly EmprelyDbContext dbContext;
    private readonly IPasswordHasher<AdminUsuario> passwordHasher;

    public AdminAdminsController(
        EmprelyDbContext dbContext,
        IPasswordHasher<AdminUsuario> passwordHasher)
    {
        this.dbContext = dbContext;
        this.passwordHasher = passwordHasher;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AdminPainelAdminResponse>>> Listar(CancellationToken cancellationToken)
    {
        var adminAtual = GetAdminAtual();
        if (ExigirSuperAdmin(adminAtual) is { } forbidden)
        {
            return forbidden;
        }

        var admins = await dbContext.AdminUsuarios
            .AsNoTracking()
            .OrderBy(admin => admin.Nome)
            .Select(admin => new AdminPainelAdminResponse(
                admin.Id,
                admin.Nome,
                admin.Email,
                admin.Perfil.ToString(),
                admin.Status.ToString(),
                admin.UltimoLoginAt,
                admin.CreatedAt))
            .ToListAsync(cancellationToken);

        return Ok(admins);
    }

    [HttpPost]
    public async Task<ActionResult<AdminPainelAdminResponse>> Criar(
        AdminCriarAdminRequest request,
        CancellationToken cancellationToken)
    {
        var adminAtual = GetAdminAtual();
        if (ExigirSuperAdmin(adminAtual) is { } forbidden)
        {
            return forbidden;
        }

        if (string.IsNullOrWhiteSpace(request.Motivo))
        {
            return BadRequest(new { message = "Motivo e obrigatorio." });
        }

        if (!TryParsePerfil(request.Perfil, out var perfil))
        {
            return BadRequest(new { message = "Perfil administrativo invalido." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        if (await dbContext.AdminUsuarios.AnyAsync(admin => admin.Email == email, cancellationToken))
        {
            return Conflict(new { message = "Ja existe admin com este email." });
        }

        var admin = AdminUsuario.Create(request.Nome, email, perfil);
        admin.DefinirSenhaHash(passwordHasher.HashPassword(admin, request.Senha));
        dbContext.AdminUsuarios.Add(admin);
        await dbContext.SaveChangesAsync(cancellationToken);

        await RegistrarAuditoriaAsync(
            dbContext,
            adminAtual,
            "AdminCriarAdmin",
            "AdminUsuario",
            admin.Id,
            request.Motivo,
            $"Perfil={admin.Perfil}",
            cancellationToken);

        return CreatedAtAction(nameof(Listar), Map(admin));
    }

    [HttpPost("{adminId:guid}/perfil")]
    public async Task<ActionResult> AlterarPerfil(
        Guid adminId,
        AdminAlterarPerfilAdminRequest request,
        CancellationToken cancellationToken)
    {
        var adminAtual = GetAdminAtual();
        if (ExigirSuperAdmin(adminAtual) is { } forbidden)
        {
            return forbidden;
        }

        if (string.IsNullOrWhiteSpace(request.Motivo))
        {
            return BadRequest(new { message = "Motivo e obrigatorio." });
        }

        if (!TryParsePerfil(request.Perfil, out var perfil))
        {
            return BadRequest(new { message = "Perfil administrativo invalido." });
        }

        var admin = await dbContext.AdminUsuarios.FindAsync([adminId], cancellationToken);
        if (admin is null)
        {
            return NotFound(new { message = "Admin nao encontrado." });
        }

        if (adminAtual.Id == admin.Id)
        {
            return BadRequest(new { message = "Super Admin nao deve alterar o proprio perfil por esta tela." });
        }

        var perfilAnterior = admin.Perfil;
        admin.AlterarPerfil(perfil);
        await dbContext.SaveChangesAsync(cancellationToken);

        await RegistrarAuditoriaAsync(
            dbContext,
            adminAtual,
            "AdminAlterarPerfilAdmin",
            "AdminUsuario",
            admin.Id,
            request.Motivo,
            $"PerfilAnterior={perfilAnterior};PerfilNovo={admin.Perfil}",
            cancellationToken);

        return NoContent();
    }

    [HttpPost("{adminId:guid}/bloquear")]
    public async Task<ActionResult> Bloquear(
        Guid adminId,
        AdminMotivoRequest request,
        CancellationToken cancellationToken)
    {
        return await AlterarStatus(adminId, request, bloquear: true, cancellationToken);
    }

    [HttpPost("{adminId:guid}/desbloquear")]
    public async Task<ActionResult> Desbloquear(
        Guid adminId,
        AdminMotivoRequest request,
        CancellationToken cancellationToken)
    {
        return await AlterarStatus(adminId, request, bloquear: false, cancellationToken);
    }

    private async Task<ActionResult> AlterarStatus(
        Guid adminId,
        AdminMotivoRequest request,
        bool bloquear,
        CancellationToken cancellationToken)
    {
        var adminAtual = GetAdminAtual();
        if (ExigirSuperAdmin(adminAtual) is { } forbidden)
        {
            return forbidden;
        }

        if (string.IsNullOrWhiteSpace(request.Motivo))
        {
            return BadRequest(new { message = "Motivo e obrigatorio." });
        }

        var admin = await dbContext.AdminUsuarios.FindAsync([adminId], cancellationToken);
        if (admin is null)
        {
            return NotFound(new { message = "Admin nao encontrado." });
        }

        if (adminAtual.Id == admin.Id)
        {
            return BadRequest(new { message = "Super Admin nao deve bloquear o proprio usuario admin por esta tela." });
        }

        if (bloquear)
        {
            admin.Bloquear();
        }
        else
        {
            admin.Desbloquear();
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        await RegistrarAuditoriaAsync(
            dbContext,
            adminAtual,
            bloquear ? "AdminBloquearAdmin" : "AdminDesbloquearAdmin",
            "AdminUsuario",
            admin.Id,
            request.Motivo,
            $"Status={admin.Status}",
            cancellationToken);

        return NoContent();
    }

    private static bool TryParsePerfil(string valor, out PerfilAdminUsuario perfil)
    {
        return Enum.TryParse(valor, ignoreCase: true, out perfil) &&
            (perfil == PerfilAdminUsuario.SuperAdmin || perfil == PerfilAdminUsuario.Suporte);
    }

    private static AdminPainelAdminResponse Map(AdminUsuario admin)
    {
        return new AdminPainelAdminResponse(
            admin.Id,
            admin.Nome,
            admin.Email,
            admin.Perfil.ToString(),
            admin.Status.ToString(),
            admin.UltimoLoginAt,
            admin.CreatedAt);
    }
}
