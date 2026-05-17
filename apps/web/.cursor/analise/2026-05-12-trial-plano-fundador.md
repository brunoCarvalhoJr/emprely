# Analise Web - Trial e Plano Fundador

## Contexto

O web ja possui tela operacional para dashboard, clientes, servicos, propostas e configuracao da conta. O usuario precisa enxergar o estado comercial do SaaS e ativar o Plano Fundador manualmente no MVP.

## Objetivo da tela/fluxo

Exibir na tela de conta e no resumo da sessao o plano atual, status comercial, prazo do trial e botao de ativacao do Plano Fundador quando a conta estiver em trial.

## Rotas impactadas

- SPA React em `/`, view interna `conta`.

## Componentes impactados

- `App.tsx`
- `InfoLinha`
- `AuthContent`
- Cliente API em `src/lib/api.ts`
- Tipos de auth em `src/types/auth.ts`

## Formularios e validacao

- Campos: nenhum novo formulario.
- Regras: botao de ativacao deve ficar desabilitado durante a mutation.
- Mensagens: sucesso em ativacao e erro vindo da API.

## Dados e chamadas de API

- Queries:
  - `GET /api/me` passa a retornar conta com estado comercial.
- Mutations:
  - `POST /api/account/activate-founder`.
- Estados de loading/erro/vazio:
  - Botao mostra `Ativando...` durante a mutation.
  - Mensagem de erro aparece no card de plano.
  - Se os campos vierem ausentes por cache antigo, a UI deve exibir fallback sem quebrar.

## Responsividade e acessibilidade

- Card de plano deve funcionar na coluna lateral em desktop e empilhar no mobile.
- Botao deve manter foco, estado disabled e texto claro.

## Duvidas

- Confirmar futuramente se a ativacao manual sera substituida por checkout externo.
- Confirmar se trial expirado deve bloquear propostas ou apenas alertar no MVP.
