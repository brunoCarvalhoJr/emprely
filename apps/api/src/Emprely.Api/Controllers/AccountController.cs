using Emprely.Application.Auth;
using Emprely.Contracts.Auth;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/account")]
public sealed class AccountController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly EmprelyDbContext dbContext;

    public AccountController(ICurrentContaContext currentContaContext, EmprelyDbContext dbContext)
    {
        this.currentContaContext = currentContaContext;
        this.dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<ContaAtualResponse>> GetContaAtual(
        CancellationToken cancellationToken)
    {
        var membroConta = await dbContext.MembrosConta
            .Include(membro => membro.Conta)
            .FirstOrDefaultAsync(
                membro =>
                    membro.UsuarioId == currentContaContext.UsuarioId &&
                    membro.ContaId == currentContaContext.ContaId,
                cancellationToken);

        if (membroConta?.Conta is null)
        {
            return NotFound();
        }

        return Ok(new ContaAtualResponse(
            membroConta.Conta.Id,
            membroConta.Conta.Nome,
            membroConta.Conta.Slug,
            membroConta.Papel.ToString()));
    }
}
