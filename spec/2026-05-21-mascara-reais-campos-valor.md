# Spec - Mascara de reais nos campos de valor

## Escopo

Atualizar campos monetarios editaveis do app web.

## Requisitos

- Campos monetarios devem mostrar o prefixo `R$`.
- Valores devem usar formato brasileiro com duas casas decimais.
- O desconto deve usar a mesma mascara e o mesmo componente do campo Valor.
- O formulario deve continuar enviando numero para API.
- A validacao existente de minimo e maximo deve continuar funcionando.

## Campos afetados

- Preco do servico.
- Valor unitario de itens da proposta.
- Desconto em reais da proposta.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
