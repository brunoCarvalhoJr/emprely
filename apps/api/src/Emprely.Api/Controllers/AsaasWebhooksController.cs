using System.Text.Json;
using Emprely.Api.Servicos;
using Emprely.Infrastructure.Pagamentos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Emprely.Api.Controllers;

[ApiController]
[Route("api/webhooks/asaas")]
public sealed class AsaasWebhooksController : ControllerBase
{
    private readonly BillingService billingService;
    private readonly AsaasOptions options;

    public AsaasWebhooksController(
        BillingService billingService,
        IOptions<AsaasOptions> options)
    {
        this.billingService = billingService;
        this.options = options.Value;
    }

    [HttpPost]
    public async Task<IActionResult> ReceberWebhook(
        JsonElement payload,
        CancellationToken cancellationToken)
    {
        if (!IsWebhookTokenValido())
        {
            return Unauthorized(new { message = "Token de webhook invalido." });
        }

        _ = await billingService.RegistrarWebhookAsaasAsync(payload, cancellationToken);
        return Ok(new { received = true });
    }

    private bool IsWebhookTokenValido()
    {
        if (string.IsNullOrWhiteSpace(options.WebhookToken))
        {
            return false;
        }

        var tokenConfigurado = options.WebhookToken.Trim();
        return Request.Headers.TryGetValue("asaas-access-token", out var tokenRecebido) &&
            string.Equals(tokenRecebido.ToString().Trim(), tokenConfigurado, StringComparison.Ordinal);
    }
}
