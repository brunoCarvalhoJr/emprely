# Spec - Redes sociais opcionais no cliente

## Arquivos

- `src/App.tsx`
- `src/types/customer.ts`

## Comportamento esperado

- O cadastro completo de cliente mostra os campos `Instagram`, `Facebook` e `TikTok`.
- Todos sao opcionais.
- Cada campo aceita ate 160 caracteres.
- Ao editar cliente, os campos retornam preenchidos.
- O payload envia os campos para a API como string ou `null`.
- A criacao rapida de cliente envia os campos como `null`.
- A busca de clientes considera os valores das redes sociais.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
