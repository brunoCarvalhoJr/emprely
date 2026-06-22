# Analise - Paginacao em propostas recentes do dashboard

## Contexto

O dashboard exibe a tabela `Propostas recentes` como resumo operacional da conta. Hoje a tabela mostra apenas um recorte fixo das propostas e nao informa quantidade exibida, total de itens ou controles de navegacao.

## Problema

- O usuario nao sabe quantas propostas existem a partir da tabela inicial.
- Quando a conta cresce, o dashboard perde utilidade porque o usuario precisa abrir `Ver todas` para navegar por mais itens.
- Falta consistencia com as listagens de Clientes, Servicos e Propostas, que ja possuem paginacao, seletor de tamanho e contador.

## Decisao de UX

Adicionar paginacao local em `Propostas recentes`, usando o componente `PaginacaoLista` existente.

O dashboard continua sendo um resumo, nao uma tela completa de filtro. Por isso:

- manter `Ver todas` para busca, filtros por status e acoes completas;
- permitir navegar pelos registros recentes dentro do painel;
- usar tamanho inicial pequeno para preservar a densidade do dashboard;
- manter contador `Mostrando X-Y de N propostas`.

## Criterios de aceite

- `Propostas recentes` mostra contador de itens quando houver propostas.
- Usuario pode trocar tamanho da pagina.
- Usuario pode navegar entre paginas da tabela inicial.
- `Ver todas` continua levando para a tela completa de propostas.
- Estado vazio continua aparecendo quando nao houver propostas.
