# Emprely

Monorepo oficial do ecossistema Emprely, começando pelo produto Emprely Orçamentos.

## Estrutura

```txt
apps/
  api/       ASP.NET Core Web API em Clean Architecture
  web/       SaaS web em React, Vite, TypeScript e Tailwind
  mobile/    Placeholder do app Expo futuro
  landing/   Referência para a landing atual
packages/
  design-tokens/
  shared-types/
  config/
docs/
  adr/
  architecture/
  product/
  specs/
infra/
  docker/
  terraform/
  pipelines/
```

## Stack inicial

- API: .NET 9, ASP.NET Core, Clean Architecture.
- Web: React 19, Vite, TypeScript, Tailwind CSS.
- Banco local: PostgreSQL via Docker Compose.
- Mobile futuro: React Native com Expo.
- Cloud oficial planejada: AWS.

## Comandos

```powershell
pnpm install
pnpm dev:web
pnpm lint:web
pnpm build:web
pnpm build:api
pnpm test:api
docker compose config
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
```

## Fluxo SDD

Toda feature deve seguir:

```txt
US ou ideia -> analise -> perguntas -> spec -> implementacao
```

Antes de código, crie ou atualize:

- `.cursor/analise/{data}-{slug}.md`
- `spec/{data}-{slug}.md`

Cada app e package também possui seus próprios templates SDD.

## Convenção PortuguesIngles

Use verbos técnicos em inglês e domínio do produto em português sem acentos para funções, arquivos e variáveis:

- `FindByUsuarioAsync`
- `FindCatalogoProdutosUsuarioAsync`
- `GetPessoaAsync`
- `CreatePropostaAsync`
- `usuarioId`
- `catalogoProdutosUsuario`

Nomes exigidos por frameworks continuam válidos, como `src`, `tests`, `Controllers`, `Program.cs`, `index.html` e `components`.
