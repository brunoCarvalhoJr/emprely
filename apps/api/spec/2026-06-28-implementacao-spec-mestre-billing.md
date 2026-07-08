# Spec - Implementacao da spec mestre de billing API

## Visao geral

Implementar na API as correcoes necessarias para alinhar o fluxo Asaas existente com a spec mestre de billing.

## Escopo

Inclui:

- precos `R$ 19,99` mensal e `R$ 180,00` anual;
- webhook persistido sem processamento sincrono;
- worker para processar eventos pendentes;
- reembolso parcial sem suspender acesso;
- reembolso integral suspendendo acesso;
- credito manual auditado de 30 dias;
- ativacao admin legada convertida para credito manual;
- tolerancia de inadimplencia de 3 dias;
- sync por conta considerando pagamento e assinatura remotos;
- testes de regressao.

Fora do escopo:

- cartao ativo;
- Pix Automatico;
- microservico;
- proration.

## Requisitos

- O endpoint Asaas deve responder `200` apos persistir evento valido.
- Eventos desconhecidos devem ser ignorados sem erro operacional.
- `PAYMENT_PARTIALLY_REFUNDED` nao pode virar reembolso integral.
- Credito manual deve ter historico, periodo e responsavel.
- Ativacao admin antiga nao pode ativar `PlanoFundador` diretamente.
- Inadimplencia deve bloquear apenas depois da tolerancia definida na spec.

## Testes

- Catalogo retorna precos finais.
- Webhook persiste sem processar.
- Worker/processamento manual processa evento pendente.
- Reembolso parcial mantem assinatura ativa.
- Reembolso integral suspende.
- Credito manual libera entitlements por periodo.
- Ativacao admin cria credito manual.
- Sync acha evento por `ProviderSubscriptionId`.
