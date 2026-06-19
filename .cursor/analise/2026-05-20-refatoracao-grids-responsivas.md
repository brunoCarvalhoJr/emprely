# Analise - Refatoracao de grids responsivas

## Contexto

O usuario apontou que as grids do sistema estao criando barra de rolagem horizontal mesmo quando ha espaco visual suficiente. No print da listagem de propostas, a coluna `Tipo` ocupa espaco demais e a tabela passa da largura disponivel.

## Objetivo

Refatorar o comportamento visual das listagens para distribuir colunas de forma proporcional, reduzir colunas secundarias e evitar scroll horizontal sempre que o conteudo couber responsivamente.

## Projetos impactados

- API: nao impactada.
- Web: listagens de clientes, servicos/pacotes, propostas e propostas recentes.
- Mobile: nao impactado.
- Landing: nao impactada.
- Packages: nao impactados.
- Infra: nao impactada.

## Fluxo atual

- As tabelas usam `table-layout: fixed`.
- Parte das colunas usa largura percentual.
- A coluna de acoes ainda usa largura fixa em `rem`.
- A soma de percentuais mais largura fixa pode passar de 100%, gerando barra horizontal.
- O breakpoint que transforma tabela em cards existe, mas so entra em telas menores.

## Fluxo proposto

- Cada grid deve ter colunas que somam 100% no desktop.
- Colunas secundarias como `Tipo`, `Status` e `Data` devem ser compactas.
- Colunas principais como cliente/servico continuam recebendo a maior area.
- Em larguras intermediarias, tabelas viram cards antes de exigir rolagem horizontal.
- Conteudos longos quebram linha de forma controlada.

## Regras de negocio

- Nenhuma regra de dominio sera alterada.
- Acoes e paginacao permanecem iguais.
- Ajuste deve ser somente visual/responsivo.

## Impactos tecnicos

- Alterar CSS compartilhado `data-table`.
- Adicionar classes auxiliares para wrapper de grid.
- Atualizar wrappers de tabelas no `App.tsx`.

## Riscos

- Acoes com muitos icones precisam de espaco minimo para nao sobrepor.
- Em cards mobile, labels e valores precisam continuar legiveis.

## Duvidas

- Sem duvidas bloqueantes.
