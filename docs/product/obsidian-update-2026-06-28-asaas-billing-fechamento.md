# Obsidian update - Asaas billing fechamento

Data: 2026-06-28

> Atualizacao 2026-07-08: a decisao de cartao bloqueado deste registro historico foi substituida. Pix e cartao agora ficam ativos via checkout/cobranca hospedada do Asaas, sem dados sensiveis de cartao no Emprely. Ver `docs/product/obsidian-update-2026-07-08-checkout-dados-pagador.md`.

## Estado atual

Billing Asaas fechado para V2 operacional:

- Pix recorrente por cobranca hospedada Asaas.
- Ciclos mensal e anual no Plano Fundador.
- Precos: R$ 19,99 mensal e R$ 180,00 anual.
- Cartao estava bloqueado nesta decisao original; em 2026-07-08 passou a ser ativo via ambiente hospedado do Asaas.
- Reativacao local removida do fluxo do cliente.
- Webhook persistido no request e processado por worker.
- Worker reserva evento como `EmProcessamento`, aplica retry com backoff e roda reconciliacao diaria.
- Reembolso parcial suportado sem suspender acesso.
- Multiplos reembolsos parciais acumulam.
- Reembolso integral cancela recorrencia e suspende.
- Credito manual auditado de 30 dias para operacao admin legada.
- Sync admin isolado por conta, incluindo eventos locais, pagamentos remotos e assinatura remota.
- Tela de plano mostra pagamento atual, link de checkout pendente e historico de cobrancas.
- Emails essenciais de billing foram incluidos.
- Email de pre-vencimento roda no job diario.
- Troca mensal/anual cria cobranca do novo ciclo e agenda ativacao para o proximo periodo quando ja existe assinatura vigente.
- Admin billing lista eventos de webhook e permite reprocessar evento com erro.
- Rotas legadas `activate-founder` foram removidas.

## Checklist imediato

- Aplicar migrations no banco alvo.
- Enviar `D:\Emprely\Segredos\lightsail.env` atualizado no deploy da API.
- Validar sandbox Pix mensal.
- Validar sandbox Pix anual.
- Validar webhook duplicado.
- Validar reembolso parcial.
- Validar reembolso integral.
- Publicar API e webapp.

## Atualizacao 2026-07-08 - Segredos Asaas

- Webhook Asaas configurado no painel.
- Segredos locais ficam fora do repo em `D:\Emprely\Segredos`.
- Arquivos privados:
  - `ASAAS-SANDBOX-API-KEYY.env`
  - `ASAAS-PROD-API-KEYY.env`
  - `ASAAS-TOKEN-WEBHOOK.env`
- `pnpm lightsail:asaas:prod` atualiza `D:\Emprely\Segredos\lightsail.env` com producao.
- `pnpm lightsail:asaas:sandbox` alterna para sandbox quando for fazer smoke.
- `pnpm lightsail:env:validate` valida o env antes de subir a API.
- Status: env privado atualizado com producao e validado em 2026-07-08.
