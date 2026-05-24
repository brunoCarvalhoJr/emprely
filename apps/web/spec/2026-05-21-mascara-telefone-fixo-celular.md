# Spec - Mascara de telefone fixo e celular

## Arquivo

`src/App.tsx`

## Comportamento esperado

- `1133334444` vira `(11) 3333-4444`.
- `11999994444` vira `(11) 99999-4444`.
- Entradas com `55` antes do DDD continuam sendo normalizadas para o telefone nacional.
- A mensagem de erro informa os dois formatos aceitos.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
