# Spec - Remover descricoes dos cards do dashboard

## Visao geral

Simplificar os cards de metricas do dashboard removendo as frases inferiores.

## Escopo

Inclui:

- Remover detalhes textuais dos quatro cards superiores do dashboard.
- Manter titulo, numero e icone.

Fora do escopo:

- Alterar calculo das metricas.
- Alterar demais cards ou listas do dashboard.

## Fluxo ponta a ponta

1. Usuario abre o dashboard.
2. Cards superiores exibem titulo, valor e icone.
3. Nenhuma frase aparece abaixo dos valores.

## Requisitos

- Remover "Fechamentos confirmados".
- Remover "Pacotes reutilizaveis".
- Remover "Aguardando resposta".
- Remover "Prontas para finalizar".

## Regras de negocio

- Valores das metricas continuam os mesmos.

## Impactos por projeto

- API: nenhum.
- Web: `App.tsx`.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: nenhum.

## Criterios de aceite

- Os quatro cards do print nao mostram texto inferior.
- Lint e build do web passam.

## Estrategia de implementacao

- Remover o campo `detail` do tipo e dos objetos de metricas.
- Remover o elemento JSX que renderizava o detalhe.

## Testes

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
- Busca textual das frases removidas.
