# Analise - correcoes Asaas billing

## Contexto

A implementacao de billing Asaas ja cobre checkout hospedado, recorrencia, webhooks, email transacional, painel administrativo e reembolso. A revisao posterior identificou riscos de liberacao indevida, cobranca duplicada e falha de reconciliacao.

## Pontos criticos

- Entitlements nao podem depender apenas de `Conta.Plano = Fundador` quando existe assinatura local em status suspenso, cancelado, inadimplente ou reembolsado.
- Checkout repetido deve reutilizar pagamento aberto ou retornar conflito quando a assinatura ja tem acesso pago ativo.
- Webhook com evento salvo como erro precisa poder ser reprocessado.
- Cobranca recorrente do Asaas pode chegar sem `externalReference`; a assinatura deve ser localizada por `ProviderSubscriptionId`.
- Reembolso deve cancelar a recorrencia remota antes de suspender acesso local, registrando historico se a cancelacao remota falhar.
- Reativacao local nao pode religar acesso se a recorrencia remota foi cancelada.

## Decisoes

- Manter `Conta.Plano = Fundador` como marcador legado apenas para contas sem registros de billing.
- Tratar conflito de billing como HTTP 409 nos endpoints de checkout, cancelamento, reativacao e admin refund.
- Cobrir os fluxos criticos por testes de integracao com provider fake, sem dependência do Asaas real.
