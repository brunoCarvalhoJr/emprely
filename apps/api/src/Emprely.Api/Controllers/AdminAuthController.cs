using Emprely.Api.Auth;
using Emprely.Api.Configuracoes;
using Emprely.Contracts.Admin;
using Emprely.Domain.Admin;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Emprely.Api.Controllers;

[ApiController]
[EnableRateLimiting(RateLimitAplicacaoOptions.AdminPolicyName)]
[Route("api/admin/auth")]
public sealed class AdminAuthController : AdminControllerBase
{
    private readonly EmprelyDbContext dbContext;
    private readonly IPasswordHasher<AdminUsuario> passwordHasher;
    private readonly IJwtTokenService jwtTokenService;
    private readonly AdminPainelOptions adminPainelOptions;

    public AdminAuthController(
        EmprelyDbContext dbContext,
        IPasswordHasher<AdminUsuario> passwordHasher,
        IJwtTokenService jwtTokenService,
        IOptions<AdminPainelOptions> adminPainelOptions)
    {
        this.dbContext = dbContext;
        this.passwordHasher = passwordHasher;
        this.jwtTokenService = jwtTokenService;
        this.adminPainelOptions = adminPainelOptions.Value;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AdminLoginResponse>> Login(
        AdminLoginRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var admin = await dbContext.AdminUsuarios
            .FirstOrDefaultAsync(adminAtual => adminAtual.Email == email, cancellationToken);

        if (admin is null || admin.Status != StatusAdminUsuario.Ativo)
        {
            return Unauthorized(new { message = "Email ou senha administrativa invalidos." });
        }

        var result = passwordHasher.VerifyHashedPassword(admin, admin.SenhaHash, request.Senha);
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "Email ou senha administrativa invalidos." });
        }

        admin.RegistrarLogin();
        await dbContext.SaveChangesAsync(cancellationToken);

        var adminContext = new AdminAtualContext(admin.Id, admin.Email, admin.Perfil.ToString(), IsOwner(admin.Email));
        await RegistrarAuditoriaAsync(
            dbContext,
            adminContext,
            "AdminLogin",
            "AdminUsuario",
            admin.Id,
            null,
            null,
            cancellationToken);

        return Ok(BuildLoginResponse(admin));
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<AdminAtualResponse> Me()
    {
        var admin = GetAdminAtual();
        return Ok(new AdminAtualResponse(admin.Id, User.Identity?.Name ?? string.Empty, admin.Email, admin.Perfil, admin.IsOwner));
    }

    [Authorize]
    [HttpPost("password")]
    public async Task<IActionResult> AlterarSenhaPropria(
        AdminAlterarSenhaPropriaRequest request,
        CancellationToken cancellationToken)
    {
        var adminAtual = GetAdminAtual();
        var admin = await dbContext.AdminUsuarios
            .FirstOrDefaultAsync(adminUsuario => adminUsuario.Id == adminAtual.Id, cancellationToken);

        if (admin is null)
        {
            return Unauthorized(new { message = "Sessao administrativa invalida." });
        }

        if (admin.Status != StatusAdminUsuario.Ativo)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Administrador bloqueado." });
        }

        var erroValidacao = ValidarAlteracaoSenha(request);
        if (erroValidacao is not null)
        {
            return BadRequest(new { message = erroValidacao });
        }

        var senhaAtualResult = passwordHasher.VerifyHashedPassword(admin, admin.SenhaHash, request.SenhaAtual);
        if (senhaAtualResult == PasswordVerificationResult.Failed)
        {
            return BadRequest(new { message = "Senha atual invalida." });
        }

        admin.DefinirSenhaHash(passwordHasher.HashPassword(admin, request.NovaSenha));
        await dbContext.SaveChangesAsync(cancellationToken);

        await RegistrarAuditoriaAsync(
            dbContext,
            adminAtual,
            "AdminAlterarSenhaPropria",
            "AdminUsuario",
            admin.Id,
            null,
            "Senha administrativa alterada pelo proprio admin.",
            cancellationToken);

        return NoContent();
    }

    private AdminLoginResponse BuildLoginResponse(AdminUsuario admin)
    {
        var isOwner = IsOwner(admin.Email);
        var token = jwtTokenService.GenerateTokenAdmin(
            admin.Id,
            admin.Nome,
            admin.Email,
            admin.Perfil.ToString(),
            isOwner);

        return new AdminLoginResponse(
            token.AccessToken,
            token.ExpiresAtUtc,
            new AdminAtualResponse(admin.Id, admin.Nome, admin.Email, admin.Perfil.ToString(), isOwner));
    }

    private bool IsOwner(string email)
    {
        return string.Equals(email, GetOwnerEmail(), StringComparison.OrdinalIgnoreCase);
    }

    private string GetOwnerEmail()
    {
        var ownerEmail = adminPainelOptions.OwnerEmail.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(ownerEmail))
        {
            throw new InvalidOperationException("AdminPainel:OwnerEmail deve ser configurado.");
        }

        return ownerEmail;
    }

    private static string? ValidarAlteracaoSenha(AdminAlterarSenhaPropriaRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SenhaAtual))
        {
            return "Informe a senha atual.";
        }

        if (string.IsNullOrWhiteSpace(request.NovaSenha))
        {
            return "Informe a nova senha.";
        }

        if (request.NovaSenha.Length < 8)
        {
            return "A nova senha precisa ter pelo menos 8 caracteres.";
        }

        if (!string.Equals(request.NovaSenha, request.ConfirmarNovaSenha, StringComparison.Ordinal))
        {
            return "A confirmacao precisa ser igual a nova senha.";
        }

        return null;
    }
}
