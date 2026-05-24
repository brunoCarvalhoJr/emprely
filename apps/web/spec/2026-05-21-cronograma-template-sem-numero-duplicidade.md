# Spec Web - Cronograma do template sem numero e duplicidade

## Visao geral

Refatorar o componente de cronograma exibido nos templates da proposta para remover numeracao visual, duplicidade de texto e alinhar o conteudo ao lado do icone.

## Comportamento

- Linhas simples do cronograma aparecem uma unica vez.
- Linhas no formato `Titulo: descricao` exibem somente a descricao no card.
- O icone fica a esquerda e o texto fica a direita.
- O selo `01`, `02` nao aparece mais nos templates de proposta.

## Componentes

- `DocumentoTimeline`

## Criterios de aceite

- O bloco de cronograma nao exibe mais contador visual.
- O texto nao aparece duplicado.
- O texto fica alinhado na frente do icone.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.
