# Analise Web - Identidade visual no SaaS web

## Contexto

O app web do SaaS Emprely esta funcional, mas a interface ainda e generica. A marca oficial foi fornecida em `D:\Emprely\Identidade Visual`, com logo, favicon e referencia visual.

## Objetivo da tela/fluxo

Aplicar a identidade visual em toda a experiencia principal do SaaS: autenticacao, shell, dashboard, clientes, servicos, propostas, conta e preview de proposta.

## Rotas impactadas

- `/`: SPA React/Vite unica.

## Componentes impactados

- `App`
- `AuthContent`
- `DashboardContent`
- `PrimeirosPassosDashboard`
- `ProntidaoMvpDashboard`
- `PreviewPropostaVisual`
- `CampoTexto`
- `CampoSelect`
- `CampoTextarea`
- `InfoLinha`
- `MensagemErro`
- `MensagemSucesso`

## Formularios e validacao

- Campos: os campos atuais de auth, conta, clientes, servicos e propostas.
- Regras: manter schemas Zod existentes.
- Mensagens: manter mensagens existentes para preservar fluxo e testes.

## Dados e chamadas de API

- Queries: manter `/api/me`, `/api/account/profile`, `/api/customers`, `/api/services`, `/api/proposals`.
- Mutations: manter auth, CRUDs, geracao, envio, aceite, recusa, duplicacao e arquivamento.
- Estados de loading/erro/vazio: reforcar visualmente sem alterar comportamento.

## Responsividade e acessibilidade

- Sidebar vira bloco navegavel em telas menores.
- Botoes preservam nomes acessiveis.
- Inputs mantem labels visiveis.
- Transicoes respeitam `prefers-reduced-motion`.
- Textos devem quebrar sem sobrepor botoes/cards.

## Duvidas

- Nenhuma duvida bloqueante para esta etapa.
