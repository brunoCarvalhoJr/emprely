# Spec - Contraste do tema escuro

## Objetivo

Garantir que textos e controles principais fiquem legiveis no tema escuro em mobile e desktop.

## Escopo

- Ajustar CSS do tema escuro.
- Corrigir titulos/cards do dashboard e blocos de onboarding/primeiros passos.
- Validar as telas principais em tema claro e escuro.

## Criterios de aceite

- No dashboard mobile escuro, os textos "Crie sua primeira proposta profissional em minutos" e "Fluxo guiado para sua primeira proposta" devem ficar claros e legiveis.
- Cards de primeiros passos devem manter titulo, descricao, status e botoes legiveis no dark theme.
- A cor dos textos no tema claro nao deve mudar visualmente.
- `pnpm --filter web lint`, `pnpm --filter web build` e `pnpm --filter web test:e2e` devem passar.

## Fora de escopo

- Alterar estrutura de dados, API ou banco.
- Refazer identidade visual do tema escuro.
- Mudar fluxo de onboarding ou conteudo textual.

