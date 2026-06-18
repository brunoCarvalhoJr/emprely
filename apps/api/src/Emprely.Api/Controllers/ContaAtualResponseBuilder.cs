using Emprely.Contracts.Auth;
using Emprely.Domain.Contas;

namespace Emprely.Api.Controllers;

internal static class ContaAtualResponseBuilder
{
    private const decimal PlanoFundadorPrecoMensal = 19.90m;

    public static ContaAtualResponse BuildContaAtualResponse(Conta conta, string papel, bool diasGratisAtivo = false)
    {
        var agora = DateTimeOffset.UtcNow;
        var statusComercial = diasGratisAtivo && conta.Plano == PlanoConta.Trial
            ? StatusComercialConta.TrialAtivo
            : conta.GetStatusComercialConta(agora);

        return new ContaAtualResponse(
            conta.Id,
            conta.Nome,
            conta.Slug,
            papel,
            conta.Plano.ToString(),
            statusComercial.ToString(),
            conta.TrialEndsAt,
            conta.GetDiasRestantesTrial(agora),
            conta.PlanoFundadorAtivadoAt,
            PlanoFundadorPrecoMensal);
    }
}
