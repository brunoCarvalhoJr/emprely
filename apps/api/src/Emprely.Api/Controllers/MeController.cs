using Emprely.Application.Auth;
using Emprely.Contracts.Auth;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
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

    public MeController(ICurrentContaContext currentContaContext, EmprelyDbContext dbContext)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
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
            new ContaAtualResponse(
                membroConta.Conta.Id,
                membroConta.Conta.Nome,
                membroConta.Conta.Slug,
                membroConta.Papel.ToString())));
    }
}
