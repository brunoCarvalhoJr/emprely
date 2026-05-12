using Emprely.Api.Auth;
using Emprely.Contracts.Auth;
using Emprely.Domain.Contas;
using Emprely.Infrastructure.Identity;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<UsuarioAplicacao> userManager;
    private readonly SignInManager<UsuarioAplicacao> signInManager;
    private readonly EmprelyDbContext dbContext;
    private readonly IJwtTokenService jwtTokenService;

    public AuthController(
        UserManager<UsuarioAplicacao> userManager,
        SignInManager<UsuarioAplicacao> signInManager,
        EmprelyDbContext dbContext,
        IJwtTokenService jwtTokenService)
    {
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.dbContext = dbContext;
        this.jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthUsuarioResponse>> RegisterUsuario(
        RegisterUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var usuarioExistente = await userManager.FindByEmailAsync(email);

        if (usuarioExistente is not null)
        {
            ModelState.AddModelError(nameof(request.Email), "Email ja cadastrado.");
            return ValidationProblem(ModelState);
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        var usuario = new UsuarioAplicacao
        {
            Id = Guid.CreateVersion7(),
            Nome = request.Nome.Trim(),
            UserName = email,
            Email = email,
            EmailConfirmed = true,
        };

        var createUsuarioResult = await userManager.CreateAsync(usuario, request.Senha);

        if (!createUsuarioResult.Succeeded)
        {
            foreach (var error in createUsuarioResult.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        var conta = Conta.CreateConta(request.NomeConta);
        var membroConta = MembroConta.CreateOwner(conta.Id, usuario.Id);

        dbContext.Contas.Add(conta);
        dbContext.MembrosConta.Add(membroConta);

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return Ok(BuildAuthUsuarioResponse(usuario, conta, membroConta.Papel.ToString()));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthUsuarioResponse>> LoginUsuario(
        LoginUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var usuario = await userManager.FindByEmailAsync(email);

        if (usuario is null)
        {
            return Unauthorized(new { message = "Email ou senha invalidos." });
        }

        var loginResult = await signInManager.CheckPasswordSignInAsync(
            usuario,
            request.Senha,
            lockoutOnFailure: false);

        if (!loginResult.Succeeded)
        {
            return Unauthorized(new { message = "Email ou senha invalidos." });
        }

        var membroConta = await dbContext.MembrosConta
            .Include(membro => membro.Conta)
            .Where(membro => membro.UsuarioId == usuario.Id)
            .OrderBy(membro => membro.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (membroConta?.Conta is null)
        {
            return Unauthorized(new { message = "Usuario sem conta ativa." });
        }

        return Ok(BuildAuthUsuarioResponse(
            usuario,
            membroConta.Conta,
            membroConta.Papel.ToString()));
    }

    private AuthUsuarioResponse BuildAuthUsuarioResponse(
        UsuarioAplicacao usuario,
        Conta conta,
        string papel)
    {
        var token = jwtTokenService.GenerateTokenUsuario(
            usuario.Id,
            usuario.Nome,
            usuario.Email ?? string.Empty,
            conta.Id,
            papel);

        return new AuthUsuarioResponse(
            token.AccessToken,
            token.ExpiresAtUtc,
            new UsuarioAtualResponse(usuario.Id, usuario.Nome, usuario.Email ?? string.Empty),
            new ContaAtualResponse(conta.Id, conta.Nome, conta.Slug, papel));
    }
}
