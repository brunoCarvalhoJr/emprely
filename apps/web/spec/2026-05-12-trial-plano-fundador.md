# Spec Web - Trial e Plano Fundador

## Visao geral

Adicionar uma area de plano na tela de conta para mostrar trial, status comercial e ativar manualmente o Plano Fundador. Atualizar tambem o resumo da sessao para indicar o plano atual.

## Rotas

- `/`: SPA React, view `conta`.

## Estados da interface

- Carregando: manter o carregamento atual do perfil; plano usa dados ja carregados de auth ou `/me`.
- Vazio: se a conta ainda nao tiver campos comerciais no cache, mostrar `Trial` como fallback.
- Erro: mostrar erro da mutation de ativacao.
- Sucesso: mostrar mensagem `Plano Fundador ativado.` e atualizar cache de `/me`.

## Componentes

- Card `Plano e acesso` na lateral da view `conta`.
- Resumo da sessao com linha `Plano`.
- Lista de endpoints em `AuthContent` deve incluir `POST /api/account/activate-founder`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- Criar `activatePlanoFundador(token)` em `src/lib/api.ts`.
- Atualizar `ContaAtualResponse` em `src/types/auth.ts`.
- Ao ativar, atualizar `authUsuario` e cache `["usuario-atual", accessToken]`.

## Criterios de aceite

- Conta em trial mostra dias restantes e data final.
- Conta em trial mostra CTA para ativar Plano Fundador.
- Conta fundador mostra data de ativacao e nao mostra CTA de ativacao.
- Conta fundador nao mostra marca d'agua `Emprely Trial` no preview/print da proposta.
- Tela nao quebra se o usuario estiver autenticado por token salvo e os dados vierem de `/me`.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais:
  - Login, abrir Conta, ver estado comercial.
  - Ativar Plano Fundador e conferir atualizacao do card.
