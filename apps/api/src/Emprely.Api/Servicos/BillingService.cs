using System.Text.Json;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using Emprely.Api.Comunicacoes;
using Emprely.Application.Pagamentos;
using Emprely.Application.Comunicacoes;
using Emprely.Contracts.Billing;
using Emprely.Domain.Comunicacoes;
using Emprely.Domain.Contas;
using Emprely.Domain.Pagamentos;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Pagamentos;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Emprely.Api.Servicos;

public sealed class BillingService
{
    private const int InadimplenciaToleranciaDias = 3;

    private readonly EmprelyDbContext dbContext;
    private readonly IProvedorPagamentos provedorPagamentos;
    private readonly IEmailTransacionalService emailTransacionalService;
    private readonly BillingEntitlementsService entitlementsService;
    private readonly AsaasOptions asaasOptions;
    private readonly AppPublicOptions appPublicOptions;
    private readonly IDataProtector publicPaymentLinkProtector;

    public BillingService(
        EmprelyDbContext dbContext,
        IProvedorPagamentos provedorPagamentos,
        IEmailTransacionalService emailTransacionalService,
        BillingEntitlementsService entitlementsService,
        IOptions<AsaasOptions> asaasOptions,
        IOptions<AppPublicOptions> appPublicOptions,
        IDataProtectionProvider dataProtectionProvider)
    {
        this.dbContext = dbContext;
        this.provedorPagamentos = provedorPagamentos;
        this.emailTransacionalService = emailTransacionalService;
        this.entitlementsService = entitlementsService;
        this.asaasOptions = asaasOptions.Value;
        this.appPublicOptions = appPublicOptions.Value;
        publicPaymentLinkProtector = dataProtectionProvider.CreateProtector("Emprely.Billing.PublicPaymentLink.v1");
    }

    public async Task<BillingStatusResponse?> GetStatusAsync(
        Guid contaId,
        CancellationToken cancellationToken)
    {
        var conta = await dbContext.Contas.FirstOrDefaultAsync(
            contaAtual => contaAtual.Id == contaId,
            cancellationToken);

        if (conta is null)
        {
            return null;
        }

        var assinatura = await dbContext.AssinaturasConta
            .Where(item => item.ContaId == contaId)
            .OrderByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);
        var pagamentosHistorico = await dbContext.PagamentosConta
            .AsNoTracking()
            .Where(item => item.ContaId == contaId && item.CreatedAt >= DateTimeOffset.UtcNow.AddMonths(-12))
            .OrderByDescending(item => item.CreatedAt)
            .Take(24)
            .Select(item => new BillingPagamentoHistoricoResponse(
                item.Id,
                item.Status.ToString(),
                item.MetodoPagamento.ToString(),
                item.Ciclo.ToString(),
                item.Valor,
                item.RefundedAmount ?? 0m,
                item.InvoiceUrl,
                item.DueDate,
                item.CreatedAt,
                item.PaidAt,
                item.RefundedAt))
            .ToListAsync(cancellationToken);
        var pagamentoAtual = pagamentosHistorico
            .Where(item => item.Status is not nameof(StatusPagamentoConta.Reembolsado))
            .OrderByDescending(item => item.PaidAt ?? item.CreatedAt)
            .FirstOrDefault();
        var entitlements = await entitlementsService.GetEntitlementsAsync(conta, cancellationToken);
        var statusComercial = entitlements.CanRemoveWatermark
            ? StatusComercialConta.FundadorAtivo.ToString()
            : entitlements.CanGenerateProposta
                ? StatusComercialConta.TrialAtivo.ToString()
                : StatusComercialConta.TrialExpirado.ToString();
        var cta = pagamentoAtual?.InvoiceUrl is not null &&
            pagamentoAtual.Status is nameof(StatusPagamentoConta.AguardandoPagamento) or
                nameof(StatusPagamentoConta.EmAnalise) or
                nameof(StatusPagamentoConta.Vencido)
            ? "pagar_cobranca"
            : entitlements.CanRemoveWatermark ? "plano_ativo" : "ativar_plano";
        var mensagem = BuildMensagemStatus(conta, assinatura, pagamentoAtual, entitlements);

        BillingPagamentoAtualResponse? pagamentoAtualResponse = pagamentoAtual is null
            ? null
            : new BillingPagamentoAtualResponse(
                pagamentoAtual.Id,
                pagamentoAtual.Status,
                pagamentoAtual.MetodoPagamento,
                pagamentoAtual.Ciclo,
                pagamentoAtual.Valor,
                pagamentoAtual.ValorReembolsado,
                pagamentoAtual.InvoiceUrl,
                pagamentoAtual.DueDate,
                pagamentoAtual.CreatedAt,
                pagamentoAtual.PaidAt);

