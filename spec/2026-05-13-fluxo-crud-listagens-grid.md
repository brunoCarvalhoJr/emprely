# Spec - Fluxo CRUD com listagens em grid

## Objetivo

Separar o fluxo de clientes, servicos/pacotes e propostas em telas de CRUD com listagem como entrada principal.

## Regras

- Menu `Clientes` abre a grid de clientes.
- Menu `Servicos / Pacotes` abre a grid de servicos/pacotes.
- Menu `Propostas` abre a grid de propostas.
- Cada grid deve ter campo de busca, filtros quando aplicavel, paginacao e acao principal de criacao.
- A acao principal `Novo ...` deve ficar no cabecalho da pagina quando o modulo
  estiver em modo listagem.
- A acao `Voltar para lista` deve ficar no cabecalho da pagina nos modos de
  criacao, edicao ou visualizacao.
- Barras laterais ou barras operacionais nao devem conter `Voltar` nem `Novo`
  como navegacao principal.
- Cada linha deve permitir visualizar, editar e excluir/arquivar.
- Acoes de listagem com ate 3 itens devem usar somente icones com tooltip.
- Acoes de listagem com mais de 3 itens devem ser agrupadas em um botao de menu,
  com rotulos textuais apenas dentro do dropdown.
- O dropdown de acoes nao pode ser cortado pelo container da listagem; ele deve
  abrir acima da grid/tabela com posicionamento fixo ou portal e z-index alto.
- Ao abrir o dropdown, clique externo, tecla Escape, scroll e resize devem manter
  o menu em estado consistente, sem ficar preso visualmente na linha.
- Nas linhas de listagem, nao exibir como texto direto: `Visualizar`, `PDF`,
  `WhatsApp`, `Enviar`, `Editar`, `Duplicar` e `Excluir`.
- Criacao e edicao devem usar os formularios existentes.
- Visualizacao deve ser uma tela propria, read-only, com acoes para editar, excluir/arquivar e voltar para a listagem.

## Criterios de aceite

- Ao clicar no menu de cada modulo, a tela exibida e a listagem.
- A criacao nao aparece misturada com a listagem.
- A listagem segue o visual de tabela do print anexado no desktop.
- Em mobile, a grid deve virar cards legiveis.
- Fluxos existentes continuam passando no e2e.
