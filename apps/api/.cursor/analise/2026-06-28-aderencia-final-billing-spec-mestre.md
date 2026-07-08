# Analise API - aderencia final billing spec mestre

## Problema

A API ja possui base de billing Asaas, mas ainda nao cumpre integralmente a spec mestre em reembolso parcial repetido, restauracao por credito manual, reconciliacao remota, emails essenciais e retry controlado de webhooks.

## Impacto tecnico

- `BillingService` precisa aceitar `ReembolsadoParcial` como pagamento ainda reembolsavel.
- `RestaurarAdminAsync` deve considerar credito manual vigente.
- `IProvedorPagamentos` e `AsaasProvedorPagamentos` precisam consultar pagamento/assinatura remota para reconciliacao.
- `BillingWebhookHostedService` deve executar job diario de reconciliacao alem do processamento frequente de webhooks.
- `TipoEmailTransacional` e templates precisam de tipos de billing.
- `BillingStatusResponse` precisa expor pagamento atual e historico para a tela do app.

## Riscos

- Evitar liberar acesso por checkout ou por reconciliacao sem status financeiro confirmado/recebido.
- Evitar cancelar recorrencia em reembolso parcial.
- Evitar duplicar historico/email em webhook duplicado.

## Aceite API

- Multiplos reembolsos parciais acumulam.
- Restauracao admin funciona com pagamento vigente ou credito manual vigente.
- Reconciliacao consulta Asaas e aplica divergencias financeiras.
- Emails essenciais sao disparados nos eventos de billing.
- Contratos entregam dados suficientes para UI de plano.
