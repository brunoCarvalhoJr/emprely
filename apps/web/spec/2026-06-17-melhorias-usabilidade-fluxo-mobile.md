# Spec - Melhorias de usabilidade do fluxo mobile

## Objetivo

Ajustar a experiencia mobile do webapp autenticado para reduzir atrito no fluxo principal: criar proposta.

## Comportamento esperado

- `Nova proposta` abre fluxo com etapas claras.
- O usuario escolhe template numa etapa propria.
- O detalhe comercial continua disponivel como etapa opcional apos template.
- A revisao mostra resumo e mantem botoes importantes acessiveis.
- Mobile mostra somente o toast mais recente.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
- Auditoria Playwright mobile do fluxo completo.
