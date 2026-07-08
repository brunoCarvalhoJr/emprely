using Emprely.Application.Auth;
using Emprely.Api.Servicos;
using Emprely.Contracts.Billing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Emprely.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/billing")]
public sealed class BillingController : ControllerBase
{
    private readonly ICurrentContaContext currentContaContext;
    private readonly BillingService billingService;

    public BillingController(
        ICurrentContaContext currentContaContext,
        BillingService billingService)
    {
        this.currentContaContext = currentContaContext;
        this.billingService = billingService;
    }

    [HttpGet("plans")]
    public ActionResult<BillingPlanoResponse[]> GetPlanos()
    {
        return Ok(BillingCatalogo.GetPlanos());
    }

    [AllowAnonymous]
    [HttpPost("public/payment-links")]
    public async Task<IActionResult> SolicitarLinkPagamentoPublico(
        PublicBillingPaymentLinkRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            await billingService.SolicitarLinkPagamentoPublicoAsync(request, cancellationToken);
            return NoContent();
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [AllowAnonymous]
    [HttpGet("public/payment-links/{token}")]
    public async Task<ActionResult<PublicBillingPaymentLinkResponse>> GetLinkPagamentoPublico(
        string token,
        CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await billingService.GetLinkPagamentoPublicoAsync(token, cancellationToken));
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("public/payment-links/{token}/checkouts")]
    public async Task<ActionResult<BillingCheckoutResponse>> CriarCheckoutPublico(
        string token,
        CreateBillingCheckoutRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await billingService.CriarCheckoutPublicoAsync(token, request, cancellationToken));
        }
        catch (BillingConflictException exception)
        {
            return Conflict(new { message = exception.Message });
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = exception.Message });
        }
    }

    [HttpGet("status")]
    public async Task<ActionResult<BillingStatusResponse>> GetStatus(CancellationToken cancellationToken)
    {
        var status = await billingService.GetStatusAsync(currentContaContext.ContaId, cancellationToken);
        return status is null ? NotFound() : Ok(status);
    }

    [HttpPost("checkouts")]
    public async Task<ActionResult<BillingCheckoutResponse>> CriarCheckout(
        CreateBillingCheckoutRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var checkout = await billingService.CriarCheckoutAsync(
                currentContaContext.ContaId,
                currentContaContext.UsuarioId,
                request,
                cancellationToken);

            return Ok(checkout);
        }
        catch (BillingConflictException exception)
        {
            return Conflict(new { message = exception.Message });
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = exception.Message });
        }
    }

    [HttpPost("cancel")]
    public async Task<IActionResult> Cancelar(
        CancelBillingRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            await billingService.CancelarAsync(currentContaContext.ContaId, request.Motivo, cancellationToken);
            return NoContent();
        }
        catch (BillingConflictException exception)
        {
            return Conflict(new { message = exception.Message });
        }
        catch (BillingException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

}
