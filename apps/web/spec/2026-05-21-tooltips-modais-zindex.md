# Spec - Tooltips em modais

## Arquivos

`src/styles.css`

## Comportamento esperado

- Tooltips dos botoes em modais devem aparecer inteiros.
- Tooltips do cabecalho do modal devem ficar acima do conteudo do modal.
- Tooltips fora de modais devem manter a posicao atual.
- A solucao deve funcionar em desktop e mobile.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
