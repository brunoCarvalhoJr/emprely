# Spec - Asaas billing completo

> Atualizacao 2026-07-08: esta spec foi complementada pela implementacao de checkout com dados do pagador. Cartao deixou de ser futuro/inativo e passou a ser ativo via ambiente hospedado do Asaas, sem captura de numero, validade ou CVV no Emprely. Ver `apps/api/spec/2026-07-08-checkout-dados-pagador-asaas.md` e `apps/web/spec/2026-07-08-checkout-dados-pagador-ui.md`.

## Objetivo

Permitir que usuario em trial ou trial expirado assine o Plano Fundador por Pix hospedado Asaas, com ativacao automatica por webhook/reconciliacao. Na decisao original, cartao ficava preparado e inativo ate tokenizacao segura; em 2026-07-08, cartao passou a ser ativo via checkout hospedado do Asaas.

## Escopo

Entra:

- Endpoints de planos, status, checkout, cancelamento, reativacao e webhook Asaas.
- Persistencia de assinatura, pagamento, evento webhook e historico.
- Client Asaas isolado na Infrastructure.
- Assinatura recorrente nativa do Asaas para o Plano Fundador mensal.
- Cancelamento remoto da assinatura no Asaas.
- Reembolso remoto via API Asaas quando houver pagamento remoto.
- Entitlements centralizados na API.
- Tela `Plano e cobranca` no webapp.
- Retorno de checkout com refresh de status.
- Landing atualizada originalmente para Pix hospedado Asaas e cartao futuro/inativo. A decisao de 2026-07-08 substitui essa premissa por Pix e cartao hospedados no Asaas.

Fora:

- Nota fiscal automatica.
- Split, cupom e prorata sofisticada.
- Checkout transparente.
- E-mails proprios do Emprely para lembretes financeiros; notificacoes de cobranca ficam no Asaas nesta etapa.
- App mobile nativo.

## Regras

- Plano inicial: Fundador mensal por R$19,99 ou anual por R$180,00.
- Trial continua 7 dias sem cartao.
- Pix e cartao ficam disponiveis no mensal.
- Retorno de checkout nao ativa plano sozinho.
- Pix libera em pagamento recebido.
- Cartao libera em pagamento confirmado ou recebido.
- Assinatura local deve guardar `ProviderSubscriptionId`.
- Webhook de cobranca recorrente deve criar pagamento local quando ainda nao existir.
- Cancelamento pelo app/admin deve chamar Asaas quando houver assinatura remota.
- Reembolso admin deve chamar Asaas quando houver pagamento remoto.
- Webhook duplicado nao processa duas vezes.
- Webhook com erro anterior deve poder ser reprocessado em retry do Asaas.
- Se houver qualquer assinatura local, entitlements pagos dependem do status da assinatura, nao apenas de `PlanoConta.Fundador`.
- `PlanoConta.Fundador` sem assinatura local e tratado como legado/admin.
- Segundo clique em checkout deve reaproveitar cobranca pendente ou retornar conflito se assinatura ja estiver ativa.
- Reembolso integral deve cancelar recorrencia remota e suspender acesso.
- Reativacao local so pode ocorrer quando a assinatura remota ainda for valida; caso contrario, usuario deve criar novo checkout.
- Sem Asaas configurado, API deve responder erro operacional ao criar checkout, sem impedir startup.

## Contratos

Endpoints autenticados:

- `GET /api/billing/plans`
- `GET /api/billing/status`
- `POST /api/billing/checkouts`
- `POST /api/billing/cancel`
- `POST /api/billing/reactivate`

Webhook:

- `POST /api/webhooks/asaas`

## Aceite

- Usuario ve plano/cobranca no app.
- Usuario consegue escolher Pix e abrir URL hospedada do Asaas.
- Cartao aparece apenas como futuro/inativo.
- A escolha cria assinatura recorrente Asaas mensal, nao somente cobranca avulsa.
- Webhook pago ativa `Fundador`.
- Webhook de nova cobranca recorrente atualiza ou cria pagamento local.
- Cancelamento e reembolso usam API Asaas quando existem IDs remotos.
- Inadimplencia, cancelamento, suspensao e reembolso removem permissao paga.
- Retries de webhook com erro conseguem concluir processamento.
- Clique repetido em ativar plano nao cria assinaturas recorrentes duplicadas.
- `/api/me` retorna plano/status atualizados.
- Trial expirado mostra CTA de ativacao por checkout.
- Landing deixa de dizer que ativacao do Fundador e manual.
- Builds e testes principais passam ou pendencias ficam registradas.
