# Spec - Preparacao beta local do MVP

## Visao geral

Preparar o monorepo para validacao beta local com documentacao e scripts oficiais.

## Entregas

- Script `validate:beta` na raiz.
- Script `test:e2e:web` na raiz.
- Runbook beta em `docs/product/beta-mvp-runbook.md`.
- README da raiz atualizado.
- README da API atualizado com regra comercial real.
- README do web atualizado com E2E.

## Regras

- Nao incluir secrets reais.
- Comandos devem funcionar a partir da raiz do monorepo.
- Reset de banco deve ser documentado como opcional e destrutivo.
- Validacao beta deve executar:
  - lint web;
  - build web;
  - E2E web;
  - build API;
  - testes API;
  - validacao do Docker Compose.

## Criterios de aceite

- `pnpm validate:beta` existe.
- `pnpm test:e2e:web` existe.
- Runbook explica subida do PostgreSQL, migrations, API e web.
- Runbook separa validacao automatizada de aceite manual.
- `docker compose config` esta no fluxo de validacao.

## Testes

- `pnpm validate:beta`
