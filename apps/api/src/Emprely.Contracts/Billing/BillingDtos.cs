namespace Emprely.Contracts.Billing;

public sealed record BillingPlanoResponse(
    string Codigo,
    string Nome,
    string Descricao,
    string Ciclo,
    string Periodicidade,
    decimal Preco,
    decimal PrecoMensal,
    string Moeda,
    bool Ativo,
    BillingMetodoPagamentoResponse[] MetodosPagamento);

public sealed record BillingMetodoPagamentoResponse(
    string Codigo,
    string Nome,
    string Descricao,
    bool Ativo = true);

public sealed record BillingStatusResponse(
    string Plano,
    string StatusComercial,
    string? StatusAssinatura,
    string? MetodoPagamento,
    string? Ciclo,
    decimal? Valor,
    string Moeda,
    DateTimeOffset TrialEndsAt,
    int TrialDiasRestantes,
    DateTimeOffset? PeriodoAtualFim,
    DateTimeOffset? ProximaCobranca,
    bool CancelAtPeriodEnd,
    BillingEntitlementsResponse Entitlements,
    BillingPagamentoAtualResponse? PagamentoAtual,
    IReadOnlyCollection<BillingPagamentoHistoricoResponse> HistoricoPagamentos,
    string CtaRecomendado,
    string Mensagem);

public sealed record BillingEntitlementsResponse(
    bool CanGenerateProposta,
    bool CanExportProposta,
    bool CanSharePropostaWhatsapp,
    bool CanRemoveWatermark);

public sealed record CreateBillingCheckoutRequest(
    string PlanoCodigo,
    string MetodoPagamento,
    string? Ciclo = null,
    BillingPagadorRequest? Pagador = null);

public sealed record BillingPagadorRequest(
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

public sealed record BillingCheckoutResponse(
    Guid CheckoutId,
    string ProviderCheckoutId,
    string CheckoutUrl,
    DateTimeOffset? ExpiresAt,
    string Status,
    string PlanoCodigo,
    string Ciclo,
    decimal Valor,
    string MetodoPagamento);

public sealed record CancelBillingRequest(string? Motivo);

public sealed record BillingPagamentoAtualResponse(
    Guid Id,
    string Status,
    string MetodoPagamento,
    string Ciclo,
    decimal Valor,
    decimal ValorReembolsado,
    string? InvoiceUrl,
    DateOnly? DueDate,
    DateTimeOffset CreatedAt,
    DateTimeOffset? PaidAt);

public sealed record BillingPagamentoHistoricoResponse(
    Guid Id,
    string Status,
    string MetodoPagamento,
    string Ciclo,
    decimal Valor,
    decimal ValorReembolsado,
    string? InvoiceUrl,
    DateOnly? DueDate,
    DateTimeOffset CreatedAt,
    DateTimeOffset? PaidAt,
    DateTimeOffset? RefundedAt);

public sealed record AdminBillingContaResponse(
    Guid ContaId,
    string ContaNome,
    string Plano,
    string StatusComercial,
    BillingStatusResponse Status,
    IReadOnlyCollection<AdminBillingPagamentoResponse> Pagamentos,
    IReadOnlyCollection<AdminBillingHistoricoResponse> Historico,
    IReadOnlyCollection<AdminBillingWebhookResponse> Webhooks);

public sealed record AdminBillingPagamentoResponse(
    Guid Id,
    string Status,
    string MetodoPagamento,
    string Ciclo,
    decimal Valor,
    decimal ValorReembolsado,
    string? ProviderPaymentId,
    string? InvoiceUrl,
    DateTimeOffset CreatedAt,
    DateTimeOffset? PaidAt);

public sealed record AdminBillingHistoricoResponse(
    string Evento,
    string? Detalhes,
    DateTimeOffset CreatedAt);

public sealed record AdminBillingWebhookResponse(
    Guid Id,
    string TipoEvento,
    string StatusProcessamento,
    string? ProviderResourceId,
    Guid? PagamentoContaId,
    Guid? AssinaturaContaId,
    int TentativasProcessamento,
    DateTimeOffset RecebidoAt,
    DateTimeOffset? ProcessadoAt,
    DateTimeOffset? ProximaTentativaAt,
    string? ErroProcessamento);

public sealed record AdminBillingAcaoRequest(string? Motivo);

public sealed record AdminBillingReembolsoRequest(
    string? Motivo,
    decimal? Valor);

public sealed record PublicBillingPaymentLinkRequest(string Email);

public sealed record PublicBillingPaymentLinkResponse(
    string ContaNome,
    DateTimeOffset ExpiresAt,
    BillingStatusResponse Status,
    BillingPlanoResponse[] Planos);
