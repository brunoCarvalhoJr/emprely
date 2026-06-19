# Spec - Melhorar collapse de etapas da proposta mobile

## Visao geral

Melhorar a usabilidade do painel expandido de etapas no mobile para que a lista fique legivel, compacta e navegavel.

## Escopo

Inclui:

- Reestruturar visualmente os itens da lista de etapas.
- Exibir estado do passo de forma clara.
- Reduzir altura do painel aberto.

Fora do escopo:

- Alterar regras de bloqueio/conclusao das etapas.
- Alterar API.

## Criterios de aceite

- Nenhum item aparece como `3Itens`, `5Detalhes` ou equivalente.
- Itens ficam alinhados em linhas compactas.
- Estado atual fica destacado.
- Passos concluidos mostram check.
- Nao ha scroll horizontal em 390px.

## Testes

- `pnpm.cmd --dir apps/web lint`
- Playwright mobile com collapse aberto.
- `scripts/build-web-beta.ps1`

