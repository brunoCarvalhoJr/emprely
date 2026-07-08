using Emprely.Domain.Common;
using Emprely.Domain.Contas;

namespace Emprely.Domain.Pagamentos;

public sealed class AssinaturaConta : EntidadeBase
{
    private AssinaturaConta()
    {
        PlanoCodigo = string.Empty;
        Moeda = "BRL";
        Ciclo = CicloPlano.Mensal;
    }

    private AssinaturaConta(
        Guid contaId,
        string planoCodigo,
        ProvedorPagamento provedor,
        MetodoPagamento metodoPagamento,
        decimal valor)
    {
        ContaId = contaId;
        PlanoCodigo = planoCodigo;
        Provedor = provedor;
        MetodoPagamento = metodoPagamento;
        Ciclo = CicloPlano.Mensal;
        Valor = valor;
        Moeda = "BRL";
        Status = StatusAssinaturaConta.AguardandoPagamento;
    }

    public Guid ContaId { get; private set; }

    public Conta? Conta { get; private set; }

    public string PlanoCodigo { get; private set; }

    public ProvedorPagamento Provedor { get; private set; }

    public string? ProviderCustomerId { get; private set; }

    public string? ProviderSubscriptionId { get; private set; }

    public StatusAssinaturaConta Status { get; private set; }

    public MetodoPagamento MetodoPagamento { get; private set; }

    public CicloPlano Ciclo { get; private set; }

    public decimal Valor { get; private set; }

    public string Moeda { get; private set; }

    public DateTimeOffset? PeriodoAtualInicio { get; private set; }

    public DateTimeOffset? PeriodoAtualFim { get; private set; }

    public bool CancelAtPeriodEnd { get; private set; }

    public DateTimeOffset? CanceladaAt { get; private set; }

    public string? MotivoCancelamento { get; private set; }

    public Guid? UltimoPagamentoId { get; private set; }

    public static AssinaturaConta Create(
        Guid contaId,
        string planoCodigo,
        ProvedorPagamento provedor,
        MetodoPagamento metodoPagamento,
        decimal valor)
    {
        if (string.IsNullOrWhiteSpace(planoCodigo))
        {
            throw new ArgumentException("Codigo do plano e obrigatorio.", nameof(planoCodigo));
        }

        if (valor <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(valor), "Valor da assinatura deve ser positivo.");
        }

        return new AssinaturaConta(contaId, planoCodigo.Trim(), provedor, metodoPagamento, valor);
    }

    public void DefinirCiclo(CicloPlano ciclo, decimal valor)
    {
        Ciclo = ciclo;
        Valor = valor;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void VincularProvider(string? providerCustomerId, string? providerSubscriptionId)
    {
        ProviderCustomerId = string.IsNullOrWhiteSpace(providerCustomerId) ? ProviderCustomerId : providerCustomerId.Trim();
        ProviderSubscriptionId = string.IsNullOrWhiteSpace(providerSubscriptionId) ? ProviderSubscriptionId : providerSubscriptionId.Trim();
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void MarcarAguardandoPagamento(MetodoPagamento metodoPagamento, CicloPlano ciclo, decimal valor)
    {
        MetodoPagamento = metodoPagamento;
        Ciclo = ciclo;
        Valor = valor;
        Status = StatusAssinaturaConta.AguardandoPagamento;
        CancelAtPeriodEnd = false;
        CanceladaAt = null;
        MotivoCancelamento = null;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Ativar(Guid pagamentoId, DateTimeOffset agora, CicloPlano ciclo, DateTimeOffset? periodoFim = null)
    {
        Status = StatusAssinaturaConta.Ativa;
        Ciclo = ciclo;
        PeriodoAtualInicio = agora;
        PeriodoAtualFim = periodoFim ?? CalcularFimPeriodo(agora, ciclo);
        UltimoPagamentoId = pagamentoId;
        CancelAtPeriodEnd = false;
        UpdatedAt = agora;
    }

    public void Ativar(Guid pagamentoId, DateTimeOffset agora)
    {
        Ativar(pagamentoId, agora, Ciclo);
    }

    public void MarcarEmAnalise()
    {
        Status = StatusAssinaturaConta.PagamentoEmAnalise;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void MarcarInadimplente()
    {
        if (Status == StatusAssinaturaConta.Cancelada)
        {
            return;
        }

        Status = StatusAssinaturaConta.Inadimplente;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AgendarCancelamento(string? motivo)
    {
        CancelAtPeriodEnd = true;
        MotivoCancelamento = motivo;
        Status = StatusAssinaturaConta.CancelamentoAgendado;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void CancelarAgora(string? motivo)
    {
        CancelAtPeriodEnd = false;
        MotivoCancelamento = motivo;
        Status = StatusAssinaturaConta.Cancelada;
        CanceladaAt = DateTimeOffset.UtcNow;
        UpdatedAt = CanceladaAt;
    }

    public void Suspender(string? motivo)
    {
        MotivoCancelamento = motivo;
        Status = StatusAssinaturaConta.Suspensa;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Restaurar()
    {
        Status = StatusAssinaturaConta.Ativa;
        CancelAtPeriodEnd = false;
        MotivoCancelamento = null;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public bool IsPeriodoVigente(DateTimeOffset agora)
    {
        return PeriodoAtualFim.HasValue && PeriodoAtualFim > agora;
    }

    private static DateTimeOffset CalcularFimPeriodo(DateTimeOffset inicio, CicloPlano ciclo)
    {
        return ciclo == CicloPlano.Anual ? inicio.AddYears(1) : inicio.AddMonths(1);
    }
}
