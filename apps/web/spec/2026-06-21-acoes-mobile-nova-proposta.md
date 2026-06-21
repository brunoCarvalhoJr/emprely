# Spec - Acoes mobile na nova proposta

## Objetivo

Garantir que o fluxo de criacao/edicao de proposta no celular mantenha botoes de navegacao e salvamento sempre acessiveis.

## Criterios de aceite

- Em etapas intermediarias, a doca mobile deve exibir `Salvar` e `Proximo`.
- A partir da segunda etapa, deve exibir tambem `Anterior`.
- Na revisao, deve exibir `Anterior`, `Salvar rascunho` e `Gerar`.
- A doca nao deve ser coberta pela navegacao inferior mobile.
- O formulario deve ter espaco inferior suficiente para a doca fixa nao cobrir campos.

## Validacao

- `pnpm --filter web lint`
- `pnpm --filter web build`
- `pnpm --filter web test:e2e`

