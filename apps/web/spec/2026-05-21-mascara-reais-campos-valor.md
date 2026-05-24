# Spec - Mascara de reais nos campos de valor

## Arquivo

`src/App.tsx`

## Comportamento esperado

- O campo Preco em servicos aparece como `R$ 0,00`, `R$ 10,00`, etc.
- O campo Valor em itens da proposta aparece como moeda BRL.
- O campo Desconto em R$ aparece como moeda BRL.
- O campo Desconto em R$ usa a mesma mascara e o mesmo componente do campo Valor.
- Ao salvar, a API recebe valores numericos equivalentes.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
