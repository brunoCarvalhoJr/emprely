# Arquitetura do monorepo

## Objetivo

Centralizar API, web, mobile futuro, landing referenciada, pacotes compartilhados, documentação e infraestrutura.

## Apps

- `apps/api`: API ASP.NET Core em Clean Architecture.
- `apps/web`: SaaS web em React com Vite.
- `apps/mobile`: placeholder para Expo.
- `apps/landing`: referência documental para a landing existente.

## Packages

- `packages/design-tokens`: cores, fontes e tokens visuais.
- `packages/shared-types`: tipos TypeScript compartilhados.
- `packages/config`: configurações comuns.

## Direção técnica

- MVP simples, modular e validável.
- PostgreSQL local via Docker Compose.
- AWS como cloud oficial planejada.
- SDD obrigatório para mudanças relevantes.
