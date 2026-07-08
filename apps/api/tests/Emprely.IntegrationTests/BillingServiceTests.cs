using System.Text.Json;
using Emprely.Api.Servicos;
using Emprely.Application.Comunicacoes;
using Emprely.Application.Pagamentos;
using Emprely.Contracts.Billing;
using Emprely.Domain.Comunicacoes;
using Emprely.Domain.Contas;
using Emprely.Domain.Pagamentos;
using Emprely.Infrastructure.Comunicacoes;
using Emprely.Infrastructure.Identity;
using Emprely.Infrastructure.Pagamentos;
using Emprely.Infrastructure.Persistence;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Options;

namespace Emprely.IntegrationTests;

public sealed class BillingServiceTests
{
    private const string PlanoFundadorCodigo = "fundador";
    private const decimal PlanoFundadorPrecoMensal = 19.99m;
    private static readonly BillingPagadorRequest PagadorPadrao = new(
        "Fisica",
        "Cliente Teste",
        "123.456.789-01",
        "cliente@emprely.test",
        "(35) 99999-9999",
        "37100-000",
        "Rua Teste",
        "100",
        null,
        "Centro",
        "Varginha",
        "MG");

    [Fact]
    public async Task Entitlements_NaoLiberamFundadorComAssinaturaSuspensa()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta suspensa");
        conta.ActivatePlanoFundador();
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.Ativar(Guid.NewGuid(), DateTimeOffset.UtcNow);
        assinatura.Suspender("Teste");
        dbContext.AssinaturasConta.Add(assinatura);
        await dbContext.SaveChangesAsync();

        var entitlements = await new BillingEntitlementsService(dbContext)
            .GetEntitlementsAsync(conta, CancellationToken.None);