        return new BillingStatusResponse(
            conta.Plano.ToString(),
            statusComercial,
            assinatura?.Status.ToString(),
            assinatura?.MetodoPagamento.ToString(),
            assinatura?.Ciclo.ToString(),
            assinatura?.Valor,
            assinatura?.Moeda ?? "BRL",
            conta.TrialEndsAt,
            conta.GetDiasRestantesTrial(DateTimeOffset.UtcNow),
            assinatura?.PeriodoAtualFim,
            assinatura?.PeriodoAtualFim,
            assinatura?.CancelAtPeriodEnd ?? false,
            entitlements,
            pagamentoAtualResponse,
            pagamentosHistorico,
            cta,
            mensagem);
    }

    private static string BuildMensagemStatus(
        Conta conta,
        AssinaturaConta? assinatura,
        BillingPagamentoHistoricoResponse? pagamentoAtual,
        BillingEntitlementsResponse entitlements)
    {
        if (assinatura?.Status == StatusAssinaturaConta.CancelamentoAgendado)
        {
            return "Sua renovacao foi cancelada. O acesso pago continua ate o fim do periodo atual.";
        }

        if (assinatura?.Status == StatusAssinaturaConta.Inadimplente)
        {
            return "Existe pendencia de pagamento. Regularize a cobranca para manter o acesso pago.";
        }

        if (assinatura?.Status is StatusAssinaturaConta.Suspensa or StatusAssinaturaConta.Cancelada)
        {
            return "Seu acesso pago esta encerrado. Crie um novo checkout para voltar ao Plano Fundador.";
        }

        if (pagamentoAtual?.Status is nameof(StatusPagamentoConta.AguardandoPagamento) or nameof(StatusPagamentoConta.Vencido))
        {
            return "Conclua o pagamento no checkout hospedado do Asaas para liberar o Plano Fundador.";
        }

        if (entitlements.CanRemoveWatermark)
        {
            return "Plano ativo.";
        }

        return conta.IsTrialAtivo(DateTimeOffset.UtcNow)
                ? "Voce esta no teste gratis. Ative o Plano Fundador para remover a marca d'agua."
                : "Seu teste expirou. Ative o Plano Fundador para gerar, exportar e compartilhar propostas.";
    }

    public async Task SolicitarLinkPagamentoPublicoAsync(
        PublicBillingPaymentLinkRequest request,
        CancellationToken cancellationToken)
    {
        var email = NormalizarEmailPublico(request.Email);
        var usuario = await dbContext.Users
            .Where(item => item.NormalizedEmail == email.ToUpperInvariant())
            .OrderBy(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (usuario is null ||
            usuario.BloqueadoAdministrativamenteAt is not null ||
            usuario.LockoutEnd > DateTimeOffset.UtcNow)
        {
            return;
        }

        var membroConta = await dbContext.MembrosConta
            .Include(item => item.Conta)
            .Where(item => item.UsuarioId == usuario.Id &&
                item.Status == StatusMembroConta.Ativo &&
                item.Conta != null &&
                item.Conta.Status == StatusConta.Ativa)
            .OrderBy(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (membroConta?.Conta is null)
        {
            return;
        }

        var expiresAt = DateTimeOffset.UtcNow.AddHours(24);
        var token = BuildPublicPaymentToken(membroConta.ContaId, usuario.Id, expiresAt);
        var url = BuildPublicWebUrl($"billing/pagar/{Uri.EscapeDataString(token)}");

        await emailTransacionalService.EnviarAsync(
            EmailTransacionalTemplateBuilder.Build(
                membroConta.ContaId,
                usuario.Id,
                TipoEmailTransacional.BillingLinkPagamentoPublico,
                usuario.Email ?? email,
                "Link para regularizar seu Plano Fundador",
                $"Use este link para regularizar o Plano Fundador da conta {membroConta.Conta.Nome}. O link vale ate {expiresAt:dd/MM/yyyy HH:mm} UTC: {url}",
                appPublicOptions.PublicWebUrl,
                HashPublicPaymentToken(token)),
            cancellationToken);
    }

    public async Task<PublicBillingPaymentLinkResponse> GetLinkPagamentoPublicoAsync(
        string token,
        CancellationToken cancellationToken)
    {
        var acesso = await ValidarLinkPagamentoPublicoAsync(token, cancellationToken);
        var status = await GetStatusAsync(acesso.ContaId, cancellationToken)
            ?? throw new BillingException("Conta nao encontrada.");

        return new PublicBillingPaymentLinkResponse(
            acesso.ContaNome,
            acesso.ExpiresAt,
            status,
            BillingCatalogo.GetPlanos());
    }

    public async Task<BillingCheckoutResponse> CriarCheckoutPublicoAsync(
        string token,
        CreateBillingCheckoutRequest request,
        CancellationToken cancellationToken)
    {
        var acesso = await ValidarLinkPagamentoPublicoAsync(token, cancellationToken);
        return await CriarCheckoutAsync(acesso.ContaId, acesso.UsuarioId, request, cancellationToken);
    }

    public async Task<BillingCheckoutResponse> CriarCheckoutAsync(
        Guid contaId,
        Guid usuarioId,
        CreateBillingCheckoutRequest request,
        CancellationToken cancellationToken)
    {
        var ciclo = ParseCicloPlano(request.Ciclo);
        if (!BillingCatalogo.TryGetPlano(request.PlanoCodigo, ciclo, out var plano))
        {
            throw new BillingException("Plano invalido.");
        }

        if (!Enum.TryParse<MetodoPagamento>(request.MetodoPagamento, ignoreCase: true, out var metodoPagamento) ||
            !Enum.IsDefined(metodoPagamento))
        {
            throw new BillingException("Metodo de pagamento invalido.");
        }

        if (!BillingCatalogo.IsMetodoPagamentoAtivo(metodoPagamento))
        {
            throw new BillingConflictException("Metodo de pagamento ainda nao disponivel para recorrencia automatica.");
        }

        Conta conta;
        string? email;
        AssinaturaConta? assinatura = null;
        PagamentoConta pagamento;
        PagadorPagamentoRequest? pagador = null;
        string? providerSubscriptionAnterior = null;

        await using (var transaction = await dbContext.Database.BeginTransactionAsync(
            IsolationLevel.Serializable,
            cancellationToken))
        {
            await TouchBillingContaLockAsync(contaId, cancellationToken);

            conta = await dbContext.Contas.FirstOrDefaultAsync(
                contaAtual => contaAtual.Id == contaId,
                cancellationToken) ?? throw new BillingException("Conta nao encontrada.");
            email = await dbContext.Users
                .Where(usuario => usuario.Id == usuarioId)
                .Select(usuario => usuario.Email)
                .FirstOrDefaultAsync(cancellationToken);

            assinatura = await dbContext.AssinaturasConta
                .Where(item => item.ContaId == contaId)
                .OrderByDescending(item => item.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);
            var agora = DateTimeOffset.UtcNow;

            if (assinatura is null)
            {
                assinatura = AssinaturaConta.Create(
                    contaId,
                    plano.PlanoCodigo,
                    ProvedorPagamento.Asaas,
                    metodoPagamento,
                    plano.Valor);
                assinatura.DefinirCiclo(plano.Ciclo, plano.Valor);
                dbContext.AssinaturasConta.Add(assinatura);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
            else
            {
                if (IsAssinaturaComAcessoPago(assinatura, agora))
                {
                    if (assinatura.Ciclo == plano.Ciclo)
                    {
                        throw new BillingConflictException("Assinatura ja esta ativa.");
                    }

                    var assinaturaPendenteTroca = await dbContext.AssinaturasConta
                        .Where(item => item.ContaId == contaId &&
                            item.Status == StatusAssinaturaConta.AguardandoPagamento &&
                            item.Ciclo == plano.Ciclo &&
                            item.MetodoPagamento == metodoPagamento)
                        .OrderByDescending(item => item.CreatedAt)
                        .FirstOrDefaultAsync(cancellationToken);
                    if (assinaturaPendenteTroca is not null)
                    {
                        var pagamentoAbertoTroca = await GetPagamentoAbertoAsync(
                            assinaturaPendenteTroca.Id,
                            metodoPagamento,
                            plano.Ciclo,
                            cancellationToken);
                        if (pagamentoAbertoTroca is not null)
                        {
                            await transaction.CommitAsync(cancellationToken);
                            return BuildCheckoutResponse(pagamentoAbertoTroca, metodoPagamento);
                        }
                    }

                    providerSubscriptionAnterior = assinatura.ProviderSubscriptionId;
                    assinatura = AssinaturaConta.Create(
                        contaId,
                        plano.PlanoCodigo,
                        ProvedorPagamento.Asaas,
                        metodoPagamento,
                        plano.Valor);
                    assinatura.DefinirCiclo(plano.Ciclo, plano.Valor);
                    dbContext.AssinaturasConta.Add(assinatura);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
                else
                {
                    var pagamentoAberto = await GetPagamentoAbertoAsync(assinatura.Id, metodoPagamento, plano.Ciclo, cancellationToken);
                    if (pagamentoAberto is not null)
                    {
                        await transaction.CommitAsync(cancellationToken);
                        return BuildCheckoutResponse(pagamentoAberto, metodoPagamento);
                    }

                    providerSubscriptionAnterior = assinatura.ProviderSubscriptionId;
                    assinatura.MarcarAguardandoPagamento(metodoPagamento, plano.Ciclo, plano.Valor);
                }
            }

            pagador = ValidarPagadorCheckout(request.Pagador);
            pagamento = PagamentoConta.Create(
                contaId,
                assinatura.Id,
                plano.PlanoCodigo,
                ProvedorPagamento.Asaas,
                metodoPagamento,
                plano.Valor);
            pagamento.DefinirCiclo(plano.Ciclo);
            dbContext.PagamentosConta.Add(pagamento);
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }

        if (assinatura is null)
        {
            throw new BillingException("Assinatura nao encontrada.");
        }

        if (pagador is null)
        {
            throw new BillingException("Informe os dados do pagador para gerar o checkout.");
        }

        var externalReference = $"{contaId:N}:{assinatura.Id:N}:{pagamento.Id:N}";
        CheckoutPagamentoResultado checkout;
        try
        {
            checkout = await provedorPagamentos.CriarCheckoutAsync(
            new CriarCheckoutPagamentoRequest(
                contaId,
                conta.Nome,
                email,
                plano.PlanoCodigo,
                plano.Ciclo == CicloPlano.Anual
                    ? "Plano Fundador Emprely - anual"
                    : "Plano Fundador Emprely - mensal",
                plano.Valor,
                metodoPagamento.ToString(),
                plano.Ciclo.ToString(),
                assinatura.ProviderCustomerId,
                externalReference,
                asaasOptions.CheckoutSuccessUrl,
                asaasOptions.CheckoutCancelUrl,
                asaasOptions.CheckoutExpiredUrl,
                pagador),
            cancellationToken);
        }
        catch
        {
            await MarcarCheckoutFalhouAsync(pagamento.Id, "CheckoutProviderFailed", cancellationToken);
            throw;
        }

        try
        {
            await using var vinculoTransaction = await dbContext.Database.BeginTransactionAsync(
                IsolationLevel.Serializable,
                cancellationToken);
            await TouchBillingContaLockAsync(contaId, cancellationToken);

            var assinaturaPersistida = await dbContext.AssinaturasConta.FirstAsync(
                item => item.Id == assinatura.Id,
                cancellationToken);
            var pagamentoPersistido = await dbContext.PagamentosConta.FirstAsync(
                item => item.Id == pagamento.Id,
                cancellationToken);

            assinaturaPersistida.VincularProvider(checkout.ProviderCustomerId, checkout.ProviderSubscriptionId);
            pagamentoPersistido.VincularProvider(
                checkout.ProviderPaymentId,
                checkout.ProviderCheckoutId,
                checkout.ProviderSubscriptionId,
                externalReference,
                checkout.CheckoutUrl,
                checkout.DueDate);
            dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                contaId,
                assinatura.Id,
                pagamento.Id,
                "CheckoutCreated",
                $"{metodoPagamento};{plano.Ciclo}"));
            await dbContext.SaveChangesAsync(cancellationToken);
            await vinculoTransaction.CommitAsync(cancellationToken);
            pagamento = pagamentoPersistido;
        }
        catch
        {
            if (!string.IsNullOrWhiteSpace(checkout.ProviderSubscriptionId))
            {
                try
                {
                    await provedorPagamentos.CancelarAssinaturaAsync(checkout.ProviderSubscriptionId, CancellationToken.None);
                }
                catch
                {
                    // Falha de compensacao deve aparecer na reconciliacao operacional.
                }
            }

            throw;
        }

        if (!string.IsNullOrWhiteSpace(providerSubscriptionAnterior))
        {
            try
            {
                await provedorPagamentos.CancelarAssinaturaAsync(providerSubscriptionAnterior, cancellationToken);
            }
            catch
            {
                dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                    contaId,
                    assinatura.Id,
                    pagamento.Id,
                    "PreviousSubscriptionCancelFailed",
                    "Nova cobranca criada; falha ao cancelar recorrencia anterior requer reconciliacao operacional."));
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }

        return BuildCheckoutResponse(pagamento, metodoPagamento);
    }

    public async Task CancelarAsync(
        Guid contaId,
        string? motivo,
        CancellationToken cancellationToken)
    {
        var assinatura = await dbContext.AssinaturasConta
            .Where(item => item.ContaId == contaId)
            .OrderByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken) ?? throw new BillingException("Assinatura nao encontrada.");
        var agora = DateTimeOffset.UtcNow;

        if (!IsAssinaturaComAcessoPago(assinatura, agora))
        {
            throw new BillingConflictException("Somente assinatura ativa pode ser cancelada.");
        }

        if (!string.IsNullOrWhiteSpace(assinatura.ProviderSubscriptionId))
        {
            await provedorPagamentos.CancelarAssinaturaAsync(assinatura.ProviderSubscriptionId, cancellationToken);
        }

        assinatura.AgendarCancelamento(motivo);
        dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
            contaId,
            assinatura.Id,
            null,
            "CancelScheduled",
            motivo));
        await dbContext.SaveChangesAsync(cancellationToken);
        await EnviarEmailBillingAsync(
            contaId,
            TipoEmailTransacional.BillingCancelamentoAgendado,
            "Renovacao do Plano Fundador cancelada",
            $"A renovacao foi cancelada. Seu acesso segue ate {assinatura.PeriodoAtualFim:dd/MM/yyyy}.",
            cancellationToken);
    }

    public async Task ReactivarAsync(Guid contaId, CancellationToken cancellationToken)
    {
        _ = await dbContext.AssinaturasConta
            .Where(item => item.ContaId == contaId)
            .OrderByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken) ?? throw new BillingException("Assinatura nao encontrada.");

        throw new BillingConflictException("Crie um novo checkout para reativar a assinatura.");
    }

    public async Task ReembolsarUltimoPagamentoAsync(
        Guid contaId,
        string? motivo,
        decimal? valor,
        CancellationToken cancellationToken)
    {
        var pagamento = await dbContext.PagamentosConta
            .Where(item => item.ContaId == contaId)
            .Where(item => item.Status == StatusPagamentoConta.Confirmado ||
                item.Status == StatusPagamentoConta.Recebido ||
                item.Status == StatusPagamentoConta.ReembolsadoParcial)
            .OrderByDescending(item => item.PaidAt ?? item.ConfirmedAt ?? item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken) ?? throw new BillingException("Pagamento nao encontrado.");

        if (string.IsNullOrWhiteSpace(pagamento.ProviderPaymentId))
        {
            throw new BillingException("Pagamento nao possui identificador remoto para reembolso automatico.");
        }

        var valorReembolso = valor ?? pagamento.GetSaldoReembolsavel();
        if (valorReembolso <= 0m)
        {
            throw new BillingConflictException("Pagamento nao possui saldo reembolsavel.");
        }

        if (valorReembolso > pagamento.GetSaldoReembolsavel())
        {
            throw new BillingConflictException("Valor do reembolso maior que o saldo reembolsavel.");
        }

        await provedorPagamentos.ReembolsarPagamentoAsync(
            pagamento.ProviderPaymentId,
            valorReembolso,
            motivo,
            cancellationToken);

        var assinatura = await dbContext.AssinaturasConta.FirstOrDefaultAsync(
            item => item.Id == pagamento.AssinaturaContaId,
            cancellationToken);
        var reembolsoTotal = valorReembolso >= pagamento.GetSaldoReembolsavel();
        var cancelamentoRecorrenciaFalhou = false;
        if (reembolsoTotal && !string.IsNullOrWhiteSpace(assinatura?.ProviderSubscriptionId))
        {
            try
            {
                await provedorPagamentos.CancelarAssinaturaAsync(assinatura.ProviderSubscriptionId, cancellationToken);
            }
            catch
            {
                cancelamentoRecorrenciaFalhou = true;
            }
        }

        pagamento.RegistrarReembolso(valorReembolso, DateTimeOffset.UtcNow);
        if (reembolsoTotal)
        {
            assinatura?.Suspender("Pagamento reembolsado.");
        }
        dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
            contaId,
            pagamento.AssinaturaContaId,
            pagamento.Id,
            cancelamentoRecorrenciaFalhou
                ? "RefundRequestedCancelFailed"
                : reembolsoTotal ? "RefundRequested" : "PartialRefundRequested",
            cancelamentoRecorrenciaFalhou
                ? $"{motivo} | Falha ao cancelar recorrencia remota; requer reconciliacao operacional."
                : $"{motivo} | Valor={valorReembolso:0.00}"));
        await dbContext.SaveChangesAsync(cancellationToken);
        await EnviarEmailBillingAsync(
            contaId,
            reembolsoTotal ? TipoEmailTransacional.BillingReembolsoIntegral : TipoEmailTransacional.BillingReembolsoParcial,
            reembolsoTotal ? "Reembolso integral registrado" : "Reembolso parcial registrado",
            reembolsoTotal
                ? $"O pagamento de {pagamento.Valor:0.00} foi reembolsado integralmente e o acesso pago foi suspenso."
                : $"Foi registrado reembolso parcial de {valorReembolso:0.00}. O acesso pago continua ativo se houver periodo vigente.",
            cancellationToken);
    }

    public Task ReembolsarUltimoPagamentoAsync(
        Guid contaId,
        string? motivo,
        CancellationToken cancellationToken)
    {
        return ReembolsarUltimoPagamentoAsync(contaId, motivo, null, cancellationToken);
    }

    public async Task RestaurarAdminAsync(
        Guid contaId,
        string? motivo,
        CancellationToken cancellationToken)
    {
        var assinatura = await dbContext.AssinaturasConta
            .Where(item => item.ContaId == contaId)
            .OrderByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken) ?? throw new BillingException("Assinatura nao encontrada.");
        var agora = DateTimeOffset.UtcNow;
        var possuiPagamentoPago = await dbContext.PagamentosConta.AnyAsync(
            item => item.AssinaturaContaId == assinatura.Id &&
                (item.Status == StatusPagamentoConta.Confirmado ||
                    item.Status == StatusPagamentoConta.Recebido ||
                    item.Status == StatusPagamentoConta.ReembolsadoParcial),
            cancellationToken);
        var possuiCreditoManualVigente = await dbContext.DiasGratisConta.AnyAsync(
            item => item.ContaId == contaId && item.InicioAt <= agora && item.FimAt > agora,
            cancellationToken);

        if ((!possuiPagamentoPago || !assinatura.IsPeriodoVigente(agora)) && !possuiCreditoManualVigente)
        {
            throw new BillingConflictException("Assinatura sem pagamento vigente. Crie novo checkout ou aguarde reconciliacao.");
        }

        assinatura.Restaurar();
        dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
            contaId,
            assinatura.Id,
            null,
            "AccessRestored",
            motivo));
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task SuspenderAdminAsync(
        Guid contaId,
        string? motivo,
        CancellationToken cancellationToken)
    {
        var assinatura = await dbContext.AssinaturasConta
            .Where(item => item.ContaId == contaId)
            .OrderByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken) ?? throw new BillingException("Assinatura nao encontrada.");

        var cancelamentoRecorrenciaFalhou = false;
        if (!string.IsNullOrWhiteSpace(assinatura.ProviderSubscriptionId))
        {
            try
            {
                await provedorPagamentos.CancelarAssinaturaAsync(assinatura.ProviderSubscriptionId, cancellationToken);
            }
            catch
            {
                cancelamentoRecorrenciaFalhou = true;
            }
        }

        assinatura.Suspender(motivo);
        dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
            contaId,
            assinatura.Id,
            null,
            cancelamentoRecorrenciaFalhou ? "AccessSuspendedCancelFailed" : "AccessSuspended",
            cancelamentoRecorrenciaFalhou
                ? $"{motivo} | Falha ao cancelar recorrencia remota; requer reconciliacao operacional."
                : motivo));
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task ConcederCreditoManualAsync(
        Guid contaId,
        Guid adminId,
        string? motivo,
        CancellationToken cancellationToken)
    {
        var contaExiste = await dbContext.Contas.AnyAsync(
            item => item.Id == contaId,
            cancellationToken);
        if (!contaExiste)
        {
            throw new BillingException("Conta nao encontrada.");
        }

        var agora = DateTimeOffset.UtcNow;
        var fim = agora.AddDays(30);
        var motivoFinal = string.IsNullOrWhiteSpace(motivo)
            ? "Credito manual de billing concedido por Super Admin."
            : motivo.Trim();

        dbContext.DiasGratisConta.Add(DiasGratisConta.Create(
            contaId,
            agora,
            fim,
            motivoFinal,
            adminId));
        dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
            contaId,
            null,
            null,
            "ManualBillingCreditGranted",
            $"{motivoFinal} | Inicio={agora:O};Fim={fim:O};AdminId={adminId}"));
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<int> SincronizarContaAsync(Guid contaId, CancellationToken cancellationToken)
    {
        var processados = 0;
        var agora = DateTimeOffset.UtcNow;
        var eventos = await dbContext.EventosWebhookPagamento
            .Where(item =>
                (item.StatusProcessamento == StatusProcessamentoWebhook.Recebido ||
                    (item.StatusProcessamento == StatusProcessamentoWebhook.Erro &&
                        (item.ProximaTentativaAt == null || item.ProximaTentativaAt <= agora))) &&
                (item.ContaId == contaId ||
                    dbContext.PagamentosConta.Any(pagamento =>
                        pagamento.ContaId == contaId &&
                        item.ProviderResourceId != null &&
                        (pagamento.ProviderPaymentId == item.ProviderResourceId ||
                            pagamento.ProviderCheckoutId == item.ProviderResourceId ||
                            pagamento.ProviderSubscriptionId == item.ProviderResourceId)) ||
                    dbContext.AssinaturasConta.Any(assinatura =>
                        assinatura.ContaId == contaId &&
                        item.ProviderResourceId != null &&
                        assinatura.ProviderSubscriptionId == item.ProviderResourceId)))
            .OrderBy(item => item.CreatedAt)
            .Take(50)
            .ToListAsync(cancellationToken);

        foreach (var evento in eventos)
        {
            evento.MarcarEmProcessamento(agora);
            await dbContext.SaveChangesAsync(cancellationToken);

            if (await ProcessarEventoWebhookAsaasAsync(evento, cancellationToken))
            {
                processados++;
            }
        }

        var assinatura = await dbContext.AssinaturasConta
            .Where(item => item.ContaId == contaId)
            .OrderByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (assinatura is not null && !string.IsNullOrWhiteSpace(assinatura.ProviderSubscriptionId))
        {
            processados += await SincronizarAssinaturaRemotaAsync(assinatura, cancellationToken);
        }

        if (assinatura is not null &&
            (assinatura.Status == StatusAssinaturaConta.Ativa ||
                assinatura.Status == StatusAssinaturaConta.CancelamentoAgendado) &&
            assinatura.PeriodoAtualFim.HasValue &&
            assinatura.PeriodoAtualFim <= agora)
        {
            var mudouStatus = false;
            if (assinatura.Status == StatusAssinaturaConta.CancelamentoAgendado)
            {
                assinatura.CancelarAgora("Periodo encerrado apos cancelamento agendado.");
                mudouStatus = true;
                await EnviarEmailBillingAsync(
                    contaId,
                    TipoEmailTransacional.BillingCancelamentoEfetivado,
                    "Plano Fundador encerrado",
                    "O periodo pago terminou e a renovacao estava cancelada.",
                    cancellationToken);
            }
            else if (assinatura.PeriodoAtualFim.Value.AddDays(InadimplenciaToleranciaDias) <= agora)
            {
                assinatura.MarcarInadimplente();
                mudouStatus = true;
                await EnviarEmailBillingAsync(
                    contaId,
                    TipoEmailTransacional.BillingBloqueioInadimplencia,
                    "Acesso pago bloqueado por inadimplencia",
                    "O periodo vigente terminou e nao houve pagamento recorrente confirmado dentro da tolerancia.",
                    cancellationToken);
            }

            if (mudouStatus)
            {
                dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                    contaId,
                    assinatura.Id,
                    null,
                    assinatura.Status == StatusAssinaturaConta.Cancelada ? "SubscriptionCanceledBySync" : "AccessExpiredBySync",
                    "Periodo vigente encerrado sem pagamento recorrente confirmado."));
                await dbContext.SaveChangesAsync(cancellationToken);
                processados++;
            }
        }

        return processados;
    }

    public async Task<int> SincronizarTodasContasAsync(int limite, CancellationToken cancellationToken)
    {
        var contaIds = await dbContext.AssinaturasConta
            .AsNoTracking()
            .Where(item => item.ProviderSubscriptionId != null)
            .OrderByDescending(item => item.UpdatedAt)
            .Select(item => item.ContaId)
            .Distinct()
            .Take(limite)
            .ToListAsync(cancellationToken);
        var processados = 0;

        foreach (var contaId in contaIds)
        {
            processados += await SincronizarContaAsync(contaId, cancellationToken);
        }

        return processados;
    }

    public async Task<int> EnviarEmailsPreVencimentoAsync(CancellationToken cancellationToken)
    {
        var agora = DateTimeOffset.UtcNow;
        var inicioJanela = agora.AddHours(20);
        var fimJanela = agora.AddHours(32);
        var assinaturas = await dbContext.AssinaturasConta
            .AsNoTracking()
            .Where(item =>
                item.Status == StatusAssinaturaConta.Ativa &&
                item.PeriodoAtualFim.HasValue &&
                item.PeriodoAtualFim >= inicioJanela &&
                item.PeriodoAtualFim <= fimJanela)
            .Select(item => new
            {
                item.ContaId,
                item.PeriodoAtualFim,
            })
            .ToListAsync(cancellationToken);
        var enviados = 0;

        foreach (var assinatura in assinaturas)
        {
            var jaEnviado = await dbContext.EmailsTransacionais.AnyAsync(
                item => item.ContaId == assinatura.ContaId &&
                    item.Tipo == TipoEmailTransacional.BillingPagamentoPendente &&
                    item.CreatedAt >= agora.AddHours(-36),
                cancellationToken);
            if (jaEnviado)
            {
                continue;
            }

            await EnviarEmailBillingAsync(
                assinatura.ContaId,
                TipoEmailTransacional.BillingPagamentoPendente,
                "Sua renovacao do Plano Fundador esta proxima",
                $"Sua renovacao vence em {assinatura.PeriodoAtualFim:dd/MM/yyyy}. Se houver cobranca pendente, acompanhe pelo app.",
                cancellationToken);
            enviados++;
        }

        return enviados;
    }

    private async Task<int> SincronizarAssinaturaRemotaAsync(
        AssinaturaConta assinatura,
        CancellationToken cancellationToken)
    {
        var processados = 0;
        try
        {
            var assinaturaRemota = await provedorPagamentos.ObterAssinaturaAsync(
                assinatura.ProviderSubscriptionId!,
                cancellationToken);
            if (assinaturaRemota is not null &&
                IsAssinaturaRemotaCancelada(assinaturaRemota.Status))
            {
                var evento = await RegistrarWebhookAsaasAsync(
                    BuildAssinaturaCanceladaPayload(assinaturaRemota),
                    cancellationToken);
                if (await ProcessarEventoWebhookAsaasAsync(evento, cancellationToken))
                {
                    processados++;
                }
            }

            var pagamentosRemotos = await provedorPagamentos.ListarPagamentosAssinaturaAsync(
                assinatura.ProviderSubscriptionId!,
                24,
                cancellationToken);
            foreach (var pagamentoRemoto in pagamentosRemotos)
            {
                var evento = await RegistrarWebhookAsaasAsync(
                    BuildPagamentoRemotoPayload(pagamentoRemoto),
                    cancellationToken);
                if (await ProcessarEventoWebhookAsaasAsync(evento, cancellationToken))
                {
                    processados++;
                }
            }
        }
        catch (Exception exception)
        {
            dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                assinatura.ContaId,
                assinatura.Id,
                null,
                "BillingReconciliationFailed",
                exception.Message));
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return processados;
    }

    private async Task<PagamentoConta?> GetPagamentoAbertoAsync(
        Guid assinaturaId,
        MetodoPagamento metodoPagamento,
        CicloPlano ciclo,
        CancellationToken cancellationToken)
    {
        return await dbContext.PagamentosConta
            .Where(item =>
                item.AssinaturaContaId == assinaturaId &&
                item.MetodoPagamento == metodoPagamento &&
                item.Ciclo == ciclo &&
                item.InvoiceUrl != null &&
                item.InvoiceUrl != string.Empty &&
                (item.Status == StatusPagamentoConta.AguardandoPagamento ||
                    item.Status == StatusPagamentoConta.EmAnalise ||
                    item.Status == StatusPagamentoConta.Vencido))
            .OrderByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private async Task TouchBillingContaLockAsync(Guid contaId, CancellationToken cancellationToken)
    {
        var billingLock = await dbContext.BillingContaLocks.FirstOrDefaultAsync(
            item => item.ContaId == contaId,
            cancellationToken);

        if (billingLock is null)
        {
            dbContext.BillingContaLocks.Add(BillingContaLock.Create(contaId));
        }
        else
        {
            billingLock.Touch();
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task MarcarCheckoutFalhouAsync(
        Guid pagamentoId,
        string evento,
        CancellationToken cancellationToken)
    {
        var pagamento = await dbContext.PagamentosConta.FirstOrDefaultAsync(
            item => item.Id == pagamentoId,
            cancellationToken);
        if (pagamento is null)
        {
            return;
        }

        pagamento.AtualizarStatus(StatusPagamentoConta.Falhou, DateTimeOffset.UtcNow);
        dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
            pagamento.ContaId,
            pagamento.AssinaturaContaId,
            pagamento.Id,
            evento,
            "Falha ao criar checkout no provedor."));
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static CicloPlano ParseCicloPlano(string? ciclo)
    {
        if (string.IsNullOrWhiteSpace(ciclo))
        {
            return CicloPlano.Mensal;
        }

        return Enum.TryParse<CicloPlano>(ciclo, ignoreCase: true, out var parsed) &&
            Enum.IsDefined(parsed)
            ? parsed
            : throw new BillingException("Ciclo do plano invalido.");
    }

    private static PagadorPagamentoRequest ValidarPagadorCheckout(BillingPagadorRequest? pagador)
    {
        if (pagador is null)
        {
            throw new BillingException("Informe os dados do pagador para gerar o checkout.");
        }

        var tipoPessoa = NormalizarObrigatorio(pagador.TipoPessoa, "Tipo de pessoa do pagador e obrigatorio.");
        var nome = NormalizarObrigatorio(pagador.Nome, "Nome do pagador e obrigatorio.");
        var cpfCnpj = ApenasDigitos(pagador.CpfCnpj);
        var email = NormalizarOpcional(pagador.Email);
        var telefone = ApenasDigitos(pagador.Telefone);
        var cep = ApenasDigitos(pagador.Cep);
        var endereco = NormalizarOpcional(pagador.Endereco);
        var numero = NormalizarOpcional(pagador.Numero);
        var bairro = NormalizarOpcional(pagador.Bairro);
        var cidade = NormalizarOpcional(pagador.Cidade);
        var uf = NormalizarOpcional(pagador.Uf)?.ToUpperInvariant();
        var tipoPessoaNormalizado = tipoPessoa.Equals("Juridica", StringComparison.OrdinalIgnoreCase) ||
            tipoPessoa.Equals("PessoaJuridica", StringComparison.OrdinalIgnoreCase) ||
            tipoPessoa.Equals("Cnpj", StringComparison.OrdinalIgnoreCase)
                ? "Juridica"
                : "Fisica";

        if (tipoPessoaNormalizado == "Fisica" && cpfCnpj.Length != 11)
        {
            throw new BillingException("Informe um CPF valido para pessoa fisica.");
        }

        if (tipoPessoaNormalizado == "Juridica" && cpfCnpj.Length != 14)
        {
            throw new BillingException("Informe um CNPJ valido para pessoa juridica.");
        }

        if (email is not null && (!email.Contains('@', StringComparison.Ordinal) || email.Length > 256))
        {
            throw new BillingException("Informe um e-mail de cobranca valido.");
        }

        if (telefone.Length > 0 && telefone.Length is not (10 or 11))
        {
            throw new BillingException("Informe telefone com DDD para o pagador.");
        }

        if (cep.Length > 0 && cep.Length != 8)
        {
            throw new BillingException("Informe um CEP valido para o pagador.");
        }

        if (uf is not null && uf.Length != 2)
        {
            throw new BillingException("Informe a UF com 2 letras.");
        }

        return new PagadorPagamentoRequest(
            tipoPessoaNormalizado,
            nome,
            cpfCnpj,
            email,
            telefone,
            cep,
            endereco,
            numero,
            string.IsNullOrWhiteSpace(pagador.Complemento) ? null : pagador.Complemento.Trim(),
            bairro,
            cidade,
            uf);
    }

    private static string NormalizarObrigatorio(string? valor, string mensagemErro)
    {
        if (string.IsNullOrWhiteSpace(valor))
        {
            throw new BillingException(mensagemErro);
        }

        return valor.Trim();
    }

    private static string? NormalizarOpcional(string? valor)
    {
        return string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
    }

    private static string NormalizarEmailPublico(string? valor)
    {
        var email = NormalizarObrigatorio(valor, "Informe um e-mail valido.").ToLowerInvariant();
        if (!email.Contains('@', StringComparison.Ordinal) || email.Length > 256)
        {
            throw new BillingException("Informe um e-mail valido.");
        }

        return email;
    }

    private string BuildPublicPaymentToken(
        Guid contaId,
        Guid usuarioId,
        DateTimeOffset expiresAt)
    {
        var payload = JsonSerializer.Serialize(new PublicPaymentLinkTokenPayload(
            contaId,
            usuarioId,
            expiresAt));
        var protectedPayload = publicPaymentLinkProtector.Protect(payload);
        return WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(protectedPayload));
    }

    private PublicPaymentLinkTokenPayload ParsePublicPaymentToken(string token)
    {
        try
        {
            var protectedPayload = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token.Trim()));
            var payloadJson = publicPaymentLinkProtector.Unprotect(protectedPayload);
            var payload = JsonSerializer.Deserialize<PublicPaymentLinkTokenPayload>(payloadJson);

            if (payload is null ||
                payload.ContaId == Guid.Empty ||
                payload.UsuarioId == Guid.Empty ||
                payload.ExpiresAt <= DateTimeOffset.UtcNow)
            {
                throw new BillingException("Link de pagamento invalido ou expirado.");
            }

            return payload;
        }
        catch (Exception exception) when (exception is not BillingException)
        {
            throw new BillingException("Link de pagamento invalido ou expirado.");
        }
    }

    private async Task<PublicPaymentLinkAccess> ValidarLinkPagamentoPublicoAsync(
        string token,
        CancellationToken cancellationToken)
    {
        var payload = ParsePublicPaymentToken(token);
        var usuario = await dbContext.Users.FirstOrDefaultAsync(
            item => item.Id == payload.UsuarioId,
            cancellationToken);

        if (usuario is null ||
            usuario.BloqueadoAdministrativamenteAt is not null ||
            usuario.LockoutEnd > DateTimeOffset.UtcNow)
        {
            throw new BillingException("Link de pagamento invalido ou expirado.");
        }

        var membroConta = await dbContext.MembrosConta
            .Include(item => item.Conta)
            .FirstOrDefaultAsync(
                item => item.ContaId == payload.ContaId &&
                    item.UsuarioId == payload.UsuarioId &&
                    item.Status == StatusMembroConta.Ativo,
                cancellationToken);

        if (membroConta?.Conta is null || membroConta.Conta.Status != StatusConta.Ativa)
        {
            throw new BillingException("Link de pagamento invalido ou expirado.");
        }

        return new PublicPaymentLinkAccess(
            membroConta.ContaId,
            usuario.Id,
            membroConta.Conta.Nome,
            payload.ExpiresAt);
    }

    private string BuildPublicWebUrl(string path)
    {
        var baseUrl = string.IsNullOrWhiteSpace(appPublicOptions.PublicWebUrl)
            ? "https://app.emprely.com.br"
            : appPublicOptions.PublicWebUrl.Trim().TrimEnd('/');
        return $"{baseUrl}/{path.TrimStart('/')}";
    }

    private static string HashPublicPaymentToken(string token)
    {
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    }

    private static string ApenasDigitos(string? valor)
    {
        return new string((valor ?? string.Empty).Where(char.IsDigit).ToArray());
    }

    private sealed record PublicPaymentLinkTokenPayload(
        Guid ContaId,
        Guid UsuarioId,
        DateTimeOffset ExpiresAt);

    private sealed record PublicPaymentLinkAccess(
        Guid ContaId,
        Guid UsuarioId,
        string ContaNome,
        DateTimeOffset ExpiresAt);

    private static bool IsAssinaturaComAcessoPago(
        AssinaturaConta assinatura,
        DateTimeOffset agora)
    {
        return (assinatura.Status == StatusAssinaturaConta.Ativa ||
                assinatura.Status == StatusAssinaturaConta.CancelamentoAgendado) &&
            assinatura.PeriodoAtualFim.HasValue &&
            assinatura.PeriodoAtualFim > agora;
    }

    private static BillingCheckoutResponse BuildCheckoutResponse(
        PagamentoConta pagamento,
        MetodoPagamento metodoPagamento)
    {
        return new BillingCheckoutResponse(
            pagamento.Id,
            pagamento.ProviderCheckoutId ?? pagamento.ProviderPaymentId ?? pagamento.Id.ToString("N"),
            pagamento.InvoiceUrl ?? string.Empty,
            null,
            pagamento.Status.ToString(),
            pagamento.PlanoCodigo,
            pagamento.Ciclo.ToString(),
            pagamento.Valor,
            metodoPagamento.ToString());
    }

    public async Task ProcessarWebhookAsaasAsync(
        JsonElement payload,
        CancellationToken cancellationToken)
    {
        var evento = await RegistrarWebhookAsaasAsync(payload, cancellationToken);
        await ProcessarEventoWebhookAsaasAsync(evento, cancellationToken);
    }

    public async Task<EventoWebhookPagamento> RegistrarWebhookAsaasAsync(
        JsonElement payload,
        CancellationToken cancellationToken)
    {
        var eventName = GetString(payload, "event") ?? "UNKNOWN";
        var payment = payload.TryGetProperty("payment", out var paymentElement)
            ? paymentElement
            : payload;
        var providerPaymentId = GetString(payment, "id");
        var providerSubscriptionId = GetString(payment, "subscription") ??
            GetString(payload, "subscription") ??
            GetString(payload, "id");
        var providerResourceId = providerPaymentId ?? providerSubscriptionId;
        var providerEventId = GetString(payload, "id") ??
            $"{eventName}:{providerPaymentId ?? providerSubscriptionId ?? Guid.NewGuid().ToString("N")}";
        var payloadJson = payload.GetRawText();

        var evento = await dbContext.EventosWebhookPagamento.FirstOrDefaultAsync(
            item => item.Provedor == ProvedorPagamento.Asaas && item.ProviderEventId == providerEventId,
            cancellationToken);

        if (evento?.StatusProcessamento == StatusProcessamentoWebhook.Processado ||
            evento?.StatusProcessamento == StatusProcessamentoWebhook.Ignorado)
        {
            return evento;
        }

        if (evento is null)
        {
            evento = EventoWebhookPagamento.Create(
                ProvedorPagamento.Asaas,
                providerEventId,
                eventName,
                providerResourceId,
                payloadJson);
            dbContext.EventosWebhookPagamento.Add(evento);
            try
            {
                await dbContext.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException)
            {
                evento = await dbContext.EventosWebhookPagamento.FirstAsync(
                    item => item.Provedor == ProvedorPagamento.Asaas && item.ProviderEventId == providerEventId,
                    cancellationToken);
            }
        }
        else
        {
            evento.AtualizarRecebido(eventName, providerResourceId, payloadJson);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return evento;
    }

    public async Task<int> ProcessarEventosWebhookPendentesAsync(
        int limite,
        CancellationToken cancellationToken)
    {
        var agora = DateTimeOffset.UtcNow;
        var eventos = await dbContext.EventosWebhookPagamento
            .Where(item => item.Provedor == ProvedorPagamento.Asaas &&
                (item.StatusProcessamento == StatusProcessamentoWebhook.Recebido ||
                    (item.StatusProcessamento == StatusProcessamentoWebhook.Erro &&
                        (item.ProximaTentativaAt == null || item.ProximaTentativaAt <= agora))))
            .OrderBy(item => item.CreatedAt)
            .Take(limite)
            .ToListAsync(cancellationToken);
        var processados = 0;

        foreach (var evento in eventos)
        {
            evento.MarcarEmProcessamento(agora);
            await dbContext.SaveChangesAsync(cancellationToken);

            if (await ProcessarEventoWebhookAsaasAsync(evento, cancellationToken))
            {
                processados++;
            }
        }

        return processados;
    }

    public async Task<bool> ReprocessarWebhookContaAsync(
        Guid contaId,
        Guid eventoId,
        CancellationToken cancellationToken)
    {
        var evento = await dbContext.EventosWebhookPagamento.FirstOrDefaultAsync(
            item => item.Id == eventoId &&
                (item.ContaId == contaId ||
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
                        assinatura.ContaId == contaId && assinatura.ProviderSubscriptionId == item.ProviderResourceId)),
            cancellationToken) ?? throw new BillingException("Evento de webhook nao encontrado para a conta.");

        if (evento.StatusProcessamento is StatusProcessamentoWebhook.Processado or StatusProcessamentoWebhook.Ignorado)
        {
            return false;
        }

        evento.MarcarEmProcessamento(DateTimeOffset.UtcNow);
        await dbContext.SaveChangesAsync(cancellationToken);
        return await ProcessarEventoWebhookAsaasAsync(evento, cancellationToken);
    }

    public async Task<bool> ProcessarEventoWebhookAsaasAsync(
        EventoWebhookPagamento evento,
        CancellationToken cancellationToken)
    {
        if (evento.StatusProcessamento == StatusProcessamentoWebhook.Processado ||
            evento.StatusProcessamento == StatusProcessamentoWebhook.Ignorado)
        {
            return false;
        }

        using var documento = JsonDocument.Parse(evento.PayloadJson);
        var payload = documento.RootElement;
        var eventName = GetString(payload, "event") ?? evento.TipoEvento;
        var payment = payload.TryGetProperty("payment", out var paymentElement)
            ? paymentElement
            : payload;
        var providerPaymentId = GetString(payment, "id");
        var providerSubscriptionId = GetString(payment, "subscription") ??
            GetString(payload, "subscription") ??
            (IsEventoAssinaturaCancelada(eventName) ? GetString(payload, "id") : null);

        try
        {
            if (!IsEventoAsaasConhecido(eventName))
            {
                evento.MarcarIgnorado($"Evento Asaas nao mapeado: {eventName}.");
                await dbContext.SaveChangesAsync(cancellationToken);
                return true;
            }

            if (IsEventoAssinaturaCancelada(eventName) && !string.IsNullOrWhiteSpace(providerSubscriptionId))
            {
                var assinaturaCancelada = await dbContext.AssinaturasConta.FirstOrDefaultAsync(
                    item => item.ProviderSubscriptionId == providerSubscriptionId,
                    cancellationToken);
                if (assinaturaCancelada is not null)
                {
                    if (assinaturaCancelada.Status != StatusAssinaturaConta.CancelamentoAgendado ||
                        !assinaturaCancelada.IsPeriodoVigente(DateTimeOffset.UtcNow))
                    {
                        assinaturaCancelada.CancelarAgora(eventName);
                    }

                    dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                        assinaturaCancelada.ContaId,
                        assinaturaCancelada.Id,
                        null,
                        "SubscriptionCanceled",
                        eventName));
                    evento.MarcarProcessado(assinaturaCancelada.ContaId, null, assinaturaCancelada.Id);
                    await dbContext.SaveChangesAsync(cancellationToken);
                    return true;
                }
            }

            var pagamento = await FindOrCreatePagamentoWebhookAsync(
                payment,
                providerPaymentId,
                providerSubscriptionId,
                cancellationToken);
            if (pagamento is null)
            {
                evento.MarcarErro(
                    "Pagamento local nao encontrado para webhook Asaas.",
                    CalcularProximaTentativaWebhook(evento.TentativasProcessamento));
                await dbContext.SaveChangesAsync(cancellationToken);
                return false;
            }

            var assinatura = await dbContext.AssinaturasConta.FirstOrDefaultAsync(
                item => item.Id == pagamento.AssinaturaContaId,
                cancellationToken);
            var conta = await dbContext.Contas.FirstOrDefaultAsync(
                item => item.Id == pagamento.ContaId,
                cancellationToken);

            if (assinatura is null || conta is null)
            {
                evento.MarcarErro(
                    "Assinatura ou conta local nao encontrada.",
                    CalcularProximaTentativaWebhook(evento.TentativasProcessamento));
                await dbContext.SaveChangesAsync(cancellationToken);
                return false;
            }

            var status = MapStatusPagamento(eventName, payment);
            var agora = DateTimeOffset.UtcNow;
            var pagamentoJaLiberado =
                pagamento.Status == StatusPagamentoConta.Confirmado ||
                pagamento.Status == StatusPagamentoConta.Recebido ||
                pagamento.Status == StatusPagamentoConta.ReembolsadoParcial;
            pagamento.VincularProvider(
                providerPaymentId,
                providerPaymentId,
                providerSubscriptionId,
                GetString(payment, "externalReference"),
                GetInvoiceUrl(payment),
                GetDateOnly(payment, "dueDate"));
            if (status == StatusPagamentoConta.ReembolsadoParcial)
            {
                var valorReembolsoParcial = GetValorReembolsoWebhook(payload, payment);
                if (!valorReembolsoParcial.HasValue || valorReembolsoParcial <= 0m)
                {
                    evento.MarcarErro(
                        "Webhook de reembolso parcial sem valor reembolsado.",
                        CalcularProximaTentativaWebhook(evento.TentativasProcessamento));
                    await dbContext.SaveChangesAsync(cancellationToken);
                    return false;
                }

                if (valorReembolsoParcial > pagamento.GetSaldoReembolsavel())
                {
                    evento.MarcarErro(
                        "Webhook de reembolso parcial maior que o saldo reembolsavel.",
                        CalcularProximaTentativaWebhook(evento.TentativasProcessamento));
                    await dbContext.SaveChangesAsync(cancellationToken);
                    return false;
                }

                pagamento.RegistrarReembolso(valorReembolsoParcial.Value, agora);
            }
            else if (status == StatusPagamentoConta.Reembolsado)
            {
                var saldoReembolsavel = pagamento.GetSaldoReembolsavel();
                if (saldoReembolsavel > 0m)
                {
                    pagamento.RegistrarReembolso(saldoReembolsavel, agora);
                }
                else
                {
                    pagamento.AtualizarStatus(status, agora);
                }
            }
            else
            {
                pagamento.AtualizarStatus(status, agora);
            }

            if (status == StatusPagamentoConta.Confirmado || status == StatusPagamentoConta.Recebido)
            {
                var inicioPeriodo = GetDateTimeOffset(payment, "paymentDate") ??
                    GetDateTimeOffset(payment, "confirmedDate") ??
                    GetDateTimeOffset(payment, "clientPaymentDate") ??
                    agora;
                var assinaturaVigenteAnterior = await dbContext.AssinaturasConta
                    .Where(item => item.ContaId == conta.Id &&
                        item.Id != assinatura.Id &&
                        (item.Status == StatusAssinaturaConta.Ativa ||
                            item.Status == StatusAssinaturaConta.CancelamentoAgendado) &&
                        item.PeriodoAtualFim.HasValue &&
                        item.PeriodoAtualFim > agora)
                    .OrderByDescending(item => item.PeriodoAtualFim)
                    .FirstOrDefaultAsync(cancellationToken);
                if (assinaturaVigenteAnterior?.PeriodoAtualFim is not null &&
                    assinaturaVigenteAnterior.PeriodoAtualFim > inicioPeriodo)
                {
                    inicioPeriodo = assinaturaVigenteAnterior.PeriodoAtualFim.Value;
                    assinaturaVigenteAnterior.AgendarCancelamento("Troca de ciclo confirmada para o proximo periodo.");
                }

                assinatura.Ativar(pagamento.Id, inicioPeriodo, pagamento.Ciclo);
                conta.ActivatePlanoFundador();
                dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                    conta.Id,
                    assinatura.Id,
                    pagamento.Id,
                    status == StatusPagamentoConta.Recebido ? "PaymentReceived" : "PaymentConfirmed",
                    eventName));
                if (!pagamentoJaLiberado)
                {
                    await EnviarEmailPlanoAtivadoAsync(conta.Id, cancellationToken);
                }
            }
            else if (status == StatusPagamentoConta.EmAnalise)
            {
                assinatura.MarcarEmAnalise();
            }
            else if (status == StatusPagamentoConta.Vencido || status == StatusPagamentoConta.Falhou)
            {
                if (!pagamento.IsPago() &&
                    !pagamento.IsReembolsado() &&
                    IsForaToleranciaInadimplencia(pagamento, assinatura, agora))
                {
                    assinatura.MarcarInadimplente();
                    await EnviarEmailBillingAsync(
                        conta.Id,
                        TipoEmailTransacional.BillingBloqueioInadimplencia,
                        "Acesso pago bloqueado por inadimplencia",
                        pagamento.InvoiceUrl is null
                            ? "A cobranca venceu e a tolerancia de pagamento terminou."
                            : $"A cobranca venceu e a tolerancia de pagamento terminou. Regularize em {pagamento.InvoiceUrl}",
                        cancellationToken);
                }
                else if (!pagamento.IsPago() && !pagamento.IsReembolsado())
                {
                    await EnviarEmailBillingAsync(
                        conta.Id,
                        TipoEmailTransacional.BillingPagamentoPendente,
                        "Pagamento pendente no Plano Fundador",
                        pagamento.InvoiceUrl is null
                            ? "Existe uma cobranca pendente no seu Plano Fundador."
                            : $"Existe uma cobranca pendente no seu Plano Fundador: {pagamento.InvoiceUrl}",
                        cancellationToken);
                }
            }
            else if (status == StatusPagamentoConta.ReembolsadoParcial)
            {
                dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                    conta.Id,
                    assinatura.Id,
                    pagamento.Id,
                    pagamento.IsReembolsado() ? "PaymentRefundedByWebhook" : "PaymentPartiallyRefundedByWebhook",
                    eventName));

                if (pagamento.IsReembolsado())
                {
                    if (!string.IsNullOrWhiteSpace(assinatura.ProviderSubscriptionId))
                    {
                        try
                        {
                            await provedorPagamentos.CancelarAssinaturaAsync(assinatura.ProviderSubscriptionId, cancellationToken);
                        }
                        catch
                        {
                            dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                                conta.Id,
                                assinatura.Id,
                                pagamento.Id,
                                "PartialRefundAccumulatedCancelFailed",
                                "Falha ao cancelar recorrencia remota apos reembolso parcial acumulado integral."));
                        }
                    }

                    assinatura.Suspender("Pagamento integralmente reembolsado no Asaas.");
                    await EnviarEmailBillingAsync(
                        conta.Id,
                        TipoEmailTransacional.BillingReembolsoIntegral,
                        "Reembolso integral registrado",
                        "O pagamento foi integralmente reembolsado e o acesso pago foi suspenso.",
                        cancellationToken);
                }
                else
                {
                    await EnviarEmailBillingAsync(
                        conta.Id,
                        TipoEmailTransacional.BillingReembolsoParcial,
                        "Reembolso parcial registrado",
                        "Um reembolso parcial foi registrado. Seu acesso pago continua se houver periodo vigente.",
                        cancellationToken);
                }
            }
            else if (status == StatusPagamentoConta.Reembolsado)
            {
                if (pagamento.IsReembolsado() && !string.IsNullOrWhiteSpace(assinatura.ProviderSubscriptionId))
                {
                    try
                    {
                        await provedorPagamentos.CancelarAssinaturaAsync(assinatura.ProviderSubscriptionId, cancellationToken);
                    }
                    catch
                    {
                        dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
                            conta.Id,
                            assinatura.Id,
                            pagamento.Id,
                            "RefundWebhookCancelFailed",
                            "Falha ao cancelar recorrencia remota apos webhook de reembolso."));
                    }
                }

                if (pagamento.IsReembolsado())
                {
                    assinatura.Suspender("Pagamento reembolsado no Asaas.");
                    await EnviarEmailBillingAsync(
                        conta.Id,
                        TipoEmailTransacional.BillingReembolsoIntegral,
                        "Reembolso integral registrado",
                        "O pagamento foi reembolsado no Asaas e o acesso pago foi suspenso.",
                        cancellationToken);
                }
            }

            evento.MarcarProcessado(conta.Id, pagamento.Id, assinatura.Id);
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch (Exception exception)
        {
            evento.MarcarErro(exception.Message, CalcularProximaTentativaWebhook(evento.TentativasProcessamento));
            await dbContext.SaveChangesAsync(cancellationToken);
            return false;
        }
    }

    private async Task<PagamentoConta?> FindOrCreatePagamentoWebhookAsync(
        JsonElement payment,
        string? providerPaymentId,
        string? providerSubscriptionId,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(providerPaymentId))
        {
            var pagamento = await dbContext.PagamentosConta.FirstOrDefaultAsync(
                item => item.ProviderPaymentId == providerPaymentId || item.ProviderCheckoutId == providerPaymentId,
                cancellationToken);
            if (pagamento is not null)
            {
                return pagamento;
            }
        }

        var externalReference = GetString(payment, "externalReference");
        if (!string.IsNullOrWhiteSpace(externalReference))
        {
            var partes = externalReference.Split(':');
            if (partes.Length == 3 && Guid.TryParse(partes[2], out var pagamentoId))
            {
                var pagamentoReferencia = await dbContext.PagamentosConta.FirstOrDefaultAsync(
                    item => item.Id == pagamentoId,
                    cancellationToken);
                if (pagamentoReferencia is not null &&
                    (string.IsNullOrWhiteSpace(providerPaymentId) ||
                        string.IsNullOrWhiteSpace(pagamentoReferencia.ProviderPaymentId) ||
                        string.Equals(pagamentoReferencia.ProviderPaymentId, providerPaymentId, StringComparison.Ordinal)))
                {
                    return pagamentoReferencia;
                }
            }
        }

        if (string.IsNullOrWhiteSpace(providerSubscriptionId))
        {
            return null;
        }

        var assinatura = await dbContext.AssinaturasConta
            .Where(item => item.ProviderSubscriptionId == providerSubscriptionId)
            .OrderByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (assinatura is null)
        {
            return null;
        }

        var pagamentoRecorrente = PagamentoConta.Create(
            assinatura.ContaId,
            assinatura.Id,
            assinatura.PlanoCodigo,
            ProvedorPagamento.Asaas,
            assinatura.MetodoPagamento,
            GetDecimal(payment, "value") ?? assinatura.Valor);
        pagamentoRecorrente.DefinirCiclo(assinatura.Ciclo);
        pagamentoRecorrente.VincularProvider(
            providerPaymentId,
            providerPaymentId,
            providerSubscriptionId,
            externalReference,
            GetInvoiceUrl(payment),
            GetDateOnly(payment, "dueDate"));
        dbContext.PagamentosConta.Add(pagamentoRecorrente);
        dbContext.HistoricosAssinaturaConta.Add(HistoricoAssinaturaConta.Create(
            assinatura.ContaId,
            assinatura.Id,
            pagamentoRecorrente.Id,
            "RecurringPaymentCreated",
            providerPaymentId));

        return pagamentoRecorrente;
    }

    private static StatusPagamentoConta MapStatusPagamento(string eventName, JsonElement payment)
    {
        var status = GetString(payment, "status");

        if (string.Equals(eventName, "PAYMENT_PARTIALLY_REFUNDED", StringComparison.OrdinalIgnoreCase))
        {
            return StatusPagamentoConta.ReembolsadoParcial;
        }

        if (string.Equals(eventName, "PAYMENT_REFUNDED", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(status, "REFUNDED", StringComparison.OrdinalIgnoreCase))
        {
            return StatusPagamentoConta.Reembolsado;
        }

        if (eventName.Contains("OVERDUE", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(status, "OVERDUE", StringComparison.OrdinalIgnoreCase))
        {
            return StatusPagamentoConta.Vencido;
        }

        if (eventName.Contains("AWAITING_RISK_ANALYSIS", StringComparison.OrdinalIgnoreCase) ||
            eventName.Contains("RISK_ANALYSIS", StringComparison.OrdinalIgnoreCase))
        {
            return StatusPagamentoConta.EmAnalise;
        }

        if (eventName.Contains("CONFIRMED", StringComparison.OrdinalIgnoreCase))
        {
            return StatusPagamentoConta.Confirmado;
        }

        if (eventName.Contains("RECEIVED", StringComparison.OrdinalIgnoreCase))
        {
            return StatusPagamentoConta.Recebido;
        }

        if (eventName.Contains("DELETED", StringComparison.OrdinalIgnoreCase) ||
            eventName.Contains("CANCELED", StringComparison.OrdinalIgnoreCase))
        {
            return StatusPagamentoConta.Cancelado;
        }

        return StatusPagamentoConta.AguardandoPagamento;
    }

    private static bool IsEventoAsaasConhecido(string eventName)
    {
        return string.Equals(eventName, "PAYMENT_CREATED", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_UPDATED", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_AWAITING_RISK_ANALYSIS", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_APPROVED_BY_RISK_ANALYSIS", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_REPROVED_BY_RISK_ANALYSIS", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_CONFIRMED", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_RECEIVED", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_OVERDUE", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_DELETED", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_CANCELED", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_REFUNDED", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(eventName, "PAYMENT_PARTIALLY_REFUNDED", StringComparison.OrdinalIgnoreCase) ||
            IsEventoAssinaturaCancelada(eventName);
    }

    private static bool IsAssinaturaRemotaCancelada(string status)
    {
        return status.Contains("DELETED", StringComparison.OrdinalIgnoreCase) ||
            status.Contains("CANCELED", StringComparison.OrdinalIgnoreCase) ||
            status.Contains("CANCELLED", StringComparison.OrdinalIgnoreCase) ||
            status.Contains("INACTIVE", StringComparison.OrdinalIgnoreCase) ||
            status.Contains("INACTIVATED", StringComparison.OrdinalIgnoreCase);
    }

    private static JsonElement BuildAssinaturaCanceladaPayload(AssinaturaRemotaResultado assinatura)
    {
        var payload = new
        {
            id = $"reconcile:subscription:{assinatura.ProviderSubscriptionId}:{assinatura.Status}",
            @event = "SUBSCRIPTION_CANCELED",
            subscription = assinatura.ProviderSubscriptionId,
            status = assinatura.Status,
        };

        return JsonSerializer.SerializeToElement(payload);
    }

    private static JsonElement BuildPagamentoRemotoPayload(PagamentoRemotoResultado pagamento)
    {
        var eventName = MapEventoPagamentoRemoto(pagamento);
        var payload = new
        {
            id = $"reconcile:payment:{pagamento.ProviderPaymentId}:{eventName}:{(pagamento.ValorReembolsado ?? 0m):0.00}",
            @event = eventName,
            payment = new
            {
                id = pagamento.ProviderPaymentId,
                subscription = pagamento.ProviderSubscriptionId,
                externalReference = pagamento.ExternalReference,
                status = pagamento.Status,
                value = pagamento.Valor,
                refundedValue = pagamento.ValorReembolsado,
                invoiceUrl = pagamento.InvoiceUrl,
                dueDate = pagamento.DueDate?.ToString("yyyy-MM-dd"),
            },
        };

        return JsonSerializer.SerializeToElement(payload);
    }

    private static string MapEventoPagamentoRemoto(PagamentoRemotoResultado pagamento)
    {
        var valorReembolsado = pagamento.ValorReembolsado ?? 0m;
        if (pagamento.Status.Equals("REFUNDED", StringComparison.OrdinalIgnoreCase) ||
            (pagamento.Valor > 0m && valorReembolsado >= pagamento.Valor))
        {
            return "PAYMENT_REFUNDED";
        }

        if (valorReembolsado > 0m)
        {
            return "PAYMENT_PARTIALLY_REFUNDED";
        }

        if (pagamento.Status.Equals("RECEIVED", StringComparison.OrdinalIgnoreCase))
        {
            return "PAYMENT_RECEIVED";
        }

        if (pagamento.Status.Equals("CONFIRMED", StringComparison.OrdinalIgnoreCase))
        {
            return "PAYMENT_CONFIRMED";
        }

        if (pagamento.Status.Equals("OVERDUE", StringComparison.OrdinalIgnoreCase))
        {
            return "PAYMENT_OVERDUE";
        }

        if (pagamento.Status.Contains("RISK_ANALYSIS", StringComparison.OrdinalIgnoreCase))
        {
            return "PAYMENT_AWAITING_RISK_ANALYSIS";
        }

        if (pagamento.Status.Equals("DELETED", StringComparison.OrdinalIgnoreCase) ||
            pagamento.Status.Equals("CANCELED", StringComparison.OrdinalIgnoreCase) ||
            pagamento.Status.Equals("CANCELLED", StringComparison.OrdinalIgnoreCase))
        {
            return "PAYMENT_CANCELED";
        }

        return "PAYMENT_UPDATED";
    }

    private static decimal? GetValorReembolsoWebhook(JsonElement payload, JsonElement payment)
    {
        return GetDecimal(payment, "refundedValue") ??
            GetDecimal(payment, "refundValue") ??
            GetDecimal(payload, "refundedValue") ??
            GetDecimal(payload, "refundValue") ??
            GetDecimal(payload, "value");
    }

    private static bool IsForaToleranciaInadimplencia(
        PagamentoConta pagamento,
        AssinaturaConta assinatura,
        DateTimeOffset agora)
    {
        if (pagamento.DueDate.HasValue)
        {
            var vencimento = new DateTimeOffset(
                pagamento.DueDate.Value.ToDateTime(TimeOnly.MinValue),
                TimeSpan.Zero);
            return vencimento.AddDays(InadimplenciaToleranciaDias) <= agora;
        }

        return assinatura.PeriodoAtualFim.HasValue &&
            assinatura.PeriodoAtualFim.Value.AddDays(InadimplenciaToleranciaDias) <= agora;
    }

    private static string? GetString(JsonElement element, string propertyName)
    {
        if (element.ValueKind != JsonValueKind.Object ||
            !element.TryGetProperty(propertyName, out var property) ||
            property.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
        {
            return null;
        }

        return property.ToString();
    }

    private static decimal? GetDecimal(JsonElement element, string propertyName)
    {
        if (element.ValueKind != JsonValueKind.Object ||
            !element.TryGetProperty(propertyName, out var property))
        {
            return null;
        }

        if (property.ValueKind == JsonValueKind.Number && property.TryGetDecimal(out var value))
        {
            return value;
        }

        return decimal.TryParse(property.ToString(), out var parsed) ? parsed : null;
    }

    private static DateOnly? GetDateOnly(JsonElement element, string propertyName)
    {
        var value = GetString(element, propertyName);
        return DateOnly.TryParse(value, out var parsed) ? parsed : null;
    }

    private static DateTimeOffset? GetDateTimeOffset(JsonElement element, string propertyName)
    {
        var value = GetString(element, propertyName);
        if (DateTimeOffset.TryParse(value, out var parsed))
        {
            return parsed;
        }

        if (DateOnly.TryParse(value, out var dateOnly))
        {
            return new DateTimeOffset(dateOnly.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
        }

        return null;
    }

    private static string? GetInvoiceUrl(JsonElement payment)
    {
        return GetString(payment, "invoiceUrl") ??
            GetString(payment, "bankSlipUrl") ??
            GetString(payment, "paymentLink");
    }

    private static bool IsEventoAssinaturaCancelada(string eventName)
    {
        return eventName.Contains("SUBSCRIPTION", StringComparison.OrdinalIgnoreCase) &&
            (eventName.Contains("DELETED", StringComparison.OrdinalIgnoreCase) ||
                eventName.Contains("CANCELED", StringComparison.OrdinalIgnoreCase) ||
                eventName.Contains("INACTIVATED", StringComparison.OrdinalIgnoreCase));
    }

    private static DateTimeOffset CalcularProximaTentativaWebhook(int tentativas)
    {
        var minutos = tentativas switch
        {
            <= 1 => 1,
            2 => 5,
            3 => 15,
            4 => 60,
            _ => 240,
        };

        return DateTimeOffset.UtcNow.AddMinutes(minutos);
    }

    private async Task EnviarEmailPlanoAtivadoAsync(
        Guid contaId,
        CancellationToken cancellationToken)
    {
        var owner = await (
            from membro in dbContext.MembrosConta
            join usuario in dbContext.Users on membro.UsuarioId equals usuario.Id
            where membro.ContaId == contaId && membro.Papel == PapelMembroConta.Owner
            select new
            {
                UsuarioId = usuario.Id,
                usuario.Email,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (owner?.Email is null)
        {
            return;
        }

        await emailTransacionalService.EnviarAsync(
            EmailTransacionalTemplateBuilder.Build(
                contaId,
                owner.UsuarioId,
                TipoEmailTransacional.PlanoFundadorAtivado,
                owner.Email,
                "Plano Fundador ativado no Emprely",
                "Seu pagamento foi confirmado e o Plano Fundador foi ativado.",
                appPublicOptions.PublicWebUrl),
            cancellationToken);
    }

    private async Task EnviarEmailBillingAsync(
        Guid contaId,
        TipoEmailTransacional tipo,
        string assunto,
        string texto,
        CancellationToken cancellationToken)
    {
        var owner = await (
            from membro in dbContext.MembrosConta
            join usuario in dbContext.Users on membro.UsuarioId equals usuario.Id
            where membro.ContaId == contaId && membro.Papel == PapelMembroConta.Owner
            select new
            {
                UsuarioId = usuario.Id,
                usuario.Email,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (owner?.Email is null)
        {
            return;
        }

        await emailTransacionalService.EnviarAsync(
            EmailTransacionalTemplateBuilder.Build(
                contaId,
                owner.UsuarioId,
                tipo,
                owner.Email,
                assunto,
                texto,
                appPublicOptions.PublicWebUrl),
            cancellationToken);
    }
}

public class BillingException : Exception
{
    public BillingException(string message)
        : base(message)
    {
    }
}

public sealed class BillingConflictException : BillingException
{
    public BillingConflictException(string message)
        : base(message)
    {
    }
}
