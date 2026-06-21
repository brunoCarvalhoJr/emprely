# Spec - Remover subtitulo de propostas recentes

## Visao geral

Remover o subtitulo da secao "Propostas recentes" na tela de dashboard.

## Escopo

Inclui:

- Remover "Acompanhe o status e volte rapido para o historico."
- Manter o titulo "Propostas recentes".

Fora do escopo:

- Alterar lista, filtros ou acoes de propostas.

## Fluxo ponta a ponta

1. Usuario abre dashboard.
2. A secao mostra apenas "Propostas recentes".

## Requisitos

- O texto removido nao deve aparecer no dashboard.

## Regras de negocio

- Sem mudanca.

## Impactos por projeto

- API: nenhum.
- Web: `App.tsx`.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: nenhum.

## Criterios de aceite

- O titulo permanece.
- O subtitulo nao aparece mais.

## Estrategia de implementacao

- Remover o paragrafo abaixo do h2 no dashboard.

## Testes

- Busca textual.
- Lint do web.
