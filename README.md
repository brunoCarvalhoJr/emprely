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
pnpm test:e2e:web
pnpm build:api
pnpm test:api
pnpm beta:env:new
pnpm beta:env:domains
pnpm beta:env:validate
pnpm beta:env:validate:public
pnpm validate:deploy
pnpm validate:deploy:runtime
pnpm validate:beta
pnpm validate:mvp
docker compose config
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
```

## Beta local

Use [docs/product/beta-mvp-runbook.md](docs/product/beta-mvp-runbook.md) para subir PostgreSQL, aplicar migrations, rodar API/web e executar o aceite local do MVP.

Use [docs/product/checklist-final-beta-mvp.md](docs/product/checklist-final-beta-mvp.md) para decidir prontidao do MVP, separar bloqueantes reais de beta e manter prints/imagens/polimento visual adiados para a etapa final.

Use [docs/product/beta-staging-deploy.md](docs/product/beta-staging-deploy.md) para preparar o primeiro beta/staging com Docker Compose, API, web e PostgreSQL.

Use [docs/architecture/dominios-ambientes.md](docs/architecture/dominios-ambientes.md) para o mapa oficial de dominios: landing em `www.emprely.com.br`, SaaS web em `app.emprely.com.br` e API em `api.emprely.com.br`.

## Beta/staging

O primeiro ambiente fora da maquina local deve configurar variaveis de ambiente em vez de reutilizar secrets dev:

- `ConnectionStrings__EmprelyDb`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__SigningKey`
- `Jwt__ExpirationMinutes`
- `Cors__OrigensPermitidas__0`
- `AdminOperacoes__OperationsKey`
- `RateLimit__AuthPermitLimit`
- `RateLimit__AdminPermitLimit`
- `RateLimit__WindowSeconds`
- `VITE_API_BASE_URL`

Health operacional da API:

- `GET /health`
- `GET /health/live`
- `GET /health/ready`

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
