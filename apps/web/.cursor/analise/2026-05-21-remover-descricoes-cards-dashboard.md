# Analise Web - Remover descricoes dos cards do dashboard

## Contexto

Os cards de metricas do dashboard estao com frases auxiliares abaixo dos numeros. O usuario quer remover essas frases para deixar a interface mais direta.

## Objetivo da tela/fluxo

Deixar os cards superiores do dashboard mais limpos e escaneaveis.

## Rotas impactadas

- Dashboard principal.

## Componentes impactados

- `DashboardContent`.
- `buildMetricasDashboard`.

## Formularios e validacao

- Nao se aplica.

## Dados e chamadas de API

- Queries e mutations sem mudanca.
- Apenas renderizacao local das metricas muda.

## Responsividade e acessibilidade

- Cards continuam com titulo textual, valor e icone.
- Remocao das frases reduz altura visual sem prejudicar leitura.

## Duvidas

- Nenhuma bloqueante.
