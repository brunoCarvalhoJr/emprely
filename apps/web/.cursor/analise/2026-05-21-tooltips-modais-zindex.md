# Analise - Tooltips em modais

## Contexto

Os botoes com icones usam tooltips via pseudo-elemento. Em modais, alguns tooltips eram exibidos acima do botao e acabavam recortados pelo topo do dialog, principalmente quando o modal tinha `overflow: hidden`.

## Decisao

Ajustar a regra dos tooltips dentro de modais para:

- aparecer abaixo dos botoes do cabecalho;
- ter `z-index` acima do conteudo interno do modal;
- evitar recorte pelo topo do dialog;
- manter o comportamento atual fora de modais.

## Fora de escopo

- Nao trocar o sistema de tooltip por portal JavaScript.
- Nao alterar acoes, textos ou layout dos botoes.
