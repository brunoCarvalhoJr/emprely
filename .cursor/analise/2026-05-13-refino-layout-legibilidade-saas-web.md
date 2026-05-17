# Analise - Refino de layout e legibilidade do SaaS web

## Contexto

O usuario apontou que a tela atual do SaaS nao esta harmonica nem alinhada, especialmente no fluxo de nova proposta. A identidade visual Emprely deve ser mantida, mas a informacao precisa ser reorganizada para leitura mais clara e uso mais rapido.

## Problemas observados no print

- A tela de proposta divide formulario e preview com pesos visuais parecidos, fazendo o preview competir com o formulario mesmo quando a proposta ainda esta vazia.
- O formulario tem campos longos empilhados sem marcadores de etapa, o que reduz escaneabilidade.
- O bloco "Cliente da proposta" ocupa area grande para uma acao secundaria.
- A area de catalogo e itens nao comunica bem que o usuario esta montando a proposta por partes.
- O total e a acao de salvar aparecem no fim, mas sem uma barra de resumo suficientemente clara.
- O preview tem contraste forte no cabecalho e muitos elementos, ficando pesado para o estado inicial.
- Falta ritmo visual consistente entre card, secao, texto auxiliar e acoes.

## Direcao de UX

- Manter estilo Emprely: roxo, azul, teal, navy, cards claros e bordas suaves.
- Reorganizar a nova proposta como "builder" operacional: formulario principal mais largo e preview lateral mais compacto.
- Agrupar campos por etapa: cliente, conteudo, itens e fechamento.
- Reduzir ruido visual de textos auxiliares e melhorar contraste/espacamento.
- Tornar o preview um acompanhamento de leitura, nao o elemento principal da tela vazia.
- Melhorar responsividade sem mexer no contrato de API.

## Perguntas e decisoes

- Nao ha duvida bloqueante. A alteracao sera visual/UX, sem mudar regras de negocio.
- O preview continua existindo na tela de criacao porque ajuda a validar como a proposta vai sair.
- A refatoracao sera focada no web e validada com lint, build e e2e.
