# Analise - Label do catalogo na proposta

## Ideia

Alterar a label do seletor de servicos na etapa de itens da proposta.

## Contexto

Na etapa 3 do cadastro de proposta, o campo de selecao de servico salvo aparece como "Adicionar do catalogo". O pedido e trocar para "Selecionar do catalogo" para deixar claro que o campo seleciona um item, enquanto o botao separado executa a acao de adicionar.

## Decisao

- Trocar apenas a label do `CampoSelect`.
- Manter o botao "Adicionar", pois ele representa a acao final de incluir o servico na proposta.

## Duvidas

Nao ha duvidas bloqueantes.
