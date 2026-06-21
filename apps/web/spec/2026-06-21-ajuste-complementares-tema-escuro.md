# Spec - Informacoes complementares no tema escuro

## Objetivo

Melhorar a legibilidade e acabamento visual do bloco "Informacoes complementares" em clientes no tema escuro.

## Criterios de aceite

- O bloco nao deve usar fundo cinza claro no dark theme.
- Header, labels, inputs, placeholders e botoes sociais devem ter contraste adequado.
- A cor do tema claro deve permanecer sem mudanca relevante.
- A correcao deve afetar tanto visualizacao/edicao de cliente quanto formulario reutilizado em nova proposta.

## Validacao

- `pnpm --filter web lint`
- `pnpm --filter web build`
- `pnpm --filter web test:e2e`

