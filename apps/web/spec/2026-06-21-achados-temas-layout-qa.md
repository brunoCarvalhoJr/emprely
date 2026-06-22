# Spec - Correcoes dos achados tema/layout/QA

## Objetivo

Resolver os achados da bateria Playwright claro/escuro de 2026-06-21.

## Requisitos

1. No tema escuro, cards de template do wizard devem usar superficie escura e texto legivel.
2. No mobile, a doca do wizard deve exibir `Proximo` sem mojibake.
3. No mobile, a revisao deve exibir acao de rascunho sem corte visual.
4. No desktop, o usuario deve conseguir ler nome da conta/e-mail completos a partir do menu da conta.
5. A bateria QA full deve aceitar tema e registrar progresso incremental.

## Fora de escopo

- Mudar contratos de API.
- Alterar banco de dados.
- Recriar todo o sistema de testes.

## Validacao

- `pnpm --filter web lint`
- `pnpm --filter web build`
- `pnpm test:e2e:web`
- Execucao Playwright visual dos pontos corrigidos.
