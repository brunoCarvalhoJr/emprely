# Notion update - Layout do painel admin

Data: 2026-07-09

## Decisao

Refatorar o `/admin` de uma tela unica empilhada para uma experiencia operacional por secoes.

## Resultado

- `Usuarios`: metricas, filtros, acoes, lista/tabela e detalhe contextual.
- `Seguranca`: troca de senha do admin logado.
- `Administradores`: gestao de admins para SuperAdmin.
- `Emails`: reenvio e historico para SuperAdmin.

## Beneficio

A tela deixa de ficar estreita e muito longa, melhora foco por tarefa e reduz a necessidade de rolagem horizontal em telas menores.

## Validacao

- `pnpm lint:web`: passou.
- `pnpm web:build:beta`: passou.
- QA visual local com screenshots desktop/mobile.
