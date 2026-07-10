# Spec - Corrigir cards de propostas no tema dark mobile

## Objetivo

Corrigir a listagem responsiva de propostas para respeitar o tema dark em telas
mobile, eliminando cards brancos com texto de baixo contraste.

## Comportamento esperado

Quando o usuario usa tema dark em viewport mobile:

- Cada linha/card de `.data-table` deve usar superficie escura.
- Bordas e divisorias devem usar tons compativeis com o dark mode.
- Conteudo principal deve usar `var(--foreground)`.
- Metadados e labels devem usar `var(--muted)`.
- Botoes de acoes da tabela devem continuar visiveis e clicaveis.

## Implementacao

- Adicionar override especifico para `:root[data-theme="dark"] .data-table tr`
  dentro/apos as regras mobile tardias.
- Ajustar `td`, `td::before`, `td span`, `td strong` e `.table-action-icon` no
  mesmo contexto.

## Fora do escopo

- Redesenhar a tela de propostas.
- Alterar estrutura do markup da tabela.
- Alterar dados, status, filtros, paginacao ou API.

## Validacao

- `pnpm lint:web`
- `pnpm build:web`