        Assert.False(entitlements.CanGenerateProposta);
        Assert.False(entitlements.CanExportProposta);
        Assert.False(entitlements.CanRemoveWatermark);
    }

    [Fact]
    public async Task CriarCheckout_ReusaPagamentoAbertoSemCriarNovaCobranca()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta pagamento aberto");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        var pagamento = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamento.VincularProvider("pay-open", "pay-open", "sub-open", "ref", "https://asaas.test/open", DateOnly.FromDateTime(DateTime.UtcNow));
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.Add(pagamento);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        var response = await service.CriarCheckoutAsync(
            conta.Id,
            Guid.NewGuid(),
            new CreateBillingCheckoutRequest(PlanoFundadorCodigo, MetodoPagamento.Pix.ToString()),
            CancellationToken.None);

        Assert.Equal(pagamento.Id, response.CheckoutId);
        Assert.Equal("https://asaas.test/open", response.CheckoutUrl);
        Assert.Equal(0, provedor.CheckoutsCriados);
    }

    [Fact]
    public async Task CriarCheckout_BloqueiaNovaCobrancaQuandoAssinaturaEstaAtiva()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta ativa");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.Ativar(Guid.NewGuid(), DateTimeOffset.UtcNow);
        dbContext.AssinaturasConta.Add(assinatura);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        await Assert.ThrowsAsync<BillingConflictException>(() => service.CriarCheckoutAsync(
            conta.Id,
            Guid.NewGuid(),
            new CreateBillingCheckoutRequest(PlanoFundadorCodigo, MetodoPagamento.Pix.ToString()),
            CancellationToken.None));
        Assert.Equal(0, provedor.CheckoutsCriados);
    }

    [Fact]
    public async Task CriarCheckout_BloqueiaNovaCobrancaSemDadosDoPagador()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta sem pagador");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        await Assert.ThrowsAsync<BillingException>(() => service.CriarCheckoutAsync(
            conta.Id,
            Guid.NewGuid(),
            new CreateBillingCheckoutRequest(PlanoFundadorCodigo, MetodoPagamento.Pix.ToString()),
            CancellationToken.None));
        Assert.Equal(0, provedor.CheckoutsCriados);
    }

    [Fact]
    public async Task WebhookRecorrente_SemExternalReference_CriaPagamentoPorAssinatura()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta recorrente");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.CartaoCredito,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-1", "sub-1");
        dbContext.AssinaturasConta.Add(assinatura);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());
        using var payload = JsonDocument.Parse("""
        {
          "id": "evt-rec-1",
          "event": "PAYMENT_CONFIRMED",
          "payment": {
            "id": "pay-rec-1",
            "subscription": "sub-1",
            "status": "CONFIRMED",
            "value": 19.99,
            "invoiceUrl": "https://asaas.test/pay-rec-1"
          }
        }
        """);

        await service.ProcessarWebhookAsaasAsync(payload.RootElement, CancellationToken.None);

        var pagamento = await dbContext.PagamentosConta.SingleAsync(item => item.ProviderPaymentId == "pay-rec-1");
        var assinaturaAtualizada = await dbContext.AssinaturasConta.SingleAsync(item => item.Id == assinatura.Id);
        var evento = await dbContext.EventosWebhookPagamento.SingleAsync(item => item.ProviderEventId == "evt-rec-1");

        Assert.Equal(StatusPagamentoConta.Confirmado, pagamento.Status);
        Assert.Equal(StatusAssinaturaConta.Ativa, assinaturaAtualizada.Status);
        Assert.Equal(StatusProcessamentoWebhook.Processado, evento.StatusProcessamento);
    }

    [Fact]
    public async Task WebhookComErroAnterior_EReprocessado()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta retry webhook");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-retry", "sub-retry");
        var pagamento = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamento.VincularProvider("pay-retry", "pay-retry", "sub-retry", "ref", "https://asaas.test/retry", DateOnly.FromDateTime(DateTime.UtcNow));
        var evento = EventoWebhookPagamento.Create(
            ProvedorPagamento.Asaas,
            "evt-retry",
            "PAYMENT_CONFIRMED",
            "pay-retry",
            "{}");
        evento.MarcarErro("Falha anterior");
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.Add(pagamento);
        dbContext.EventosWebhookPagamento.Add(evento);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());
        using var payload = JsonDocument.Parse("""
        {
          "id": "evt-retry",
          "event": "PAYMENT_CONFIRMED",
          "payment": {
            "id": "pay-retry",
            "subscription": "sub-retry",
            "status": "CONFIRMED",
            "value": 19.99,
            "invoiceUrl": "https://asaas.test/retry"
          }
        }
        """);

        await service.ProcessarWebhookAsaasAsync(payload.RootElement, CancellationToken.None);

        Assert.Equal(StatusPagamentoConta.Confirmado, pagamento.Status);
        Assert.Equal(StatusProcessamentoWebhook.Processado, evento.StatusProcessamento);
        Assert.Null(evento.ErroProcessamento);
    }

    [Fact]
    public async Task ReembolsarUltimoPagamento_CancelaRecorrenciaRemotaESuspendeAssinatura()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta reembolso");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-refund", "sub-refund");
        var pagamento = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamento.VincularProvider("pay-refund", "pay-refund", "sub-refund", "ref", "https://asaas.test/refund", DateOnly.FromDateTime(DateTime.UtcNow));
        pagamento.AtualizarStatus(StatusPagamentoConta.Recebido, DateTimeOffset.UtcNow);
        assinatura.Ativar(pagamento.Id, DateTimeOffset.UtcNow);
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.Add(pagamento);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        await service.ReembolsarUltimoPagamentoAsync(conta.Id, "Teste", CancellationToken.None);

        Assert.Contains("pay-refund", provedor.PagamentosReembolsados);
        Assert.Contains("sub-refund", provedor.AssinaturasCanceladas);
        Assert.Equal(StatusPagamentoConta.Reembolsado, pagamento.Status);
        Assert.Equal(StatusAssinaturaConta.Suspensa, assinatura.Status);
    }

    [Fact]
    public async Task CancelarAsync_BloqueiaAssinaturaSemPagamentoVigente()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta sem pagamento");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-cancel", "sub-cancel");
        dbContext.AssinaturasConta.Add(assinatura);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());

        await Assert.ThrowsAsync<BillingConflictException>(() =>
            service.CancelarAsync(conta.Id, "Teste", CancellationToken.None));
        Assert.Equal(StatusAssinaturaConta.AguardandoPagamento, assinatura.Status);
    }

    [Fact]
    public async Task RestaurarAdminAsync_BloqueiaAssinaturaSemPeriodoVigente()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta restauracao invalida");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.Suspender("Teste");
        dbContext.AssinaturasConta.Add(assinatura);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());

        await Assert.ThrowsAsync<BillingConflictException>(() =>
            service.RestaurarAdminAsync(conta.Id, "Teste", CancellationToken.None));
        Assert.Equal(StatusAssinaturaConta.Suspensa, assinatura.Status);
    }

    [Fact]
    public async Task WebhookAtrasado_NaoRebaixaPagamentoRecebido()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta evento atrasado");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-late", "sub-late");
        var pagamento = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamento.VincularProvider("pay-late", "pay-late", "sub-late", "ref", "https://asaas.test/late", DateOnly.FromDateTime(DateTime.UtcNow));
        pagamento.AtualizarStatus(StatusPagamentoConta.Recebido, DateTimeOffset.UtcNow);
        assinatura.Ativar(pagamento.Id, DateTimeOffset.UtcNow);
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.Add(pagamento);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());
        using var payload = JsonDocument.Parse("""
        {
          "id": "evt-late-overdue",
          "event": "PAYMENT_OVERDUE",
          "payment": {
            "id": "pay-late",
            "subscription": "sub-late",
            "status": "OVERDUE",
            "value": 19.99
          }
        }
        """);

        await service.ProcessarWebhookAsaasAsync(payload.RootElement, CancellationToken.None);

        Assert.Equal(StatusPagamentoConta.Recebido, pagamento.Status);
        Assert.Equal(StatusAssinaturaConta.Ativa, assinatura.Status);
    }

    [Fact]
    public async Task ReembolsarUltimoPagamento_IgnoraPagamentoPendenteMaisRecente()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta refund filtro");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-filter", "sub-filter");
        var pagamentoPago = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamentoPago.VincularProvider("pay-paid-filter", "pay-paid-filter", "sub-filter", "ref-paid", "https://asaas.test/paid", DateOnly.FromDateTime(DateTime.UtcNow));
        pagamentoPago.AtualizarStatus(StatusPagamentoConta.Recebido, DateTimeOffset.UtcNow.AddMinutes(-10));
        var pagamentoPendente = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamentoPendente.VincularProvider("pay-open-filter", "pay-open-filter", "sub-filter", "ref-open", "https://asaas.test/open", DateOnly.FromDateTime(DateTime.UtcNow));
        assinatura.Ativar(pagamentoPago.Id, DateTimeOffset.UtcNow);
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.AddRange(pagamentoPago, pagamentoPendente);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        await service.ReembolsarUltimoPagamentoAsync(conta.Id, "Teste", CancellationToken.None);

        Assert.Contains("pay-paid-filter", provedor.PagamentosReembolsados);
        Assert.DoesNotContain("pay-open-filter", provedor.PagamentosReembolsados);
        Assert.Equal(StatusPagamentoConta.Reembolsado, pagamentoPago.Status);
        Assert.Equal(StatusPagamentoConta.AguardandoPagamento, pagamentoPendente.Status);
    }

    [Fact]
    public async Task CriarCheckout_CartaoHospedado_EnviaMetodoEDadosPagador()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta cartao bloqueado");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        var response = await service.CriarCheckoutAsync(
            conta.Id,
            Guid.NewGuid(),
            new CreateBillingCheckoutRequest(
                PlanoFundadorCodigo,
                MetodoPagamento.CartaoCredito.ToString(),
                null,
                PagadorPadrao),
            CancellationToken.None);

        Assert.Equal(MetodoPagamento.CartaoCredito.ToString(), response.MetodoPagamento);
        Assert.Equal(MetodoPagamento.CartaoCredito.ToString(), provedor.UltimoCheckout?.MetodoPagamento);
        Assert.Equal("12345678901", provedor.UltimoCheckout?.Pagador?.CpfCnpj);
    }

    [Fact]
    public async Task CriarCheckout_PagadorMinimo_CriaCheckoutSemEnderecoCompleto()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta pagador minimo");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        var response = await service.CriarCheckoutAsync(
            conta.Id,
            Guid.NewGuid(),
            new CreateBillingCheckoutRequest(
                PlanoFundadorCodigo,
                MetodoPagamento.Pix.ToString(),
                CicloPlano.Mensal.ToString(),
                new BillingPagadorRequest(
                    "Fisica",
                    "Cliente Minimo",
                    "123.456.789-01")),
            CancellationToken.None);

        Assert.Equal(MetodoPagamento.Pix.ToString(), response.MetodoPagamento);
        Assert.Equal(1, provedor.CheckoutsCriados);
        Assert.Equal("Cliente Minimo", provedor.UltimoCheckout?.Pagador?.Nome);
        Assert.Equal("12345678901", provedor.UltimoCheckout?.Pagador?.CpfCnpj);
        Assert.Null(provedor.UltimoCheckout?.Pagador?.Endereco);
    }

    [Fact]
    public async Task CriarCheckout_Anual_EnviaCicloEValorAnual()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta anual");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        var response = await service.CriarCheckoutAsync(
            conta.Id,
            Guid.NewGuid(),
            new CreateBillingCheckoutRequest(
                PlanoFundadorCodigo,
                MetodoPagamento.Pix.ToString(),
                CicloPlano.Anual.ToString(),
                PagadorPadrao),
            CancellationToken.None);

        var pagamento = await dbContext.PagamentosConta.SingleAsync(item => item.Id == response.CheckoutId);

        Assert.Equal(CicloPlano.Anual.ToString(), provedor.UltimoCheckout?.Ciclo);
        Assert.Equal(180.00m, provedor.UltimoCheckout?.Valor);
        Assert.Equal("12345678901", provedor.UltimoCheckout?.Pagador?.CpfCnpj);
        Assert.Equal(CicloPlano.Anual, pagamento.Ciclo);
        Assert.Equal(180.00m, pagamento.Valor);
    }

    [Fact]
    public async Task ReactivarAsync_SempreBloqueiaReativacaoLocal()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta reativacao");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.Ativar(Guid.NewGuid(), DateTimeOffset.UtcNow);
        assinatura.MarcarInadimplente();
        dbContext.AssinaturasConta.Add(assinatura);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());

        await Assert.ThrowsAsync<BillingConflictException>(() =>
            service.ReactivarAsync(conta.Id, CancellationToken.None));
        Assert.Equal(StatusAssinaturaConta.Inadimplente, assinatura.Status);
    }

    [Fact]
    public async Task SincronizarContaAsync_NaoProcessaEventoDeOutraConta()
    {
        await using var dbContext = CreateDbContext();
        var contaAlvo = Conta.CreateConta("Conta alvo sync");
        var outraConta = Conta.CreateConta("Outra conta sync");
        dbContext.Contas.AddRange(contaAlvo, outraConta);
        await dbContext.SaveChangesAsync();

        var outraAssinatura = AssinaturaConta.Create(
            outraConta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        outraAssinatura.VincularProvider("cus-other", "sub-other");
        var outroPagamento = PagamentoConta.Create(
            outraConta.Id,
            outraAssinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        outroPagamento.VincularProvider("pay-other-sync", "pay-other-sync", "sub-other", "ref", "https://asaas.test/other", DateOnly.FromDateTime(DateTime.UtcNow));
        var evento = EventoWebhookPagamento.Create(
            ProvedorPagamento.Asaas,
            "evt-other-sync",
            "PAYMENT_CONFIRMED",
            "pay-other-sync",
            """
            {"id":"evt-other-sync","event":"PAYMENT_CONFIRMED","payment":{"id":"pay-other-sync","subscription":"sub-other","status":"CONFIRMED","value":19.99}}
            """);
        dbContext.AssinaturasConta.Add(outraAssinatura);
        dbContext.PagamentosConta.Add(outroPagamento);
        dbContext.EventosWebhookPagamento.Add(evento);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());

        var processados = await service.SincronizarContaAsync(contaAlvo.Id, CancellationToken.None);

        Assert.Equal(0, processados);
        Assert.Equal(StatusProcessamentoWebhook.Recebido, evento.StatusProcessamento);
        Assert.Equal(StatusPagamentoConta.AguardandoPagamento, outroPagamento.Status);
    }

    [Fact]
    public async Task SincronizarContaAsync_CancelamentoAgendadoVencidoViraCancelado()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta cancelamento vencido");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.Ativar(Guid.NewGuid(), DateTimeOffset.UtcNow.AddMonths(-2), CicloPlano.Mensal, DateTimeOffset.UtcNow.AddDays(-1));
        assinatura.AgendarCancelamento("Teste");
        dbContext.AssinaturasConta.Add(assinatura);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());

        await service.SincronizarContaAsync(conta.Id, CancellationToken.None);

        Assert.Equal(StatusAssinaturaConta.Cancelada, assinatura.Status);
    }

    [Fact]
    public async Task ReembolsarUltimoPagamento_ParcialNaoSuspendeAssinatura()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta reembolso parcial");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-partial", "sub-partial");
        var pagamento = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamento.VincularProvider("pay-partial", "pay-partial", "sub-partial", "ref", "https://asaas.test/partial", DateOnly.FromDateTime(DateTime.UtcNow));
        pagamento.AtualizarStatus(StatusPagamentoConta.Recebido, DateTimeOffset.UtcNow);
        assinatura.Ativar(pagamento.Id, DateTimeOffset.UtcNow);
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.Add(pagamento);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        await service.ReembolsarUltimoPagamentoAsync(conta.Id, "Teste parcial", 5.00m, CancellationToken.None);

        Assert.Equal(5.00m, pagamento.RefundedAmount);
        Assert.Equal(StatusPagamentoConta.ReembolsadoParcial, pagamento.Status);
        Assert.Equal(StatusAssinaturaConta.Ativa, assinatura.Status);
        Assert.DoesNotContain("sub-partial", provedor.AssinaturasCanceladas);
        Assert.Equal(5.00m, provedor.ValoresReembolsados["pay-partial"]);
    }

    [Fact]
    public async Task CriarCheckoutAsync_AssinaturaAtivaOutroCiclo_CriaCobrancaDeTrocaSemBloquearAcesso()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta troca ciclo");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinaturaMensal = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinaturaMensal.DefinirCiclo(CicloPlano.Mensal, PlanoFundadorPrecoMensal);
        assinaturaMensal.VincularProvider("cus-cycle", "sub-cycle-old");
        var pagamentoMensal = PagamentoConta.Create(
            conta.Id,
            assinaturaMensal.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamentoMensal.AtualizarStatus(StatusPagamentoConta.Recebido, DateTimeOffset.UtcNow);
        assinaturaMensal.Ativar(pagamentoMensal.Id, DateTimeOffset.UtcNow);
        dbContext.AssinaturasConta.Add(assinaturaMensal);
        dbContext.PagamentosConta.Add(pagamentoMensal);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        var checkout = await service.CriarCheckoutAsync(
            conta.Id,
            Guid.NewGuid(),
            new CreateBillingCheckoutRequest(
                PlanoFundadorCodigo,
                MetodoPagamento.Pix.ToString(),
                CicloPlano.Anual.ToString(),
                PagadorPadrao),
            CancellationToken.None);
        var entitlements = await new BillingEntitlementsService(dbContext).GetEntitlementsAsync(conta, CancellationToken.None);

        Assert.Equal(CicloPlano.Anual.ToString(), checkout.Ciclo);
        Assert.True(entitlements.CanRemoveWatermark);
        Assert.Contains("sub-cycle-old", provedor.AssinaturasCanceladas);
        Assert.Contains(dbContext.AssinaturasConta, item => item.ContaId == conta.Id && item.Ciclo == CicloPlano.Anual && item.Status == StatusAssinaturaConta.AguardandoPagamento);
    }

    [Fact]
    public async Task ReembolsarUltimoPagamento_AcumulaMultiplosParciais()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta reembolso parcial duplo");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-partial-2", "sub-partial-2");
        var pagamento = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamento.VincularProvider("pay-partial-2", "pay-partial-2", "sub-partial-2", "ref", "https://asaas.test/partial-2", DateOnly.FromDateTime(DateTime.UtcNow));
        pagamento.AtualizarStatus(StatusPagamentoConta.Recebido, DateTimeOffset.UtcNow);
        assinatura.Ativar(pagamento.Id, DateTimeOffset.UtcNow);
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.Add(pagamento);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var service = CreateBillingService(dbContext, provedor);

        await service.ReembolsarUltimoPagamentoAsync(conta.Id, "Primeiro parcial", 5.00m, CancellationToken.None);
        await service.ReembolsarUltimoPagamentoAsync(conta.Id, "Segundo parcial", 4.00m, CancellationToken.None);

        Assert.Equal(9.00m, pagamento.RefundedAmount);
        Assert.Equal(StatusPagamentoConta.ReembolsadoParcial, pagamento.Status);
        Assert.Equal(StatusAssinaturaConta.Ativa, assinatura.Status);
        Assert.Equal(2, provedor.PagamentosReembolsados.Count);
    }

    [Fact]
    public async Task RegistrarWebhookAsaas_PersisteSemProcessar()
    {
        await using var dbContext = CreateDbContext();
        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());
        using var payload = JsonDocument.Parse("""
        {
          "id": "evt-persist-only",
          "event": "PAYMENT_CONFIRMED",
          "payment": {
            "id": "pay-persist-only",
            "status": "CONFIRMED",
            "value": 19.99
          }
        }
        """);

        var evento = await service.RegistrarWebhookAsaasAsync(payload.RootElement, CancellationToken.None);

        Assert.Equal(StatusProcessamentoWebhook.Recebido, evento.StatusProcessamento);
        Assert.Null(evento.ProcessadoAt);
    }

    [Fact]
    public async Task WebhookDesconhecido_EhIgnoradoSemErro()
    {
        await using var dbContext = CreateDbContext();
        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());
        using var payload = JsonDocument.Parse("""
        {
          "id": "evt-unknown",
          "event": "PAYMENT_CUSTOM_EVENT",
          "payment": {
            "id": "pay-unknown",
            "value": 19.99
          }
        }
        """);

        var evento = await service.RegistrarWebhookAsaasAsync(payload.RootElement, CancellationToken.None);
        var processado = await service.ProcessarEventoWebhookAsaasAsync(evento, CancellationToken.None);

        Assert.True(processado);
        Assert.Equal(StatusProcessamentoWebhook.Ignorado, evento.StatusProcessamento);
    }

    [Fact]
    public async Task WebhookReembolsoParcial_NaoSuspendeAssinatura()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta webhook parcial");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-wh-partial", "sub-wh-partial");
        var pagamento = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        pagamento.VincularProvider("pay-wh-partial", "pay-wh-partial", "sub-wh-partial", "ref", "https://asaas.test/partial", DateOnly.FromDateTime(DateTime.UtcNow));
        pagamento.AtualizarStatus(StatusPagamentoConta.Recebido, DateTimeOffset.UtcNow);
        assinatura.Ativar(pagamento.Id, DateTimeOffset.UtcNow);
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.Add(pagamento);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());
        using var payload = JsonDocument.Parse("""
        {
          "id": "evt-wh-partial",
          "event": "PAYMENT_PARTIALLY_REFUNDED",
          "refundValue": 5.00,
          "payment": {
            "id": "pay-wh-partial",
            "subscription": "sub-wh-partial",
            "status": "RECEIVED",
            "value": 19.99
          }
        }
        """);

        await service.ProcessarWebhookAsaasAsync(payload.RootElement, CancellationToken.None);

        Assert.Equal(StatusPagamentoConta.ReembolsadoParcial, pagamento.Status);
        Assert.Equal(5.00m, pagamento.RefundedAmount);
        Assert.Equal(StatusAssinaturaConta.Ativa, assinatura.Status);
    }

    [Fact]
    public async Task CreditoManual_LiberaEntitlementsPagosPorTrintaDias()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta credito manual");
        typeof(Conta)
            .GetProperty(nameof(Conta.TrialEndsAt))!
            .SetValue(conta, DateTimeOffset.UtcNow.AddDays(-1));
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());

        await service.ConcederCreditoManualAsync(conta.Id, Guid.NewGuid(), "Teste", CancellationToken.None);
        var entitlements = await new BillingEntitlementsService(dbContext)
            .GetEntitlementsAsync(conta, CancellationToken.None);

        Assert.True(entitlements.CanGenerateProposta);
        Assert.True(entitlements.CanRemoveWatermark);
        Assert.Contains(dbContext.HistoricosAssinaturaConta, item => item.Evento == "ManualBillingCreditGranted");
    }

    [Fact]
    public async Task EnviarEmailsPreVencimentoAsync_EnviaAvisoUmDiaAntes()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta pre vencimento");
        var usuario = new UsuarioAplicacao
        {
            Id = Guid.NewGuid(),
            Nome = "Owner Billing",
            UserName = "owner-billing@emprely.dev",
            Email = "owner-billing@emprely.dev",
            EmailConfirmed = true,
        };
        dbContext.Contas.Add(conta);
        dbContext.Users.Add(usuario);
        dbContext.MembrosConta.Add(MembroConta.CreateOwner(conta.Id, usuario.Id));
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        var pagamento = PagamentoConta.Create(
            conta.Id,
            assinatura.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.Ativar(pagamento.Id, DateTimeOffset.UtcNow.AddMonths(-1), CicloPlano.Mensal, DateTimeOffset.UtcNow.AddHours(24));
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.PagamentosConta.Add(pagamento);
        await dbContext.SaveChangesAsync();

        var emailService = new FakeEmailTransacionalService();
        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos(), emailService);

        var enviados = await service.EnviarEmailsPreVencimentoAsync(CancellationToken.None);

        Assert.Equal(1, enviados);
        Assert.Contains(emailService.Mensagens, item => item.Tipo == TipoEmailTransacional.BillingPagamentoPendente);
    }

    [Fact]
    public async Task SolicitarLinkPagamentoPublicoAsync_EmailInexistente_NaoEnumeraConta()
    {
        await using var dbContext = CreateDbContext();
        var emailService = new FakeEmailTransacionalService();
        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos(), emailService);

        await service.SolicitarLinkPagamentoPublicoAsync(
            new PublicBillingPaymentLinkRequest("naoexiste@emprely.dev"),
            CancellationToken.None);

        Assert.Empty(emailService.Mensagens);
    }

    [Fact]
    public async Task SolicitarLinkPagamentoPublicoAsync_LinkValido_RetornaContextoLimitado()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta link publico");
        var usuario = CreateUsuario("billing-publico@emprely.dev");
        dbContext.Contas.Add(conta);
        dbContext.Users.Add(usuario);
        dbContext.MembrosConta.Add(MembroConta.CreateOwner(conta.Id, usuario.Id));
        await dbContext.SaveChangesAsync();

        var emailService = new FakeEmailTransacionalService();
        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos(), emailService);

        await service.SolicitarLinkPagamentoPublicoAsync(
            new PublicBillingPaymentLinkRequest("billing-publico@emprely.dev"),
            CancellationToken.None);

        var mensagem = Assert.Single(emailService.Mensagens);
        Assert.Equal(TipoEmailTransacional.BillingLinkPagamentoPublico, mensagem.Tipo);

        var contexto = await service.GetLinkPagamentoPublicoAsync(
            ExtrairTokenPagamentoPublico(mensagem.Texto),
            CancellationToken.None);

        Assert.Equal("Conta link publico", contexto.ContaNome);
        Assert.Equal(2, contexto.Planos.Length);
        Assert.Equal("Trial", contexto.Status.Plano);
    }

    [Fact]
    public async Task CriarCheckoutPublicoAsync_TokenValido_CriaCheckoutComMesmasRegras()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta checkout publico");
        var usuario = CreateUsuario("checkout-publico@emprely.dev");
        dbContext.Contas.Add(conta);
        dbContext.Users.Add(usuario);
        dbContext.MembrosConta.Add(MembroConta.CreateOwner(conta.Id, usuario.Id));
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        var emailService = new FakeEmailTransacionalService();
        var service = CreateBillingService(dbContext, provedor, emailService);

        await service.SolicitarLinkPagamentoPublicoAsync(
            new PublicBillingPaymentLinkRequest("checkout-publico@emprely.dev"),
            CancellationToken.None);
        var token = ExtrairTokenPagamentoPublico(Assert.Single(emailService.Mensagens).Texto);

        var checkout = await service.CriarCheckoutPublicoAsync(
            token,
            new CreateBillingCheckoutRequest(
                PlanoFundadorCodigo,
                MetodoPagamento.Pix.ToString(),
                CicloPlano.Mensal.ToString(),
                new BillingPagadorRequest("Fisica", "Cliente Publico", "123.456.789-01")),
            CancellationToken.None);

        Assert.Equal(1, provedor.CheckoutsCriados);
        Assert.Equal("https://asaas.test/checkout-1", checkout.CheckoutUrl);
        Assert.Equal(usuario.Email, provedor.UltimoCheckout?.EmailCliente);
    }

    [Fact]
    public async Task GetLinkPagamentoPublicoAsync_TokenInvalido_BloqueiaAcesso()
    {
        await using var dbContext = CreateDbContext();
        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());

        await Assert.ThrowsAsync<BillingException>(() =>
            service.GetLinkPagamentoPublicoAsync("token-invalido", CancellationToken.None));
    }

    [Fact]
    public async Task RestaurarAdminAsync_PermiteCreditoManualVigente()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta restaurar credito");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.Suspender("Teste");
        dbContext.AssinaturasConta.Add(assinatura);
        dbContext.DiasGratisConta.Add(DiasGratisConta.Create(
            conta.Id,
            DateTimeOffset.UtcNow.AddDays(-1),
            DateTimeOffset.UtcNow.AddDays(10),
            "Credito vigente",
            Guid.NewGuid()));
        await dbContext.SaveChangesAsync();

        var service = CreateBillingService(dbContext, new FakeProvedorPagamentos());

        await service.RestaurarAdminAsync(conta.Id, "Restaurar por credito", CancellationToken.None);

        Assert.Equal(StatusAssinaturaConta.Ativa, assinatura.Status);
    }

    [Fact]
    public async Task SincronizarContaAsync_ConsultaAsaasELiberaPagamentoRecebido()
    {
        await using var dbContext = CreateDbContext();
        var conta = Conta.CreateConta("Conta sync remoto");
        dbContext.Contas.Add(conta);
        await dbContext.SaveChangesAsync();

        var assinatura = AssinaturaConta.Create(
            conta.Id,
            PlanoFundadorCodigo,
            ProvedorPagamento.Asaas,
            MetodoPagamento.Pix,
            PlanoFundadorPrecoMensal);
        assinatura.VincularProvider("cus-sync", "sub-sync");
        dbContext.AssinaturasConta.Add(assinatura);
        await dbContext.SaveChangesAsync();

        var provedor = new FakeProvedorPagamentos();
        provedor.AssinaturasRemotas["sub-sync"] = new AssinaturaRemotaResultado("sub-sync", "ACTIVE", DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(1)));
        provedor.PagamentosPorAssinatura["sub-sync"] =
        [
            new PagamentoRemotoResultado(
                "pay-sync",
                "sub-sync",
                conta.Id.ToString(),
                "RECEIVED",
                PlanoFundadorPrecoMensal,
                null,
                "https://asaas.test/pay-sync",
                DateOnly.FromDateTime(DateTime.UtcNow))
        ];
        var service = CreateBillingService(dbContext, provedor);

        var processados = await service.SincronizarContaAsync(conta.Id, CancellationToken.None);

        var pagamento = await dbContext.PagamentosConta.SingleAsync(item => item.ProviderPaymentId == "pay-sync");
        Assert.True(processados > 0);
        Assert.Equal(StatusPagamentoConta.Recebido, pagamento.Status);
        Assert.Equal(StatusAssinaturaConta.Ativa, assinatura.Status);
    }

    private static EmprelyDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<EmprelyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        return new EmprelyDbContext(options);
    }

    private static BillingService CreateBillingService(
        EmprelyDbContext dbContext,
        FakeProvedorPagamentos provedor,
        FakeEmailTransacionalService? emailService = null)
    {
        return new BillingService(
            dbContext,
            provedor,
            emailService ?? new FakeEmailTransacionalService(),
            new BillingEntitlementsService(dbContext),
            Options.Create(new AsaasOptions()),
            Options.Create(new AppPublicOptions { PublicWebUrl = "https://app.emprely.test" }),
            new EphemeralDataProtectionProvider());
    }

    private static UsuarioAplicacao CreateUsuario(string email)
    {
        return new UsuarioAplicacao
        {
            Id = Guid.NewGuid(),
            Nome = "Usuario Billing",
            UserName = email,
            NormalizedUserName = email.ToUpperInvariant(),
            Email = email,
            NormalizedEmail = email.ToUpperInvariant(),
            EmailConfirmed = true,
        };
    }

    private static string ExtrairTokenPagamentoPublico(string texto)
    {
        const string marcador = "/billing/pagar/";
        var inicio = texto.IndexOf(marcador, StringComparison.Ordinal);
        Assert.True(inicio >= 0, "Mensagem deve conter link publico de pagamento.");
        inicio += marcador.Length;
        var fim = texto.IndexOfAny(['\r', '\n', ' ', '\t'], inicio);
        return fim < 0 ? texto[inicio..].Trim() : texto[inicio..fim].Trim();
    }

    private sealed class FakeProvedorPagamentos : IProvedorPagamentos
    {
        public int CheckoutsCriados { get; private set; }

        public CriarCheckoutPagamentoRequest? UltimoCheckout { get; private set; }

        public List<string> AssinaturasCanceladas { get; } = [];

        public List<string> PagamentosReembolsados { get; } = [];

        public Dictionary<string, decimal?> ValoresReembolsados { get; } = [];

        public Dictionary<string, PagamentoRemotoResultado> PagamentosRemotos { get; } = [];

        public Dictionary<string, AssinaturaRemotaResultado> AssinaturasRemotas { get; } = [];

        public Dictionary<string, List<PagamentoRemotoResultado>> PagamentosPorAssinatura { get; } = [];

        public Task<CheckoutPagamentoResultado> CriarCheckoutAsync(
            CriarCheckoutPagamentoRequest request,
            CancellationToken cancellationToken)
        {
            CheckoutsCriados++;
            UltimoCheckout = request;
            var suffix = CheckoutsCriados.ToString();

            return Task.FromResult(new CheckoutPagamentoResultado(
                $"checkout-{suffix}",
                request.ProviderCustomerId ?? $"cus-{suffix}",
                $"sub-{suffix}",
                $"pay-{suffix}",
                $"https://asaas.test/checkout-{suffix}",
                DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
                DateTimeOffset.UtcNow.AddHours(1)));
        }

        public Task CancelarAssinaturaAsync(string providerSubscriptionId, CancellationToken cancellationToken)
        {
            AssinaturasCanceladas.Add(providerSubscriptionId);
            return Task.CompletedTask;
        }

        public Task ReembolsarPagamentoAsync(
            string providerPaymentId,
            decimal? valor,
            string? motivo,
            CancellationToken cancellationToken)
        {
            PagamentosReembolsados.Add(providerPaymentId);
            ValoresReembolsados[providerPaymentId] = valor;
            return Task.CompletedTask;
        }

        public Task<PagamentoRemotoResultado?> ObterPagamentoAsync(
            string providerPaymentId,
            CancellationToken cancellationToken)
        {
            PagamentosRemotos.TryGetValue(providerPaymentId, out var pagamento);
            return Task.FromResult<PagamentoRemotoResultado?>(pagamento);
        }

        public Task<AssinaturaRemotaResultado?> ObterAssinaturaAsync(
            string providerSubscriptionId,
            CancellationToken cancellationToken)
        {
            AssinaturasRemotas.TryGetValue(providerSubscriptionId, out var assinatura);
            return Task.FromResult<AssinaturaRemotaResultado?>(assinatura);
        }

        public Task<IReadOnlyCollection<PagamentoRemotoResultado>> ListarPagamentosAssinaturaAsync(
            string providerSubscriptionId,
            int limite,
            CancellationToken cancellationToken)
        {
            IReadOnlyCollection<PagamentoRemotoResultado> pagamentos = PagamentosPorAssinatura.TryGetValue(providerSubscriptionId, out var lista)
                ? lista.Take(limite).ToList()
                : [];
            return Task.FromResult(pagamentos);
        }
    }

    private sealed class FakeEmailTransacionalService : IEmailTransacionalService
    {
        public List<EmailTransacionalMensagem> Mensagens { get; } = [];

        public Task EnviarAsync(EmailTransacionalMensagem mensagem, CancellationToken cancellationToken)
        {
            Mensagens.Add(mensagem);
            return Task.CompletedTask;
        }
    }
}
