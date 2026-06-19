# Analise - Remover subtitulo de propostas recentes

## Contexto

Na tela de dashboard, a secao "Propostas recentes" exibe o subtitulo "Acompanhe o status e volte rapido para o historico.". O pedido e remover esse dizer e manter apenas o titulo.

## Objetivo

Simplificar o cabecalho da secao de propostas recentes.

## Projetos impactados

- API: sem impacto.
- Web: dashboard em `apps/web/src/App.tsx`.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: sem impacto.

## Fluxo atual

O cabecalho da lista de propostas recentes mostra titulo e subtitulo.

## Fluxo proposto

Mostrar apenas o titulo "Propostas recentes".

## Regras de negocio

- Nenhuma regra funcional muda.

## Impactos tecnicos

- Remover o paragrafo do JSX.

## Riscos

- Nenhum risco funcional relevante.

## Duvidas

- Nenhuma bloqueante.
