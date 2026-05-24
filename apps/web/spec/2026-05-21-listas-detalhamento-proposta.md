# Spec - Listas no detalhamento da proposta

## Arquivos

`src/App.tsx`
`src/styles.css`

## Comportamento esperado

- "O que esta incluso" deve ser uma lista editavel no lugar do textarea.
- "O que nao esta incluso" deve ser uma lista editavel no lugar do textarea.
- Cada lista deve permitir adicionar item por item.
- Cada item deve permitir edicao inline e remocao.
- A ordem dos itens deve poder ser alterada por drag and drop.
- O valor salvo deve continuar sendo enviado como lista de strings no payload atual.
- O layout deve ser responsivo, limpo e consistente com o restante do builder de propostas.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
