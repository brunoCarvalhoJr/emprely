# Obsidian update - Admin altera a propria senha

## Estado

Publicado em 2026-07-09.

## O que mudou

- O `/admin` ganhou a area "Seguranca da conta".
- O admin logado pode trocar a propria senha informando senha atual, nova senha e confirmacao.
- A API expõe `POST /api/admin/auth/password`.
- A troca exige token admin e admin ativo.
- A senha atual precisa conferir com o hash existente.
- A acao audita `AdminAlterarSenhaPropria`, sem armazenar senha.

## Onde esta no codigo

- API controller: `apps/api/src/Emprely.Api/Controllers/AdminAuthController.cs`.
- Contratos: `apps/api/src/Emprely.Contracts/Admin/AdminPainelDtos.cs`.
- Cliente web: `apps/web/src/lib/api.ts`.
- Tipos web: `apps/web/src/types/admin.ts`.
- UI admin: `apps/web/src/AdminApp.tsx`.
- Teste: `apps/api/tests/Emprely.IntegrationTests/MvpFluxoApiTests.cs`.

## Validacao

- `dotnet test apps/api/Emprely.sln`
- `pnpm lint:web`
- `pnpm web:build:beta`
- Deploy API Lightsail healthy.
- Deploy web S3/CloudFront com invalidacao.
- Smokes publicos de API e `/admin` passaram.

## Nota de seguranca

Nao registrar senha administrativa em chat, repo, Notion ou Obsidian. Perda total de senha continua exigindo processo operacional seguro fora da UI.
