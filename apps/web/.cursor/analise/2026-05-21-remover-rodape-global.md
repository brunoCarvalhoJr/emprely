# Analise - Remover rodape global

## Componente afetado

`src/App.tsx` e `src/styles.css`.

## Contexto tecnico

O rodape e renderizado pelo componente `FooterAplicacao` no shell principal da aplicacao. A remocao da chamada remove o bloco de todas as views internas.

## Decisao

Remover a renderizacao global e limpar o componente/estilos exclusivos para evitar codigo morto.
