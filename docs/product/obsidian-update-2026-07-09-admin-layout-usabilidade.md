# Obsidian update - Layout do painel admin

Data: 2026-07-09

## Mudanca

O painel `/admin` foi refatorado para melhorar usabilidade e reduzir a tela longa e espremida.

## Implementado

- Navegacao por secoes: Usuarios, Seguranca, Administradores e Emails.
- A secao Usuarios agora concentra metricas, filtros, acoes, tabela/lista e detalhe do usuario.
- Seguranca, Administradores e Emails nao ficam mais empilhados abaixo da tabela de usuarios.
- O detalhe do usuario aparece apenas na secao Usuarios.
- Em telas menores, a lista de usuarios usa cards em vez de depender apenas de tabela com rolagem horizontal.
- A aba ativa ficou visualmente mais clara.

## Validacao

- `pnpm lint:web`: passou.
- `pnpm web:build:beta`: passou.
- Capturas locais geradas em `.artifacts/admin-layout-auth-desktop.png` e `.artifacts/admin-layout-auth-mobile.png`.

## Observacao

Nao houve mudanca de regra de negocio, permissao ou endpoint.
