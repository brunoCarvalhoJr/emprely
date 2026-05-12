# Analise Web - Conversao de Next.js para Vite React

## Contexto

O scaffold inicial usou Next.js porque o plano original citava Next.js. O usuário esclareceu que esperava ReactJS puro.

## Objetivo da tela/fluxo

Converter `apps/web` para React com Vite sem alterar o restante do monorepo.

## Rotas impactadas

- Removido App Router do Next.js.
- Mantida tela inicial única em React/Vite.

## Componentes impactados

- `src/App.tsx`: shell inicial do Emprely Orçamentos.
- `src/main.tsx`: entrada React com TanStack Query.
- `src/styles.css`: Tailwind e tokens CSS.

## Dados e chamadas de API

Ainda não há chamadas reais de API. TanStack Query fica configurado para incrementos futuros.

## Riscos

- Perda de recursos próprios de Next.js, como SSR/SSG e App Router.
- Landing continua externa, então SEO do SaaS web não é prioridade nesta etapa.

## Dúvidas resolvidas

- Web deve ser ReactJS puro com Vite.
