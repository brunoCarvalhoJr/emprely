# Spec: dashboard mobile com metricas compactas

## Objetivo

Melhorar a usabilidade do dashboard em telas mobile reduzindo a altura ocupada pelos cards de metricas sem perder clareza, toque e navegacao.

## Escopo

- Alterar somente a apresentacao das metricas do dashboard no app web.
- Manter as metricas e rotas/filtros atuais.
- Manter o layout desktop com a mesma estrutura geral.

## Comportamento

Em mobile, a lista de metricas deve ser exibida como grade compacta de duas colunas. Cada tile deve mostrar:

- valor numerico em destaque;
- rotulo da metrica em ate duas linhas;
- icone da categoria em tamanho reduzido;
- indicador discreto de acao.

Em desktop, os cards continuam em grid responsivo maior, preservando a leitura atual.

## Fora de escopo

- Alterar os nomes ou calculos das metricas.
- Alterar a ordem das metricas.
- Criar novos filtros.
- Redesenhar o restante do dashboard.

## Validacao tecnica

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
