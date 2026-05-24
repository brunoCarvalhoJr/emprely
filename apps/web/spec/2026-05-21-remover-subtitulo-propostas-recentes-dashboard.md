# Spec Web - Remover subtitulo de propostas recentes

## Visao geral

Remover o texto auxiliar abaixo do titulo "Propostas recentes".

## Rotas

- Dashboard.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: sem mudanca.
- Erro: sem mudanca.
- Sucesso: apenas titulo no cabecalho da secao.

## Componentes

- `DashboardContent`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- Sem mudanca.

## Criterios de aceite

- "Propostas recentes" continua aparecendo.
- "Acompanhe o status e volte rapido para o historico." nao aparece mais.

## Testes

- Busca textual.
- Lint do web.
