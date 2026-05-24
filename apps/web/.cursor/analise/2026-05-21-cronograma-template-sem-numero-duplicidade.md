# Analise Web - Cronograma do template sem numero e duplicidade

## Contexto

No documento da proposta, o bloco de cronograma usa o componente `DocumentoTimeline`. Em alguns templates ele estava configurado como numerado, exibindo `01`, `02` conforme a posicao de cada linha do cronograma.

## Problema

Para o template em uso, o selo numerico gera duvida visual e nao adiciona valor quando ha apenas um item. O componente tambem exibia o mesmo texto duas vezes quando a linha nao seguia o formato `Titulo: descricao`.

## Objetivo

Simplificar o card de cronograma:

- remover o selo numerico;
- posicionar o texto ao lado do icone;
- renderizar apenas um texto dentro do card;
- manter suporte a linhas no formato `Titulo: descricao`, usando apenas a descricao visivel quando existir.

## Area impactada

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- Templates de proposta que usam `DocumentoTimeline`

## Decisoes

- O cronograma nao deve inventar ou duplicar conteudo.
- A leitura deve ser horizontal e direta: icone a esquerda, texto a direita.
