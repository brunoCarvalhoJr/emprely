using Emprely.Application.Auth;
using Emprely.Contracts.Auth;
using Emprely.Infrastructure.Identity;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/me")]
public sealed class MeController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;
    private readonly UserManager<UsuarioAplicacao> userManager;

    public MeController(
        ICurrentContaContext currentContaContext,
        EmprelyDbContext dbContext,
        UserManager<UsuarioAplicacao> userManager)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
        this.userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<MeUsuarioResponse>> GetUsuarioAtual(
        CancellationToken cancellationToken)
    {
        var usuario = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == currentContaContext.UsuarioId, cancellationToken);

        var membroConta = await dbContext.MembrosConta
            .Include(membro => membro.Conta)
            .FirstOrDefaultAsync(
                membro =>
                    membro.UsuarioId == currentContaContext.UsuarioId &&
                    membro.ContaId == currentContaContext.ContaId,
                cancellationToken);

        if (usuario is null || membroConta?.Conta is null)
        {
            return Unauthorized();
        }

        return Ok(new MeUsuarioResponse(
            new UsuarioAtualResponse(
                usuario.Id,
                usuario.Nome,
                usuario.Email ?? string.Empty),
            ContaAtualResponseBuilder.BuildContaAtualResponse(
                membroConta.Conta,
                membroConta.Papel.ToString())));
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangeSenhaUsuario(
        ChangeSenhaUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        if (request.NovaSenha != request.ConfirmarNovaSenha)
        {
            ModelState.AddModelError(
                nameof(request.ConfirmarNovaSenha),
                "Confirmacao da nova senha nao confere.");
            return ValidationProblem(ModelState);
        }

        var usuario = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == currentContaContext.UsuarioId, cancellationToken);

        if (usuario is null)
        {
            return Unauthorized();
        }

        var result = await userManager.ChangePasswordAsync(
            usuario,
            request.SenhaAtual,
            request.NovaSenha);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        return NoContent();
    }
}
