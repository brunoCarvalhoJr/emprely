# Publicacao final - Troca de senha admin

Data: 2026-07-09

## Escopo publicado

- API Emprely com endpoint autenticado `POST /api/admin/auth/password`.
- Webapp Emprely com area "Seguranca da conta" em `/admin`.
- Documentacao SDD, operacional, Notion, Obsidian e resultado de testes atualizados.

## Repositorios

- Emprely: branch `refat`, commit base da feature `800f45b`.
- Landing: branch `new`, sem alteracao nova nesta rodada porque a feature e interna do painel admin.

## Deploy

- API: Lightsail em `https://api.emprely.com.br`.
- Webapp: S3 `emprely-app-web` + CloudFront `E1NWXIL7S19BU1`.
- Landing: sem republicacao necessaria nesta rodada.

## Validacoes

- `dotnet test apps/api/Emprely.sln`: passou.
- `pnpm lint:web`: passou.
- `pnpm web:build:beta`: passou.
- `https://api.emprely.com.br/health/live`: 200.
- `https://api.emprely.com.br/health/ready`: 200.
- `https://app.emprely.com.br/admin`: 200.
- `POST /api/admin/auth/password` sem token: 401.

## Seguranca

Nenhuma senha, token, chave ou env sensivel foi versionado ou registrado na documentacao.
