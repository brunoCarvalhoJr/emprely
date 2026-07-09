# Release - billing plano e cancelamento UI

Data: 2026-07-09

## Escopo

Melhoria de usabilidade da tela `Plano` do app Emprely, focada em pagamento em andamento e cancelamento de renovacao.

## Entregue

- Tela reorganizada em resumo do plano, cobranca atual, pagamento, beneficios e historico.
- Pagamento em andamento mantem apenas um CTA destacado `Abrir Comprovante`.
- `Cobranca atual` mostra dados da cobranca sem duplicar o CTA principal.
- Historico continua com link discreto `Abrir Comprovante`.
- Mensagem de cancelamento alterada para orientar iniciar um novo plano.
- Quando a renovacao esta cancelada, a UI informa que o acesso segue ate a validade atual.
- Mobile passa a mostrar pagamento antes de beneficios e historico.

## Regras preservadas

- Nenhuma mudanca no backend de billing.
- Cancelamento continua significando cancelar a proxima renovacao.
- Acesso continua valido ate `periodoAtualFim`.
- Webhook, Asaas, banco de dados e secrets nao foram alterados.

## Validacoes

- `pnpm lint:web`: passou.
- `pnpm web:build:beta`: passou.
- QA visual local em desktop e mobile com mocks de billing.
- Validado que ha no maximo um CTA destacado `Abrir Comprovante` para a cobranca atual.

## Arquivos SDD

- `.cursor/analise/2026-07-09-billing-plano-cancelamento-usabilidade.md`
- `apps/web/spec/2026-07-09-billing-plano-cancelamento-usabilidade.md`
