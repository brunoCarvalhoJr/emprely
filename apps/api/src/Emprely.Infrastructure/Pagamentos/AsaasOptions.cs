namespace Emprely.Infrastructure.Pagamentos;

public sealed class AsaasOptions
{
    public const string SectionName = "Asaas";

    public string BaseUrl { get; set; } = "https://sandbox.asaas.com/api/v3";

    public string ApiKey { get; set; } = string.Empty;

    public string WebhookToken { get; set; } = string.Empty;

    public string CheckoutSuccessUrl { get; set; } = "https://app.emprely.com.br/billing/sucesso";

    public string CheckoutCancelUrl { get; set; } = "https://app.emprely.com.br/billing/cancelado";

    public string CheckoutExpiredUrl { get; set; } = "https://app.emprely.com.br/billing/expirado";
}
