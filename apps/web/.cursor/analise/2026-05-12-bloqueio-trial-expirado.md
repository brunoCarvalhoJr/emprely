# Analise Web - Bloqueio por trial expirado

## Contexto

O web mostra plano, trial e permite ativar Plano Fundador. O usuario ainda consegue acionar botoes de gerar, imprimir/PDF, WhatsApp e marcar enviada se houver proposta gerada, mesmo quando o trial estiver expirado.

## Objetivo da tela/fluxo

Bloquear acoes comerciais de saida da proposta quando o trial estiver expirado, mantendo historico, edicao e acompanhamento de propostas ja enviadas.

## Rotas impactadas

- SPA React em `/`, view `propostas` e view `conta`.

## Componentes impactados

- `App.tsx`
- Cliente API existente de propostas
- Helpers de plano/conta

## Formularios e validacao

- Campos: nenhum novo campo.
- Regras:
  - Botao `Gerar proposta` desabilitado se trial expirado.
  - `Imprimir/PDF`, `Abrir WhatsApp` e `Marcar enviada` desabilitados se trial expirado.
  - `Aceita` e `Recusada` continuam liberados para propostas ja enviadas.

## Dados e chamadas de API

- Queries: usa `conta.statusComercial` vindo de `/api/me`.
- Mutations: `POST /api/proposals/{id}/generate` tambem pode retornar `403`.
- Estados de loading/erro/vazio:
  - Banner orienta ativar Plano Fundador.
  - Erro da API continua aparecendo no `MensagemErro`.

## Responsividade e acessibilidade

- Banners devem ser visiveis em mobile e desktop.
- Links desabilitados devem usar `aria-disabled`.
- Botoes desabilitados devem ter `title` explicativo.

## Duvidas

- Confirmar futuramente se a criacao de novos rascunhos deve continuar liberada depois do trial.
