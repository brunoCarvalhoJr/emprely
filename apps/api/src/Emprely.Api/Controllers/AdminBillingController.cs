using Emprely.Api.Configuracoes;
using Emprely.Api.Servicos;
using Emprely.Contracts.Billing;
using Emprely.Domain.Pagamentos;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[EnableRateLimiting(RateLimitAplicacaoOptions.AdminPolicyName)]
[Route("api/admin/billing/accounts")]
public sealed class AdminBillingController : AdminControllerBase
{
    private readonly EmprelyDbContext dbContext;
    private readonly BillingService billingService;

    public AdminBillingController(
        EmprelyDbContext dbContext,
        BillingService billingService)
    {
        this.dbContext = dbContext;
        this.billingService = billingService;
    }

    [HttpGet("{contaId:guid}")]
    public async Task<ActionResult<AdminBillingContaResponse>> GetContaBilling(
        Guid contaId,
        CancellationToken cancellationToken)
    {
        _ = GetAdminAtual();

        var conta = await dbContext.Contas.AsNoTracking().FirstOrDefaultAsync(
            item => item.Id == contaId,
            cancellationToken);
        if (conta is null)
        {
            return NotFound(new { message = "Conta nao encontrada." });
        }

        var status = await billingService.GetStatusAsync(contaId, cancellationToken);
        if (status is null)
        {
            return NotFound(new { message = "Status de billing nao encontrado." });
        }

        var pagamentos = await dbContext.PagamentosConta
            .AsNoTracking()
            .Where(item => item.ContaId == contaId)
            .OrderByDescending(item => item.CreatedAt)
            .Take(20)
            .Select(item => new AdminBillingPagamentoResponse(
                item.Id,
                item.Status.ToString(),
                item.MetodoPagamento.ToString(),
                item.Ciclo.ToString(),
                item.Valor,
                item.RefundedAmount ?? 0m,
                item.ProviderPaymentId,
                item.InvoiceUrl,
                item.CreatedAt,
                item.PaidAt))
            .ToListAsync(cancellationToken);
        var historico = await dbContext.HistoricosAssinaturaConta
            .AsNoTracking()
            .Where(item => item.ContaId == contaId)
            .OrderByDescending(item => item.CreatedAt)
            .Take(30)
            .Select(item => new AdminBillingHistoricoResponse(
                item.Evento,
                item.Detalhes,
                item.CreatedAt))
            .ToListAsync(cancellationToken);
        var webhooks = await dbContext.EventosWebhookPagamento
            .AsNoTracking()
            .Where(item => item.ContaId == contaId ||
                item.PagamentoContaId != null && dbContext.PagamentosConta.Any(pagamento =>
                    pagamento.Id == item.PagamentoContaId && pagamento.ContaId == contaId) ||
                item.AssinaturaContaId != null && dbContext.AssinaturasConta.Any(assinatura =>
                    assinatura.Id == item.AssinaturaContaId && assinatura.ContaId == contaId) ||
                item.ProviderResourceId != null && dbContext.PagamentosConta.Any(pagamento =>
                    pagamento.ContaId == contaId &&
                    (pagamento.ProviderPaymentId == item.ProviderResourceId ||
                        pagamento.ProviderCheckoutId == item.ProviderResourceId ||
                        pagamento.ProviderSubscriptionId == item.ProviderResourceId)) ||
                item.ProviderResourceId != null && dbContext.AssinaturasConta.Any(assinatura =>
                    assinatura.ContaId == contaId && assinatura.ProviderSubscriptionId == item.ProviderResourceId))
            .OrderByDescending(item => item.CreatedAt)
            .Take(30)
            .Select(item => new AdminBillingWebhookResponse(
                item.Id,
                item.TipoEvento,
                item.StatusProcessamento.ToString(),
                item.ProviderResourceId,
                item.PagamentoContaId,
                item.AssinaturaContaId,
                item.TentativasProcessamento,
                item.RecebidoAt,
                item.ProcessadoAt,
                item.ProximaTentativaAt,
                item.ErroProcessamento))
            .ToListAsync(cancellationToken);

        return Ok(new AdminBillingContaResponse(
            conta.Id,
            conta.Nome,
            conta.Plano.ToString(),
            conta.GetStatusComercialConta(DateTimeOffset.UtcNow).ToString(),
            status,
            pagamentos,
            historico,
            webhooks));
    }

