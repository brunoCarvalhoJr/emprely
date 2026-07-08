namespace Emprely.Application.Pagamentos;

public interface IProvedorPagamentos
{
    Task<CheckoutPagamentoResultado> CriarCheckoutAsync(
        CriarCheckoutPagamentoRequest request,
        CancellationToken cancellationToken);

    Task CancelarAssinaturaAsync(
        string providerSubscriptionId,
        CancellationToken cancellationToken);

    Task ReembolsarPagamentoAsync(
        string providerPaymentId,
        decimal? valor,
        string? motivo,
        CancellationToken cancellationToken);

    Task<PagamentoRemotoResultado?> ObterPagamentoAsync(
        string providerPaymentId,
        CancellationToken cancellationToken);

    Task<AssinaturaRemotaResultado?> ObterAssinaturaAsync(
        string providerSubscriptionId,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<PagamentoRemotoResultado>> ListarPagamentosAssinaturaAsync(
        string providerSubscriptionId,
        int limite,
        CancellationToken cancellationToken);
}

public sealed record CriarCheckoutPagamentoRequest(
    Guid ContaId,
    string NomeCliente,
    string? EmailCliente,
    string PlanoCodigo,
    string Descricao,
    decimal Valor,
    string MetodoPagamento,
    string Ciclo,
    string? ProviderCustomerId,
    string ExternalReference,
    string SuccessUrl,
    string CancelUrl,
    string ExpiredUrl,
    PagadorPagamentoRequest? Pagador = null);

public sealed record PagadorPagamentoRequest(
    string TipoPessoa,
    string Nome,
    string CpfCnpj,
    string? Email = null,
    string? Telefone = null,
    string? Cep = null,
    string? Endereco = null,
    string? Numero = null,
    string? Complemento = null,
    string? Bairro = null,
    string? Cidade = null,
    string? Uf = null);

public sealed record CheckoutPagamentoResultado(
    string ProviderCheckoutId,
    string? ProviderCustomerId,
    string? ProviderSubscriptionId,
    string? ProviderPaymentId,
    string CheckoutUrl,
    DateOnly? DueDate,
    DateTimeOffset? ExpiresAt);

public sealed record PagamentoRemotoResultado(
    string ProviderPaymentId,
    string? ProviderSubscriptionId,
    string? ExternalReference,
    string Status,
    decimal Valor,
    decimal? ValorReembolsado,
    string? InvoiceUrl,
    DateOnly? DueDate);

public sealed record AssinaturaRemotaResultado(
    string ProviderSubscriptionId,
    string Status,
    DateOnly? NextDueDate);
