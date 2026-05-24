# Spec Web - Refatoracao de grids responsivas

## Visao geral

Refatorar as grids do sistema para reduzir rolagem horizontal e melhorar a proporcao das colunas.

## Rotas

- `/` no app autenticado, incluindo dashboard, clientes, servicos e propostas.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: sem mudanca.
- Erro: sem mudanca.
- Sucesso: sem mudanca.
- Lista: tabela responsiva no desktop e cards em larguras menores.

## Componentes

- `data-table`
- `ListagemAcoes`
- Listagens de clientes, servicos, propostas e propostas recentes.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- Sem alteracao.

## Criterios de aceite

- A grid de propostas nao cria barra horizontal artificial.
- `Tipo` em propostas fica compacta.
- `Cliente` segue como coluna principal.
- Acoes nao quebram nem sobrepoem.
- Em telas menores, a tabela vira cards legiveis.

## Testes

- Lint: `pnpm.cmd --dir apps/web lint`
- Build: `pnpm.cmd --dir apps/web build`
- Cenarios manuais: propostas desktop, propostas mobile, clientes e servicos.