    [HttpPost("{contaId:guid}/sync")]
    public async Task<IActionResult> SyncContaBilling(
        Guid contaId,
        AdminBillingAcaoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var processados = await billingService.SincronizarContaAsync(contaId, cancellationToken);
        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "BillingSyncSolicitado",
            "Conta",
            contaId,
            request.Motivo,
            $"Eventos processados localmente={processados}.",
            cancellationToken);

        return Accepted(new { message = "Sincronizacao local executada.", processados });
    }

    [HttpPost("{contaId:guid}/webhooks/{eventoId:guid}/reprocess")]
    public async Task<IActionResult> ReprocessarWebhook(
        Guid contaId,
        Guid eventoId,
        AdminBillingAcaoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var processado = await billingService.ReprocessarWebhookContaAsync(contaId, eventoId, cancellationToken);
        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "BillingWebhookReprocessado",
            "EventoWebhookPagamento",
            eventoId,
            request.Motivo,
            $"Conta={contaId};Processado={processado}.",
            cancellationToken);

        return Accepted(new { message = "Reprocessamento solicitado.", processado });
    }

    [HttpPost("{contaId:guid}/suspend")]
    public async Task<IActionResult> SuspenderBilling(
        Guid contaId,
        AdminBillingAcaoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        try
        {
            await billingService.SuspenderAdminAsync(contaId, request.Motivo, cancellationToken);
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "BillingSuspenso",
            "Conta",
            contaId,
            request.Motivo,
            "Suspensao validada pelas regras de billing.",
            cancellationToken);

        return NoContent();
    }

    [HttpPost("{contaId:guid}/restore")]
    public async Task<IActionResult> RestaurarBilling(
        Guid contaId,
        AdminBillingAcaoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        try
        {
            await billingService.RestaurarAdminAsync(contaId, request.Motivo, cancellationToken);
        }
        catch (BillingConflictException exception)
        {
            return Conflict(new { message = exception.Message });
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "BillingRestaurado",
            "Conta",
            contaId,
            request.Motivo,
            "Restauracao validada pelas regras de billing.",
            cancellationToken);

        return NoContent();
    }

    [HttpPost("{contaId:guid}/refunds")]
    public async Task<IActionResult> ReembolsarUltimoPagamento(
        Guid contaId,
        AdminBillingReembolsoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        try
        {
            await billingService.ReembolsarUltimoPagamentoAsync(contaId, request.Motivo, request.Valor, cancellationToken);
        }
        catch (BillingConflictException exception)
        {
            return Conflict(new { message = exception.Message });
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "BillingReembolsoSolicitado",
            "Conta",
            contaId,
            request.Motivo,
            "Reembolso enviado ao provedor de pagamento.",
            cancellationToken);

        return NoContent();
    }

    [HttpPost("{contaId:guid}/manual-credit")]
    public async Task<IActionResult> ConcederCreditoManual(
        Guid contaId,
        AdminBillingAcaoRequest request,
        CancellationToken cancellationToken)
    {
        var admin = GetAdminAtual();
        var superAdminResult = ExigirSuperAdmin(admin);
        if (superAdminResult is not null)
        {
            return superAdminResult;
        }

        try
        {
            await billingService.ConcederCreditoManualAsync(contaId, admin.Id, request.Motivo, cancellationToken);
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }

        await RegistrarAuditoriaAsync(
            dbContext,
            admin,
            "BillingCreditoManualConcedido",
            "Conta",
            contaId,
            request.Motivo,
            "Credito manual de 30 dias concedido por Super Admin.",
            cancellationToken);

        return NoContent();
    }
}
