using System.Security.Cryptography;
using System.Text;
using Emprely.Api.Configuracoes;
using Emprely.Contracts.Admin;
using Emprely.Domain.Contas;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Emprely.Api.Controllers;

[ApiController]
[EnableRateLimiting(RateLimitAplicacaoOptions.AdminPolicyName)]
[Route("api/admin/accounts")]
public sealed class AdminAccountsController : ControllerBase
{
    private const decimal PlanoFundadorPrecoMensal = 19.90m;

    private readonly AdminOperacoesOptions adminOperacoesOptions;
    private readonly EmprelyDbContext dbContext;

    public AdminAccountsController(
        IOptions<AdminOperacoesOptions> adminOperacoesOptions,
        EmprelyDbContext dbContext)
    {
        this.adminOperacoesOptions = adminOperacoesOptions.Value;
        this.dbContext = dbContext;
    }

    [HttpPost("{contaId:guid}/activate-founder")]
    public async Task<ActionResult<AdminContaResponse>> ActivatePlanoFundadorConta(
        Guid contaId,
        CancellationToken cancellationToken)
    {
        var validarAdminKeyResult = ValidarAdminKey();

        if (validarAdminKeyResult is not null)
        {
            return validarAdminKeyResult;
        }

        var conta = await dbContext.Contas
            .FirstOrDefaultAsync(contaAtual => contaAtual.Id == contaId, cancellationToken);

        if (conta is null)
        {
            return NotFound(new { message = "Conta nao encontrada." });
        }

        conta.ActivatePlanoFundador();
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(BuildAdminContaResponse(conta));
    }

    private ActionResult? ValidarAdminKey()
    {
        var adminKeyConfigurada = adminOperacoesOptions.OperationsKey.Trim();

        if (adminKeyConfigurada.Length < 32)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                new { message = "AdminOperacoes:OperationsKey deve ter pelo menos 32 caracteres." });
        }

        if (!Request.Headers.TryGetValue(AdminOperacoesOptions.HeaderName, out var adminKeyRecebida) ||
            string.IsNullOrWhiteSpace(adminKeyRecebida))
        {
            return Unauthorized(new { message = "Chave administrativa obrigatoria." });
        }

        if (!IsAdminKeyValida(adminKeyRecebida.ToString(), adminKeyConfigurada))
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Chave administrativa invalida." });
        }

        return null;
    }

    private static bool IsAdminKeyValida(string adminKeyRecebida, string adminKeyConfigurada)
    {
        var adminKeyRecebidaBytes = Encoding.UTF8.GetBytes(adminKeyRecebida.Trim());
        var adminKeyConfiguradaBytes = Encoding.UTF8.GetBytes(adminKeyConfigurada);

        return adminKeyRecebidaBytes.Length == adminKeyConfiguradaBytes.Length &&
            CryptographicOperations.FixedTimeEquals(adminKeyRecebidaBytes, adminKeyConfiguradaBytes);
    }

    private static AdminContaResponse BuildAdminContaResponse(Conta conta)
    {
        var agora = DateTimeOffset.UtcNow;

        return new AdminContaResponse(
            conta.Id,
            conta.Nome,
            conta.Slug,
            conta.Plano.ToString(),
            conta.GetStatusComercialConta(agora).ToString(),
            conta.TrialEndsAt,
            conta.PlanoFundadorAtivadoAt,
            PlanoFundadorPrecoMensal);
    }
}
