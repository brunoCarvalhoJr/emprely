using Emprely.Domain.Common;
using Emprely.Domain.Contas;

namespace Emprely.Domain.Pagamentos;

public sealed class PagamentoConta : EntidadeBase
{
    private PagamentoConta()
    {
        PlanoCodigo = string.Empty;
        Moeda = "BRL";
        Ciclo = CicloPlano.Mensal;
    }

    private PagamentoConta(
        Guid contaId,
        Guid assinaturaContaId,
        string planoCodigo,
        ProvedorPagamento provedor,
        MetodoPagamento metodoPagamento,
        decimal valor)
    {
        ContaId = contaId;
        AssinaturaContaId = assinaturaContaId;
        PlanoCodigo = planoCodigo;
        Provedor = provedor;
        MetodoPagamento = metodoPagamento;
        Ciclo = CicloPlano.Mensal;
        Valor = valor;
        Moeda = "BRL";
        Status = StatusPagamentoConta.AguardandoPagamento;
    }

    public Guid ContaId { get; private set; }

    public Conta? Conta { get; private set; }

    public Guid AssinaturaContaId { get; private set; }

    public AssinaturaConta? AssinaturaConta { get; private set; }

    public string PlanoCodigo { get; private set; }

    public ProvedorPagamento Provedor { get; private set; }

    public string? ProviderPaymentId { get; private set; }

    public string? ProviderCheckoutId { get; private set; }

    public string? ProviderSubscriptionId { get; private set; }

    public string? ExternalReference { get; private set; }

    public StatusPagamentoConta Status { get; private set; }

    public MetodoPagamento MetodoPagamento { get; private set; }

    public CicloPlano Ciclo { get; private set; }

    public decimal Valor { get; private set; }

    public string Moeda { get; private set; }

    public DateOnly? DueDate { get; private set; }

    public DateTimeOffset? ConfirmedAt { get; private set; }

    public DateTimeOffset? PaidAt { get; private set; }

    public DateTimeOffset? OverdueAt { get; private set; }

    public DateTimeOffset? RefundedAt { get; private set; }

    public decimal? RefundedAmount { get; private set; }

    public string? InvoiceUrl { get; private set; }

    public string? PixQrCodePayload { get; private set; }

    public static PagamentoConta Create(
        Guid contaId,
        Guid assinaturaContaId,
        string planoCodigo,
        ProvedorPagamento provedor,
        MetodoPagamento metodoPagamento,
        decimal valor)
    {
        return new PagamentoConta(contaId, assinaturaContaId, planoCodigo, provedor, metodoPagamento, valor);
    }

    public void DefinirCiclo(CicloPlano ciclo)
    {
        Ciclo = ciclo;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void VincularProvider(
        string? providerPaymentId,
        string? providerCheckoutId,
        string? providerSubscriptionId,
        string? externalReference,
        string? invoiceUrl,
        DateOnly? dueDate)
    {
        ProviderPaymentId = string.IsNullOrWhiteSpace(providerPaymentId) ? ProviderPaymentId : providerPaymentId.Trim();
        ProviderCheckoutId = string.IsNullOrWhiteSpace(providerCheckoutId) ? ProviderCheckoutId : providerCheckoutId.Trim();
        ProviderSubscriptionId = string.IsNullOrWhiteSpace(providerSubscriptionId) ? ProviderSubscriptionId : providerSubscriptionId.Trim();
        ExternalReference = string.IsNullOrWhiteSpace(externalReference) ? ExternalReference : externalReference.Trim();
        InvoiceUrl = string.IsNullOrWhiteSpace(invoiceUrl) ? InvoiceUrl : invoiceUrl.Trim();
        DueDate = dueDate ?? DueDate;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AtualizarStatus(StatusPagamentoConta status, DateTimeOffset agora)
    {
        if (!PodeTransicionarPara(status))
        {
            UpdatedAt = agora;
            return;
        }

        Status = status;

        if (status == StatusPagamentoConta.Confirmado)
        {
            ConfirmedAt ??= agora;
        }
        else if (status == StatusPagamentoConta.Recebido)
        {
            ConfirmedAt ??= agora;
            PaidAt ??= agora;
        }
        else if (status == StatusPagamentoConta.Vencido)
        {
            OverdueAt ??= agora;
        }
        else if (status == StatusPagamentoConta.Reembolsado)
        {
            RefundedAt ??= agora;
            RefundedAmount ??= Valor;
        }

        UpdatedAt = agora;
    }

    public bool IsPago()
    {
        return Status == StatusPagamentoConta.Confirmado ||
            Status == StatusPagamentoConta.Recebido ||
            Status == StatusPagamentoConta.ReembolsadoParcial;
    }

    public bool IsReembolsado()
    {
        return Status == StatusPagamentoConta.Reembolsado;
    }

    public decimal GetValorReembolsado()
    {
        return RefundedAmount ?? 0m;
    }

    public decimal GetSaldoReembolsavel()
    {
        var saldo = Valor - GetValorReembolsado();
        return saldo > 0m ? saldo : 0m;
    }

    public void RegistrarReembolso(decimal valor, DateTimeOffset agora)
    {
        if (valor <= 0m)
        {
            throw new ArgumentOutOfRangeException(nameof(valor), "Valor do reembolso deve ser positivo.");
        }

        var saldo = GetSaldoReembolsavel();
        if (valor > saldo)
        {
            throw new InvalidOperationException("Valor do reembolso maior que o saldo reembolsavel.");
        }

        RefundedAmount = GetValorReembolsado() + valor;
        RefundedAt ??= agora;

        if (RefundedAmount >= Valor)
        {
            Status = StatusPagamentoConta.Reembolsado;
        }
        else
        {
            Status = StatusPagamentoConta.ReembolsadoParcial;
        }

        UpdatedAt = agora;
    }

    private bool PodeTransicionarPara(StatusPagamentoConta novoStatus)
    {
        if (Status == novoStatus)
        {
            return true;
        }

        if (Status == StatusPagamentoConta.Reembolsado)
        {
            return false;
        }

        if (Status == StatusPagamentoConta.ReembolsadoParcial)
        {
            return novoStatus == StatusPagamentoConta.Recebido ||
                novoStatus == StatusPagamentoConta.Reembolsado;
        }

        if (novoStatus == StatusPagamentoConta.Reembolsado)
        {
            return IsPago();
        }

        if (Status == StatusPagamentoConta.Recebido)
        {
            return false;
        }

        if (Status == StatusPagamentoConta.Confirmado)
        {
            return novoStatus == StatusPagamentoConta.Recebido;
        }

        return true;
    }
}
