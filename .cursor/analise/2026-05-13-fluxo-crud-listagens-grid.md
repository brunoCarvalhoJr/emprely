# Analise - Fluxo CRUD com listagens em grid

## Contexto

O usuario pediu para alterar o fluxo das telas de propostas, clientes e servicos/pacotes. Ao clicar no menu principal dessas areas, a primeira tela deve ser sempre a grid/listagem, com busca, filtros e botao para criar novo registro. A partir da grid, o usuario deve poder visualizar, editar, criar e excluir/arquivar itens.

## Estado atual

- `apps/web/src/App.tsx` concentra o fluxo do SaaS em uma unica tela React.
- Clientes, servicos e propostas ja possuem formularios, listagens filtradas, paginacao, criacao, edicao e arquivamento.
- A tela atual mistura formulario e listagem lado a lado, entao o clique no menu nao leva para uma listagem pura.
- A listagem de clientes e servicos usa cards, enquanto o usuario pediu uma grid parecida com o layout de propostas recentes.

## Decisoes

- Manter os endpoints e mutations atuais.
- Criar estados de modo por modulo: listagem, criacao, edicao e visualizacao.
- O menu principal sempre limpa selecao e abre o modo `lista`.
- Botoes `Novo cliente`, `Novo servico/pacote` e `Nova proposta` abrem modo de criacao.
- Acoes de cada linha: visualizar, editar e arquivar/excluir.
- Usar `Arquivar` como exclusao funcional, pois o backend atual implementa delete/arquivamento logico.

## Atualizacao 2026-05-15 - acoes por icones

- O usuario pediu para remover textos diretos nas acoes das listagens.
- As listagens afetadas no web sao: clientes, servicos/pacotes, propostas e
  propostas recentes do dashboard.
- Regra adotada:
  - ate 3 acoes: renderizar somente icones com tooltip;
  - acima de 3 acoes: renderizar um icone de menu e exibir os nomes apenas no
    dropdown.
- Os textos `Visualizar`, `PDF`, `WhatsApp`, `Enviar`, `Editar`, `Duplicar` e
  `Excluir` nao devem aparecer diretamente nas linhas das listagens.

## Atualizacao 2026-05-15 - dropdown fora do overflow

- O menu de acoes com mais de 3 itens estava sendo cortado pelo container com
  scroll horizontal/vertical da listagem.
- A correcao deve ser aplicada no componente compartilhado de acoes para cobrir
  todas as listagens de uma vez.
- O dropdown precisa ser renderizado fora do container da tabela, com
  posicionamento fixo sobre a tela e z-index alto, preservando clique externo,
  fechamento por Escape e reposicionamento em scroll/resize.

## Atualizacao 2026-05-15 - padrao Voltar e Novo

- As acoes `Novo` e `Voltar para lista` sao navegacao de pagina, nao acoes
  operacionais de linha ou da barra lateral da proposta.
- Padrao adotado:
  - modo lista: o botao `Novo ...` fica no canto direito do cabecalho da pagina;
  - modo visualizacao/edicao/criacao: o botao `Voltar para lista` fica no canto
    direito do cabecalho da pagina;
  - quando fizer sentido iniciar outro cadastro a partir de uma edicao, o
    `Novo ...` tambem fica no cabecalho como acao secundaria;
  - a barra lateral direita da proposta fica restrita a acoes do documento em
    edicao: salvar, preview, template, cliente rapido, compartilhar e status.

## Perguntas

Sem duvidas bloqueantes. O comportamento de excluir sera mantido como arquivar, preservando o modelo atual do MVP.
