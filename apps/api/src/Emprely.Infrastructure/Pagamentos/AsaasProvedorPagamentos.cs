using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Emprely.Application.Pagamentos;
using Microsoft.Extensions.Options;

namespace Emprely.Infrastructure.Pagamentos;

public sealed class AsaasProvedorPagamentos : IProvedorPagamentos
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private readonly HttpClient httpClient;
    private readonly AsaasOptions options;

    public AsaasProvedorPagamentos(HttpClient httpClient, IOptions<AsaasOptions> options)
    {
        this.httpClient = httpClient;
        this.options = options.Value;
    }

    public async Task<CheckoutPagamentoResultado> CriarCheckoutAsync(
        CriarCheckoutPagamentoRequest request,
        CancellationToken cancellationToken)
    {
        EnsureConfigurado();

        var customerId = string.IsNullOrWhiteSpace(request.ProviderCustomerId)
            ? await CriarClienteAsync(request, cancellationToken)
            : request.ProviderCustomerId.Trim();
        if (!string.IsNullOrWhiteSpace(request.ProviderCustomerId))
        {
            await AtualizarClienteAsync(customerId, request, cancellationToken);
        }

        var billingType = MapBillingType(request.MetodoPagamento);
        var dueDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));
        var externalReference = request.ExternalReference;
        string? subscriptionId = null;
        var callback = string.IsNullOrWhiteSpace(request.SuccessUrl)
            ? null
            : new
            {
                successUrl = request.SuccessUrl,
                autoRedirect = true,
            };

        var subscriptionPayload = new
        {
            customer = customerId,
            billingType,
            value = request.Valor,
            nextDueDate = dueDate.ToString("yyyy-MM-dd"),
            cycle = MapCycle(request.Ciclo),
            description = request.Descricao,
            externalReference,
            callback,
        };

        try
        {
            using var subscriptionResponse = await PostAsync("subscriptions", subscriptionPayload, cancellationToken);
            var subscriptionJson = await subscriptionResponse.Content.ReadFromJsonAsync<JsonElement>(JsonOptions, cancellationToken);
            subscriptionId = GetString(subscriptionJson, "id");

            if (string.IsNullOrWhiteSpace(subscriptionId))
            {
                throw new InvalidOperationException("Asaas nao retornou identificador da assinatura.");
            }

            var paymentJson = await BuscarPrimeiraCobrancaAssinaturaAsync(subscriptionId, cancellationToken);

            var paymentId = GetString(paymentJson, "id") ?? string.Empty;
            var invoiceUrl = GetString(paymentJson, "invoiceUrl") ??
                GetString(paymentJson, "bankSlipUrl") ??
                GetString(paymentJson, "paymentLink") ??
                GetString(subscriptionJson, "invoiceUrl");

            if (string.IsNullOrWhiteSpace(paymentId) || string.IsNullOrWhiteSpace(invoiceUrl))
            {
                throw new InvalidOperationException("Asaas nao retornou identificador ou URL da primeira cobranca recorrente.");
            }

            return new CheckoutPagamentoResultado(
                subscriptionId,
                customerId,
                subscriptionId,
                paymentId,
                invoiceUrl,
                dueDate,
                DateTimeOffset.UtcNow.AddDays(1));
        }
        catch
        {
            if (!string.IsNullOrWhiteSpace(subscriptionId))
            {
                await TryCancelarAssinaturaCompensacaoAsync(subscriptionId, cancellationToken);
            }

            throw;
        }
    }

    public Task CancelarAssinaturaAsync(
        string providerSubscriptionId,
        CancellationToken cancellationToken)
    {
        EnsureConfigurado();
        return DeleteAsync($"subscriptions/{Uri.EscapeDataString(providerSubscriptionId)}", cancellationToken);
    }

    public Task ReembolsarPagamentoAsync(
        string providerPaymentId,
        decimal? valor,
        string? motivo,
        CancellationToken cancellationToken)
    {
        EnsureConfigurado();
        var payload = new
        {
            value = valor,
            description = motivo,
        };

        return PostAndDiscardAsync($"payments/{Uri.EscapeDataString(providerPaymentId)}/refund", payload, cancellationToken);
    }

    public async Task<PagamentoRemotoResultado?> ObterPagamentoAsync(
        string providerPaymentId,
        CancellationToken cancellationToken)
    {
        EnsureConfigurado();
        var json = await GetJsonAsync($"payments/{Uri.EscapeDataString(providerPaymentId)}", cancellationToken);
        return MapPagamentoRemoto(json);
    }

    public async Task<AssinaturaRemotaResultado?> ObterAssinaturaAsync(
        string providerSubscriptionId,
        CancellationToken cancellationToken)
    {
        EnsureConfigurado();
        var json = await GetJsonAsync($"subscriptions/{Uri.EscapeDataString(providerSubscriptionId)}", cancellationToken);
        var id = GetString(json, "id");
        if (string.IsNullOrWhiteSpace(id))
        {
            return null;
        }

        return new AssinaturaRemotaResultado(
            id,
            GetString(json, "status") ?? "UNKNOWN",
            GetDateOnly(json, "nextDueDate"));
    }

    public async Task<IReadOnlyCollection<PagamentoRemotoResultado>> ListarPagamentosAssinaturaAsync(
        string providerSubscriptionId,
        int limite,
        CancellationToken cancellationToken)
    {
        EnsureConfigurado();
        var json = await GetJsonAsync(
            $"payments?subscription={Uri.EscapeDataString(providerSubscriptionId)}&limit={Math.Clamp(limite, 1, 100)}",
            cancellationToken);

        if (json.ValueKind != JsonValueKind.Object ||
            !json.TryGetProperty("data", out var data) ||
            data.ValueKind != JsonValueKind.Array)
        {
            return [];
        }

        var pagamentos = new List<PagamentoRemotoResultado>();
        foreach (var item in data.EnumerateArray())
        {
            var pagamento = MapPagamentoRemoto(item);
            if (pagamento is not null)
            {
                pagamentos.Add(pagamento);
            }
        }

        return pagamentos;
    }

    private async Task<string> CriarClienteAsync(
        CriarCheckoutPagamentoRequest request,
        CancellationToken cancellationToken)
    {
        var customerPayload = BuildCustomerPayload(request);

        using var customerResponse = await PostAsync("customers", customerPayload, cancellationToken);
        var customerJson = await customerResponse.Content.ReadFromJsonAsync<JsonElement>(JsonOptions, cancellationToken);
        var customerId = GetString(customerJson, "id");

        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new InvalidOperationException("Asaas nao retornou identificador do cliente.");
        }

        return customerId;
    }

    private async Task AtualizarClienteAsync(
        string customerId,
        CriarCheckoutPagamentoRequest request,
        CancellationToken cancellationToken)
    {
        var customerPayload = BuildCustomerPayload(request);
        await PutAndDiscardAsync($"customers/{Uri.EscapeDataString(customerId)}", customerPayload, cancellationToken);
    }

    private static object BuildCustomerPayload(CriarCheckoutPagamentoRequest request)
    {
        return new
        {
            name = request.Pagador?.Nome ?? request.NomeCliente,
            email = request.Pagador?.Email ?? request.EmailCliente,
            cpfCnpj = request.Pagador?.CpfCnpj,
            mobilePhone = request.Pagador?.Telefone,
            postalCode = request.Pagador?.Cep,
            address = request.Pagador?.Endereco,
            addressNumber = request.Pagador?.Numero,
            complement = request.Pagador?.Complemento,
            province = request.Pagador?.Bairro,
            externalReference = request.ContaId.ToString(),
            notificationDisabled = false,
        };
    }

    private async Task<HttpResponseMessage> PostAsync(
        string relativeUrl,
        object payload,
        CancellationToken cancellationToken)
    {
        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, relativeUrl)
        {
            Content = JsonContent.Create(payload, options: JsonOptions),
        };
        requestMessage.Headers.TryAddWithoutValidation("access_token", options.ApiKey.Trim());

        var response = await httpClient.SendAsync(requestMessage, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException(
                $"Asaas retornou HTTP {(int)response.StatusCode}.");
        }

        return response;
    }

    private async Task PostAndDiscardAsync(
        string relativeUrl,
        object payload,
        CancellationToken cancellationToken)
    {
        using var response = await PostAsync(relativeUrl, payload, cancellationToken);
    }

    private async Task PutAndDiscardAsync(
        string relativeUrl,
        object payload,
        CancellationToken cancellationToken)
    {
        using var requestMessage = new HttpRequestMessage(HttpMethod.Put, relativeUrl)
        {
            Content = JsonContent.Create(payload, options: JsonOptions),
        };
        requestMessage.Headers.TryAddWithoutValidation("access_token", options.ApiKey.Trim());

        using var response = await httpClient.SendAsync(requestMessage, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _ = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException(
                $"Asaas retornou HTTP {(int)response.StatusCode}.");
        }
    }

    private async Task DeleteAsync(string relativeUrl, CancellationToken cancellationToken)
    {
        using var requestMessage = new HttpRequestMessage(HttpMethod.Delete, relativeUrl);
        requestMessage.Headers.TryAddWithoutValidation("access_token", options.ApiKey.Trim());

        var response = await httpClient.SendAsync(requestMessage, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException(
                $"Asaas retornou HTTP {(int)response.StatusCode}.");
        }
    }

    private async Task<JsonElement> BuscarPrimeiraCobrancaAssinaturaAsync(
        string subscriptionId,
        CancellationToken cancellationToken)
    {
        var json = await GetJsonAsync(
            $"payments?subscription={Uri.EscapeDataString(subscriptionId)}&limit=1",
            cancellationToken);
        if (json.ValueKind == JsonValueKind.Object &&
            json.TryGetProperty("data", out var data) &&
            data.ValueKind == JsonValueKind.Array &&
            data.GetArrayLength() > 0)
        {
            return data[0];
        }

        throw new InvalidOperationException("Asaas nao retornou a primeira cobranca da assinatura.");
    }

    private async Task<JsonElement> GetJsonAsync(
        string relativeUrl,
        CancellationToken cancellationToken)
    {
        using var requestMessage = new HttpRequestMessage(HttpMethod.Get, relativeUrl);
        requestMessage.Headers.TryAddWithoutValidation("access_token", options.ApiKey.Trim());

        using var response = await httpClient.SendAsync(requestMessage, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException(
                $"Asaas retornou HTTP {(int)response.StatusCode}.");
        }

        return await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions, cancellationToken);
    }

    private async Task TryCancelarAssinaturaCompensacaoAsync(
        string providerSubscriptionId,
        CancellationToken cancellationToken)
    {
        try
        {
            await DeleteAsync($"subscriptions/{Uri.EscapeDataString(providerSubscriptionId)}", cancellationToken);
        }
        catch
        {
            // A falha de compensacao deve ser tratada por reconciliacao operacional.
        }
    }

    private void EnsureConfigurado()
    {
        if (string.IsNullOrWhiteSpace(options.ApiKey))
        {
            throw new InvalidOperationException("Asaas:ApiKey nao configurado.");
        }
    }

    private static string MapBillingType(string metodoPagamento)
    {
        return metodoPagamento.Equals("CartaoCredito", StringComparison.OrdinalIgnoreCase)
            ? "CREDIT_CARD"
            : "PIX";
    }

    private static string MapCycle(string ciclo)
    {
        return ciclo.Equals("Anual", StringComparison.OrdinalIgnoreCase) ||
            ciclo.Equals("YEARLY", StringComparison.OrdinalIgnoreCase)
            ? "YEARLY"
            : "MONTHLY";
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
            !element.TryGetProperty(propertyName, out var property) ||
            property.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
        {
            return null;
        }

        if (property.ValueKind == JsonValueKind.Number &&
            property.TryGetDecimal(out var number))
        {
            return number;
        }

        return decimal.TryParse(property.ToString(), out var parsed) ? parsed : null;
    }

    private static DateOnly? GetDateOnly(JsonElement element, string propertyName)
    {
        var value = GetString(element, propertyName);
        return DateOnly.TryParse(value, out var parsed) ? parsed : null;
    }

    private static PagamentoRemotoResultado? MapPagamentoRemoto(JsonElement payment)
    {
        var id = GetString(payment, "id");
        if (string.IsNullOrWhiteSpace(id))
        {
            return null;
        }

        return new PagamentoRemotoResultado(
            id,
            GetString(payment, "subscription"),
            GetString(payment, "externalReference"),
            GetString(payment, "status") ?? "UNKNOWN",
            GetDecimal(payment, "value") ?? 0m,
            GetDecimal(payment, "refundedValue"),
            GetString(payment, "invoiceUrl") ??
                GetString(payment, "bankSlipUrl") ??
                GetString(payment, "paymentLink"),
            GetDateOnly(payment, "dueDate"));
    }
}
