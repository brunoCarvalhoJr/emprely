# Analise: dashboard mobile com metricas compactas

## Contexto

Na visao mobile do dashboard, os cards de metricas estavam sendo exibidos em coluna unica com altura alta, icones grandes e muito espaco vazio. Em telas pequenas, isso empurrava informacoes importantes para baixo e fazia o usuario rolar demais antes de chegar em propostas recentes ou proximos passos.

## Problema

- Cada metrica ocupava quase um bloco inteiro de tela.
- A hierarquia visual favorecia o card, nao o numero.
- O usuario precisava escanear verticalmente varios cards para comparar indicadores simples.
- A navegacao inferior fixa reduzia ainda mais a area util percebida.

## Decisao de UX

Transformar as metricas em tiles compactos apenas no mobile:

- grade de 2 colunas;
- numero em destaque no topo visual do tile;
- rotulo menor com limite de 2 linhas;
- icone menor no canto superior;
- seta discreta indicando que o tile continua clicavel;
- preservar o layout desktop existente.

## Criterios de aceite

- As metricas devem ocupar menos altura no mobile.
- Os numeros devem continuar legiveis.
- Os rotulos nao devem estourar o card.
- O card deve continuar sendo clicavel para navegar/filtar.
- O desktop nao deve perder a apresentacao atual.

## Validacao

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
