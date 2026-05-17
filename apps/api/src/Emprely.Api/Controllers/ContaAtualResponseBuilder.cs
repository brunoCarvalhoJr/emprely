using Emprely.Contracts.Auth;
using Emprely.Domain.Contas;

namespace Emprely.Api.Controllers;

internal static class ContaAtualResponseBuilder
{
    private const decimal PlanoFundadorPrecoMensal = 19.90m;

    public static ContaAtualResponse BuildContaAtualResponse(Conta conta, string papel)
    {
        var agora = DateTimeOffset.UtcNow;

        return new ContaAtualResponse(
            conta.Id,
            conta.Nome,
            conta.Slug,
            papel,
            conta.Plano.ToString(),
            conta.GetStatusComercialConta(agora).ToString(),
            conta.TrialEndsAt,
            conta.GetDiasRestantesTrial(agora),
            conta.PlanoFundadorAtivadoAt,
            PlanoFundadorPrecoMensal);
    }
}
