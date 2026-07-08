using Emprely.Contracts.Billing;
using Emprely.Domain.Pagamentos;

namespace Emprely.Api.Servicos;

internal static class BillingCatalogo
{
    public const string PlanoFundadorCodigo = "fundador";
    public const decimal PlanoFundadorPrecoMensal = 19.99m;
    public const decimal PlanoFundadorPrecoAnual = 180.00m;

    public static BillingPlanoResponse[] GetPlanos()
    {
        return
        [
            new BillingPlanoResponse(
                PlanoFundadorCodigo,
                "Plano Fundador",
                "Propostas sem marca d'agua, exportacao em PDF/imagem e compartilhamento comercial.",
                CicloPlano.Mensal.ToString(),
                "mes",
                PlanoFundadorPrecoMensal,
                PlanoFundadorPrecoMensal,
                "BRL",
                true,
                [
                    new BillingMetodoPagamentoResponse(
                        MetodoPagamento.Pix.ToString(),
                        "Pix",
                        "Pagamento mensal por Pix no ambiente seguro do Asaas."),
                    new BillingMetodoPagamentoResponse(
                        MetodoPagamento.CartaoCredito.ToString(),
                        "Cartao de credito",
                        "Pagamento por cartao no checkout hospedado do Asaas."),
                ]),
            new BillingPlanoResponse(
                PlanoFundadorCodigo,
                "Plano Fundador",
                "Propostas sem marca d'agua, exportacao em PDF/imagem e compartilhamento comercial.",
                CicloPlano.Anual.ToString(),
                "ano",
                PlanoFundadorPrecoAnual,
                PlanoFundadorPrecoMensal,
                "BRL",
                true,
                [
                    new BillingMetodoPagamentoResponse(
                        MetodoPagamento.Pix.ToString(),
                        "Pix",
                        "Cobranca anual por Pix no ambiente seguro do Asaas."),
                    new BillingMetodoPagamentoResponse(
                        MetodoPagamento.CartaoCredito.ToString(),
                        "Cartao de credito",
                        "Pagamento por cartao no checkout hospedado do Asaas."),
                ]),
        ];
    }

    public static bool IsPlanoValido(string planoCodigo)
    {
        return string.Equals(planoCodigo, PlanoFundadorCodigo, StringComparison.OrdinalIgnoreCase);
    }

    public static bool IsMetodoPagamentoAtivo(MetodoPagamento metodoPagamento)
    {
        return metodoPagamento is MetodoPagamento.Pix or MetodoPagamento.CartaoCredito;
    }

    public static bool TryGetPlano(
        string planoCodigo,
        CicloPlano ciclo,
        out BillingPlanoConfiguracao configuracao)
    {
        if (!IsPlanoValido(planoCodigo))
        {
            configuracao = default;
            return false;
        }

        var valor = ciclo == CicloPlano.Anual ? PlanoFundadorPrecoAnual : PlanoFundadorPrecoMensal;
        configuracao = new BillingPlanoConfiguracao(PlanoFundadorCodigo, ciclo, valor);
        return true;
    }
}

internal readonly record struct BillingPlanoConfiguracao(
    string PlanoCodigo,
    CicloPlano Ciclo,
    decimal Valor);
