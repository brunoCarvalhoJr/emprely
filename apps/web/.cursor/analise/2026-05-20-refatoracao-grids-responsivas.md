# Analise Web - Refatoracao de grids responsivas

## Contexto

As listagens em `apps/web` usam tabelas com wrappers `overflow-x-auto`. A combinacao de colunas percentuais e largura fixa da coluna de acoes gera overflow horizontal em cenarios onde a tabela deveria caber.

## Objetivo da tela/fluxo

Deixar as grids operacionais mais responsivas, com colunas proporcionais por entidade e conversao para cards em larguras menores.

## Rotas impactadas

- Dashboard.
- Clientes.
- Servicos / Pacotes.
- Propostas.

## Componentes impactados

- Tabelas renderizadas em `App.tsx`.
- `ListagemAcoes` indiretamente, por ocupar a coluna de acoes.
- CSS compartilhado `.data-table`.

## Formularios e validacao

- Campos: nao ha campos novos.
- Regras: nao ha alteracao.
- Mensagens: nao ha alteracao.

## Dados e chamadas de API

- Queries: sem mudanca.
- Mutations: sem mudanca.
- Estados de loading/erro/vazio: sem mudanca.

## Responsividade e acessibilidade

- Desktop: tabela sem overflow quando as colunas cabem.
- Tablet/mobile: cards por linha, labels preservadas via `data-label`.
- Acoes continuam acessiveis por icone/menu.

## Duvidas

- Sem duvidas bloqueantes.
