# Analise - Layout compacto dos itens da proposta

## Contexto

A etapa "Itens e servicos" do cadastro de proposta exibe cada item em blocos altos, com fundo branco muito proximo do painel principal. Com dois ou mais itens, a leitura fica pouco distinta e ocupa mais altura do que o necessario.

## Decisao

Refatorar apenas a apresentacao dos itens adicionados:

- criar uma superficie de lista para separar o conjunto de itens do fundo da etapa;
- dar mais contraste ao cartao de cada item com borda, sombra e faixa visual discreta;
- mover o total do item para o cabecalho do cartao;
- reduzir espacos internos e altura da descricao;
- trocar a acao textual de remocao por botao iconico com lixeira, mantendo `aria-label` e tooltip.

## Fora de escopo

- Nao alterar regras de calculo dos itens.
- Nao alterar schema da proposta.
- Nao alterar a persistencia ou API.
