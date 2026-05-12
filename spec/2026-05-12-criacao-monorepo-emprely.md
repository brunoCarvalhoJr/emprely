# Spec - Criacao do monorepo Emprely

## Visão geral

Criar o monorepo base do Emprely Orçamentos com API, web, placeholders de mobile/landing, packages compartilhados, documentação, infraestrutura local e fluxo SDD.

## Escopo

Inclui:

- Git inicializado na raiz.
- `apps/api` com solution .NET 9 em Clean Architecture.
- `apps/web` com React, Vite, TypeScript e Tailwind.
- `apps/mobile` como placeholder Expo futuro.
- `apps/landing` como referência à landing existente.
- `packages/design-tokens`, `packages/shared-types` e `packages/config`.
- `docs`, `infra`, `docker-compose.yml`, `README.md`, `pnpm-workspace.yaml`.
- Templates SDD por projeto.

Fora do escopo:

- Auth real.
- CRUDs do MVP.
- Migração da landing atual.
- Scaffold Expo.
- Deploy AWS.

## Interfaces

- API expõe `GET /health`.
- API expõe OpenAPI em ambiente de desenvolvimento.
- Docker Compose expõe PostgreSQL local em `localhost:5432`.

## Critérios de aceite

- Estrutura criada diretamente na raiz.
- `dotnet build` e `dotnet test` passam na solution da API.
- `pnpm lint:web` e `pnpm build:web` passam.
- `docker compose config` valida o compose.
- Cada app/package tem `AGENTS.md`, `.cursor/analise/` e `spec/`.

## Estratégia de implementação

- Usar CLI oficial para scaffolds.
- Ajustar arquivos manuais com patches versionáveis.
- Remover conteúdo padrão irrelevante do template web/API.
- Validar com os comandos reais do plano.
