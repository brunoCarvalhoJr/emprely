# Spec - Layout compacto dos itens da proposta

## Arquivos

`src/App.tsx`
`src/styles.css`

## Comportamento esperado

- A lista de itens da etapa 3 deve ter contraste proprio em relacao ao fundo da secao.
- Cada item adicionado deve ocupar menos altura que o layout anterior.
- O total do item deve continuar visivel.
- A remocao do item deve continuar disponivel e acessivel.
- Campos de item, quantidade, valor e descricao devem manter validacao e mascaras atuais.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
