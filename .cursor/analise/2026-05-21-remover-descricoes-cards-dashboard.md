# Analise - Remover descricoes dos cards do dashboard

## Contexto

Os cards de metricas do dashboard exibem uma frase abaixo do numero, como "Fechamentos confirmados", "Pacotes reutilizaveis", "Aguardando resposta" e "Prontas para finalizar". O pedido e simplificar esses cards removendo as frases inferiores.

## Objetivo

Deixar os cards do dashboard mais limpos, mantendo apenas titulo, valor e icone.

## Projetos impactados

- API: sem impacto.
- Web: dashboard em `apps/web/src/App.tsx`.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: sem impacto.

## Fluxo atual

Cada card de metrica recebe `label`, `value`, `detail`, `icon` e `tone`; o `detail` e renderizado abaixo do valor.

## Fluxo proposto

Remover o campo `detail` das metricas e remover a renderizacao da frase inferior.

## Regras de negocio

- Os numeros e rotulos principais permanecem inalterados.
- A alteracao e somente visual.

## Impactos tecnicos

- Ajustar tipo `DashboardMetrica`.
- Ajustar `DashboardContent`.
- Ajustar `buildMetricasDashboard`.

## Riscos

- Nenhum risco funcional relevante.

## Duvidas

- Nenhuma bloqueante.
