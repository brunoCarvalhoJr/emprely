# Spec Web - Acoes da revisao de proposta a direita

## Visao geral

Na revisao final da proposta, as acoes de conclusao devem ficar alinhadas ao lado direito do rodape, enquanto `Voltar` permanece no lado esquerdo.

## Regras

- `Voltar` deve continuar sendo o primeiro botao e deve ficar isolado a esquerda em desktop.
- `Visualizar Proposta`, `Salvar rascunho` e `Gerar proposta` devem ficar agrupados a direita em desktop.
- A ordem dos botoes do grupo direito deve ser: visualizar, salvar rascunho, gerar proposta.
- Em telas pequenas, os botoes podem ocupar largura total e empilhar para manter legibilidade.

## Criterios de aceite

- Em desktop, o rodape da revisao mostra `Voltar` a esquerda e as demais acoes a direita.
- Em mobile, os botoes nao causam rolagem horizontal nem texto cortado.
- `pnpm --dir apps/web lint` e `pnpm --dir apps/web build` devem passar.
