using Emprely.Contracts.Billing;
using Emprely.Domain.Contas;
using Emprely.Domain.Pagamentos;
using Emprely.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Api.Servicos;

public sealed class BillingEntitlementsService
{
    private readonly EmprelyDbContext dbContext;

    public BillingEntitlementsService(EmprelyDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<BillingEntitlementsResponse> GetEntitlementsAsync(
        Conta conta,
        CancellationToken cancellationToken)
    {
        var agora = DateTimeOffset.UtcNow;
        var diasGratisAtivo = await dbContext.DiasGratisConta.AnyAsync(
            dias => dias.ContaId == conta.Id && dias.InicioAt <= agora && dias.FimAt > agora,
            cancellationToken);
        var assinaturaAtiva = await dbContext.AssinaturasConta
            .Where(item => item.ContaId == conta.Id)
            .Where(item =>
                (item.Status == StatusAssinaturaConta.Ativa ||
                    item.Status == StatusAssinaturaConta.CancelamentoAgendado) &&
                item.PeriodoAtualFim.HasValue &&
                item.PeriodoAtualFim > agora)
            .OrderByDescending(item => item.PeriodoAtualFim)
            .FirstOrDefaultAsync(cancellationToken);
        var podeUsar = conta.Status == StatusConta.Ativa &&
            (conta.IsTrialAtivo(agora) || diasGratisAtivo || assinaturaAtiva is not null);
        var podeRemoverWatermark = conta.Status == StatusConta.Ativa &&
            (diasGratisAtivo || assinaturaAtiva is not null);

        return new BillingEntitlementsResponse(
            podeUsar,
            podeUsar,
            podeUsar,
            podeRemoverWatermark);
    }
}
