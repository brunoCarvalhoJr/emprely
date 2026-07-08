namespace Emprely.Domain.Comunicacoes;

public enum TipoEmailTransacional
{
    ConfirmacaoEmail = 1,
    RecuperacaoSenha = 2,
    BoasVindas = 3,
    TrialIniciado = 4,
    TrialProximoFim = 5,
    TrialExpirado = 6,
    SuporteRecebido = 7,
    AlteracaoEmail = 8,
    AvisoEmailAlterado = 9,
    AdminPersonalizado = 10,
    AdminContaSuspensa = 11,
    PlanoFundadorAtivado = 12,
    BillingPagamentoPendente = 13,
    BillingBloqueioInadimplencia = 14,
    BillingCancelamentoAgendado = 15,
    BillingCancelamentoEfetivado = 16,
    BillingReembolsoParcial = 17,
    BillingReembolsoIntegral = 18,
    BillingLinkPagamentoPublico = 19,
}
