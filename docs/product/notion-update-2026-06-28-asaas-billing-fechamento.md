# Notion update - Asaas billing fechamento

Data: 2026-06-28

> Atualizacao 2026-07-08: a decisao de cartao futuro/inativo deste registro historico foi substituida pelo checkout com dados do pagador. Pix e cartao agora ficam ativos via ambiente hospedado do Asaas, sem captura de numero/CVV pelo Emprely. Ver `docs/product/notion-update-2026-07-08-checkout-dados-pagador.md`.

## Decisao registrada

O fluxo de pagamentos Asaas do Emprely foi fechado com recorrencia mensal/anual, Pix ativo por cobranca recorrente hospedada, cartao de credito inicialmente desabilitado ate tokenizacao segura e reativacao via novo checkout.

Atualizacao da spec mestre: Plano Fundador ficou em R$ 19,99 mensal e R$ 180,00 anual. Webhook agora deve ser persistido no request e processado por worker. Ativacao admin legada virou credito manual auditado de 30 dias, sem ativar Fundador permanente fora do billing.

Atualizacao de aderencia final: o worker passou a reservar eventos em processamento, aplicar retry com backoff e executar reconciliacao diaria com consulta remota ao Asaas. O app passou a receber pagamento atual e historico de cobrancas dos ultimos 12 meses.

Atualizacao final de limpeza: rotas legadas `activate-founder` foram removidas; troca de ciclo mensal/anual cria cobranca do novo ciclo para o proximo periodo; admin billing lista/reprocessa webhooks; job diario envia aviso de pre-vencimento.

## Impacto

- Plano Fundador possui ciclo mensal e anual.
- Na decisao original, Pix hospedado Asaas era o metodo ativo e cartao ficava futuro. Em 2026-07-08, cartao passou a ser ativo via checkout hospedado do Asaas.
- Checkout cria assinatura Asaas fora da transacao local longa.
- Webhook libera acesso por pagamento confirmado/recebido apos processamento do worker.
- Sync admin e job diario consultam eventos locais, pagamentos remotos e assinatura remota.
- Eventos de webhook com erro usam retry controlado.
- App exibe cobranca atual, link pendente e historico de cobrancas.
- Emails essenciais cobrem plano ativado, pendencia/vencimento, bloqueio, cancelamento e reembolso.
- Rotas legadas de ativacao manual foram removidas.
- Troca de ciclo e agendada para o proximo periodo pago.
- Admin billing permite ver e reprocessar eventos de webhook da conta.
- Cancelamento agendado vencido vira assinatura cancelada.
- Reembolso parcial nao suspende acesso; reembolso integral cancela recorrencia e suspende.
- Inadimplencia respeita tolerancia de 3 dias.

## Proximo passo

Configurar secrets reais do Asaas e validar smoke sandbox Pix mensal/anual, webhook duplicado, reembolso parcial e reembolso integral antes de publicar.

## Atualizacao 2026-07-08 - Segredos Asaas para deploy da API

Webhook Asaas ja configurado no painel. Os segredos ficam fora do repo em `D:\Emprely\Segredos`:

- `ASAAS-SANDBOX-API-KEYY.env`: `Asaas__BaseUrl` e `Asaas__ApiKey` sandbox.
- `ASAAS-PROD-API-KEYY.env`: `Asaas__BaseUrl` e `Asaas__ApiKey` producao.
- `ASAAS-TOKEN-WEBHOOK.env`: `Asaas__WebhookToken` salvo no painel Asaas.

Comandos operacionais:

- `pnpm lightsail:asaas:prod`: prepara `D:\Emprely\Segredos\lightsail.env` para producao.
- `pnpm lightsail:asaas:sandbox`: prepara o mesmo env para smoke sandbox.
- `pnpm lightsail:env:validate`: valida o env privado antes de subir a API.

Status: env privado atualizado com producao e validado em 2026-07-08. Proximo passo e subir a API usando `D:\Emprely\Segredos\lightsail.env`, aplicar migrations e fazer smoke Asaas.
