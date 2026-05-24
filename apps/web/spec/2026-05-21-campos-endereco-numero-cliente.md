# Spec - Campos opcionais de endereco e numero no cliente

## Arquivos

- `src/App.tsx`
- `src/types/customer.ts`

## Comportamento esperado

- O cadastro completo de cliente mostra os campos `Endereco` e `Numero`.
- Ambos sao opcionais.
- `Endereco` aceita ate 200 caracteres.
- `Numero` aceita ate 30 caracteres.
- Ao editar cliente, os campos retornam preenchidos.
- O payload envia os campos para a API como string ou `null`.
- A criacao rapida de cliente envia os campos como `null`.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
