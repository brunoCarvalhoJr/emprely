using Emprely.Domain.Common;

namespace Emprely.Domain.Pagamentos;

public sealed class EventoWebhookPagamento : EntidadeBase
{
    private EventoWebhookPagamento()
    {
        ProviderEventId = string.Empty;
        TipoEvento = string.Empty;
        PayloadJson = "{}";
    }

    private EventoWebhookPagamento(
        ProvedorPagamento provedor,
        string providerEventId,
        string tipoEvento,
        string? providerResourceId,
        string payloadJson)
    {
        Provedor = provedor;
        ProviderEventId = providerEventId;
        TipoEvento = tipoEvento;
        ProviderResourceId = providerResourceId;
        PayloadJson = payloadJson;
        RecebidoAt = DateTimeOffset.UtcNow;
        StatusProcessamento = StatusProcessamentoWebhook.Recebido;
    }

    public ProvedorPagamento Provedor { get; private set; }

    public string ProviderEventId { get; private set; }

    public string TipoEvento { get; private set; }

    public string? ProviderResourceId { get; private set; }

    public Guid? ContaId { get; private set; }

    public Guid? PagamentoContaId { get; private set; }

    public Guid? AssinaturaContaId { get; private set; }

    public DateTimeOffset RecebidoAt { get; private set; }

    public DateTimeOffset? ProcessadoAt { get; private set; }

    public StatusProcessamentoWebhook StatusProcessamento { get; private set; }

    public string PayloadJson { get; private set; }

    public string? ErroProcessamento { get; private set; }

    public int TentativasProcessamento { get; private set; }

    public DateTimeOffset? ProximaTentativaAt { get; private set; }

    public static EventoWebhookPagamento Create(
        ProvedorPagamento provedor,
        string providerEventId,
        string tipoEvento,
        string? providerResourceId,
        string payloadJson)
    {
        return new EventoWebhookPagamento(
            provedor,
            providerEventId.Trim(),
            tipoEvento.Trim(),
            string.IsNullOrWhiteSpace(providerResourceId) ? null : providerResourceId.Trim(),
            payloadJson);
    }

    public void MarcarProcessado(Guid? contaId, Guid? pagamentoContaId, Guid? assinaturaContaId)
    {
        ContaId = contaId;
        PagamentoContaId = pagamentoContaId;
        AssinaturaContaId = assinaturaContaId;
        StatusProcessamento = StatusProcessamentoWebhook.Processado;
        ProcessadoAt = DateTimeOffset.UtcNow;
        ErroProcessamento = null;
        UpdatedAt = ProcessadoAt;
    }

    public void AtualizarRecebido(string tipoEvento, string? providerResourceId, string payloadJson)
    {
        if (StatusProcessamento == StatusProcessamentoWebhook.Processado ||
            StatusProcessamento == StatusProcessamentoWebhook.Ignorado ||
            StatusProcessamento == StatusProcessamentoWebhook.EmProcessamento)
        {
            return;
        }

        TipoEvento = tipoEvento.Trim();
        ProviderResourceId = string.IsNullOrWhiteSpace(providerResourceId) ? ProviderResourceId : providerResourceId.Trim();
        PayloadJson = payloadJson;
        StatusProcessamento = StatusProcessamentoWebhook.Recebido;
        ErroProcessamento = null;
        ProximaTentativaAt = null;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void MarcarEmProcessamento(DateTimeOffset agora)
    {
        StatusProcessamento = StatusProcessamentoWebhook.EmProcessamento;
        TentativasProcessamento++;
        UpdatedAt = agora;
    }

    public void MarcarErro(string erro, DateTimeOffset? proximaTentativaAt = null)
    {
        StatusProcessamento = StatusProcessamentoWebhook.Erro;
        ErroProcessamento = erro[..Math.Min(erro.Length, 1000)];
        ProximaTentativaAt = proximaTentativaAt;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void MarcarIgnorado(string? motivo)
    {
        StatusProcessamento = StatusProcessamentoWebhook.Ignorado;
        ErroProcessamento = string.IsNullOrWhiteSpace(motivo)
            ? null
            : motivo[..Math.Min(motivo.Length, 1000)];
        ProcessadoAt = DateTimeOffset.UtcNow;
        UpdatedAt = ProcessadoAt;
    }
}
