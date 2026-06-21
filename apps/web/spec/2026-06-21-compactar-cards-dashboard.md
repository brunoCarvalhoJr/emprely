# Spec Web - Cards compactos de metricas do dashboard

## Objetivo

Melhorar a densidade visual dos cards de metricas do dashboard para que eles
ocupem uma unica linha no desktop e deixem a tela mais objetiva.

## Escopo

- Ajustar a grade dos cards de metricas.
- Reduzir padding, altura, tamanho de numero e tamanho do icone.
- Usar labels curtas para impedir corte visual.
- Ordenar os cards pelo fluxo operacional e comercial.
- Manter os cards clicaveis e com foco acessivel.
- Preservar o layout responsivo mobile.

## Fora de escopo

- Alterar nomes ou regras das metricas.
- Alterar API, banco ou filtros de status.
- Redesenhar o dashboard completo.

## Aceite

1. Em desktop largo, os sete cards aparecem em uma unica linha.
2. Os cards ficam mais compactos do que o layout anterior.
3. Labels devem aparecer completas, sem ellipsis ou corte no desktop.
4. Valores e icones continuam legiveis.
5. Em mobile, a grade continua usavel em duas colunas.
6. A ordem visual deve ser: Clientes, Servicos, Rascunhos, Geradas, Enviadas,
   Aceitas e Recusadas.
