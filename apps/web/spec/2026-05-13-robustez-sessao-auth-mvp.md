# Spec Web - Robustez sessao auth MVP

## Visao geral

Garantir que o usuário não fique preso em estado autenticado inválido durante o beta.

## Rotas

- Aplicacao principal.

## Estados da interface

- Carregando: sem alteracao.
- Vazio: sem alteracao.
- Erro: `Sessao expirada. Entre novamente.` para sessao invalida.
- Sucesso: login/cadastro salvam sessao completa.

## Componentes

- `AuthContent`.
- Header de sessão.
- Cliente HTTP compartilhado.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- `401` em chamada autenticada dispara evento interno de sessao invalida.
- Login/cadastro sem token nao disparam esse evento.

## Criterios de aceite

- Sessao vencida em storage e removida no carregamento.
- Logout limpa token, cache e formularios.
- E2E cobre sessao vencida.
- Build/lint continuam passando.

## Testes

- Lint: `pnpm --dir apps/web lint`
- Build: `pnpm --dir apps/web build`
- E2E: `pnpm --dir apps/web test:e2e`
