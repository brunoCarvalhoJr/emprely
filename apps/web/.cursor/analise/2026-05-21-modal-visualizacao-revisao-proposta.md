# Analise - Modal de visualizacao na revisao da proposta

## Componente afetado

`src/App.tsx` e `src/styles.css`.

## Contexto tecnico

O editor de propostas ja possui estado de modal `propostaPreviewModalAberto` e renderiza `PreviewPropostaVisual` com os dados atuais do formulario. A revisao tambem renderizava esse componente embutido no lado direito.

## Decisao

Reaproveitar a modal existente para visualizacao sob demanda e remover a renderizacao fixa da revisao. A etapa fica focada no resumo e nas acoes.
