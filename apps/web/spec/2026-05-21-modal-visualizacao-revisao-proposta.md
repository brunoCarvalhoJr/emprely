# Spec - Modal de visualizacao na revisao da proposta

## Arquivos

- `src/App.tsx`
- `src/styles.css`

## Comportamento esperado

- A etapa de revisao mostra apenas o resumo de cliente, template, itens e total.
- O botao `Visualizar Proposta` abre uma modal com `PreviewPropostaVisual`.
- O botao fica antes de `Salvar rascunho`.
- O preview embutido do lado direito nao aparece mais na revisao.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
