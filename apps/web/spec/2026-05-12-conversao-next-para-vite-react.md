# Spec Web - Conversao de Next.js para Vite React

## Visão geral

Substituir o scaffold Next.js do `apps/web` por React puro com Vite, mantendo TypeScript, Tailwind, TanStack Query, React Hook Form, Zod e lucide-react.

## Escopo

Inclui:

- Remover `next`, `eslint-config-next`, `next.config.ts`, `next-env.d.ts` e estrutura `src/app`.
- Adicionar `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite` e configuração ESLint compatível.
- Criar `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx` e `src/styles.css`.
- Atualizar documentação que citava Next.js no web.

Fora do escopo:

- Criar roteamento interno com React Router.
- Alterar API, mobile, landing ou packages.
- Implementar features reais do MVP.

## Critérios de aceite

- `pnpm lint:web` passa.
- `pnpm build:web` passa.
- `pnpm dev:web` sobe Vite e a tela responde via HTTP.
- Busca por `Next.js`, `next.config` e `next-env` não encontra referências ativas no web.

## Testes

- Lint do web.
- Build do web.
- Smoke test HTTP no dev server.
