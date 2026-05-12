using Emprely.Application.Auth;
using Emprely.Contracts.Account;
using Emprely.Contracts.Auth;
using Emprely.Domain.Contas;
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

    [HttpGet("profile")]
    public async Task<ActionResult<PerfilContaResponse>> GetPerfilContaAtual(
        CancellationToken cancellationToken)
    {
        var conta = await dbContext.Contas
            .Include(contaAtual => contaAtual.Perfil)
            .FirstOrDefaultAsync(
                contaAtual => contaAtual.Id == currentContaContext.ContaId,
                cancellationToken);

        if (conta is null)
        {
            return NotFound();
        }

        return Ok(BuildPerfilContaResponse(conta, conta.Perfil));
    }

    [HttpPut("profile")]
    public async Task<ActionResult<PerfilContaResponse>> UpdatePerfilConta(
        UpdatePerfilContaRequest request,
        CancellationToken cancellationToken)
    {
        var conta = await dbContext.Contas
            .Include(contaAtual => contaAtual.Perfil)
            .FirstOrDefaultAsync(
                contaAtual => contaAtual.Id == currentContaContext.ContaId,
                cancellationToken);

        if (conta is null)
        {
            return NotFound();
        }

        var perfilConta = conta.Perfil;

        if (perfilConta is null)
        {
            perfilConta = PerfilConta.CreatePerfilConta(
                conta.Id,
                request.NomeComercial,
                request.EmailContato,
                request.TelefoneContato,
                request.SiteUrl,
                request.Instagram,
                request.Documento,
                request.CorPrimaria,
                request.CorSecundaria,
                request.LogoUrl);

            dbContext.PerfisConta.Add(perfilConta);
        }
        else
        {
            perfilConta.AtualizarPerfilConta(
                request.NomeComercial,
                request.EmailContato,
                request.TelefoneContato,
                request.SiteUrl,
                request.Instagram,
                request.Documento,
                request.CorPrimaria,
                request.CorSecundaria,
                request.LogoUrl);
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(BuildPerfilContaResponse(conta, perfilConta));
    }

    private static PerfilContaResponse BuildPerfilContaResponse(Conta conta, PerfilConta? perfilConta)
    {
        return new PerfilContaResponse(
            perfilConta?.Id,
            conta.Id,
            perfilConta?.NomeComercial ?? conta.Nome,
            perfilConta?.EmailContato,
            perfilConta?.TelefoneContato,
            perfilConta?.SiteUrl,
            perfilConta?.Instagram,
            perfilConta?.Documento,
            perfilConta?.CorPrimaria ?? PerfilConta.CorPrimariaPadrao,
            perfilConta?.CorSecundaria ?? PerfilConta.CorSecundariaPadrao,
            perfilConta?.LogoUrl,
            perfilConta?.UpdatedAt);
    }
}
