# Spec - Revisao final com resumo amplo

## Arquivos

`src/App.tsx`
`src/styles.css`

## Comportamento esperado

- A etapa de revisao final deve usar a largura total do painel.
- O resumo deve exibir mais dados da proposta antes da acao de salvar/gerar.
- O layout deve continuar responsivo em telas menores.
- Os botoes atuais devem manter os mesmos comportamentos.
- Mensagens de bloqueio ou necessidade de salvar rascunho devem continuar visiveis.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
