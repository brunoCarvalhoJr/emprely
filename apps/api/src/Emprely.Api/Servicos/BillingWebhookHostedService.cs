using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Emprely.Api.Servicos;

public sealed class BillingWebhookHostedService : BackgroundService
{
    private static readonly TimeSpan IntervaloProcessamento = TimeSpan.FromSeconds(15);
    private static readonly TimeSpan IntervaloReconciliacao = TimeSpan.FromDays(1);

    private readonly IServiceScopeFactory serviceScopeFactory;
    private readonly ILogger<BillingWebhookHostedService> logger;
    private DateTimeOffset proximaReconciliacaoAt = DateTimeOffset.MinValue;

    public BillingWebhookHostedService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<BillingWebhookHostedService> logger)
    {
        this.serviceScopeFactory = serviceScopeFactory;
        this.logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(IntervaloProcessamento);

        while (!stoppingToken.IsCancellationRequested)
        {
            await ProcessarPendentesAsync(stoppingToken);
            await ReconciliarSeNecessarioAsync(stoppingToken);

            try
            {
                await timer.WaitForNextTickAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }
    }

    private async Task ProcessarPendentesAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = serviceScopeFactory.CreateScope();
            var billingService = scope.ServiceProvider.GetRequiredService<BillingService>();
            _ = await billingService.ProcessarEventosWebhookPendentesAsync(25, cancellationToken);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Falha ao processar eventos pendentes de billing.");
        }
    }

    private async Task ReconciliarSeNecessarioAsync(CancellationToken cancellationToken)
    {
        var agora = DateTimeOffset.UtcNow;
        if (agora < proximaReconciliacaoAt)
        {
            return;
        }

        proximaReconciliacaoAt = agora.Add(IntervaloReconciliacao);

        try
        {
            using var scope = serviceScopeFactory.CreateScope();
            var billingService = scope.ServiceProvider.GetRequiredService<BillingService>();
            _ = await billingService.SincronizarTodasContasAsync(200, cancellationToken);
            _ = await billingService.EnviarEmailsPreVencimentoAsync(cancellationToken);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Falha ao executar reconciliacao diaria de billing.");
        }
    }
}
