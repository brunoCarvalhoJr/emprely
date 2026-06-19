# Analise - Modal de visualizacao na revisao da proposta

## Ideia

Simplificar a etapa de revisao da proposta removendo o preview embutido do lado direito e deixando a visualizacao do template final sob demanda em uma modal.

## Contexto

A etapa de revisao exibia um resumo dos dados no lado esquerdo e o documento renderizado no template no lado direito. Esse preview ocupa muito espaco e cria rolagem dentro da propria etapa.

## Decisao

- Manter na revisao apenas o resumo de dados ja existente.
- Remover o preview embutido do lado direito.
- Adicionar o botao `Visualizar Proposta` antes de `Salvar rascunho`.
- Reaproveitar a modal de preview do editor para exibir o documento no template final, igual ao que sera compartilhado ou impresso.

## Duvidas

Nao ha duvidas bloqueantes. A proposta visualizada usa os dados atuais do formulario, mesmo antes de salvar.
