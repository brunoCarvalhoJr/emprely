# Spec Web - Ativacao Fundador Admin

## Visao geral

Impedir que o cliente final acione Plano Fundador pelo web enquanto nao existe checkout/billing real.

## Rotas

- Aplicacao principal.

## Estados da interface

- Carregando: sem alteracao.
- Vazio: sem alteracao.
- Erro: sem erro de autoativacao.
- Sucesso: sem mensagem de autoativacao.

## Componentes

- Bloco de bloqueio comercial em propostas.
- Bloco de plano/acesso.
- Lista de endpoints tecnicos.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- Remover chamada `POST /api/account/activate-founder`.
- Web nao chama endpoint admin.

## Criterios de aceite

- Nao existe botao de autoativacao Fundador no web.
- Build e E2E continuam passando.
- Mensagens indicam ativacao manual interna.

## Testes

- Lint: `pnpm --dir apps/web lint`
- Build: `pnpm --dir apps/web build`
- E2E: `pnpm --dir apps/web test:e2e`
