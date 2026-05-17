# Spec - Refino de layout e legibilidade do SaaS web

## Objetivo

Melhorar a harmonia visual, alinhamento e legibilidade do SaaS web, mantendo a identidade visual Emprely e priorizando o fluxo de criacao de proposta.

## Escopo

- Refatorar a composicao da tela de nova/editar proposta.
- Ajustar hierarquia visual do formulario e do preview.
- Criar classes CSS de layout para builder de proposta, secoes, resumo e preview compacto.
- Melhorar legibilidade de campos, textos auxiliares, cards e acoes.
- Manter navegacao, chamadas de API, validacoes e contratos existentes.

## Criterios de aceite

- Formulario de proposta fica visualmente agrupado por etapas.
- Preview lateral fica mais compacto e nao compete com a criacao da proposta.
- Total e acao principal ficam mais claros no fluxo.
- Layout se mantem responsivo em desktop e mobile.
- `pnpm lint:web`, `pnpm build:web` e e2e web continuam passando.
