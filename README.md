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
  operations/
  product/
  specs/
infra/
  docker/
  lightsail/
  terraform/
  pipelines/
```

## Stack inicial

- API: .NET 9, ASP.NET Core, Clean Architecture.
- Web: React 19, Vite, TypeScript, Tailwind CSS.
- Banco local: PostgreSQL via Docker Compose.
- Mobile futuro: React Native com Expo.
- Cloud oficial planejada: AWS com custo baixo para o primeiro beta real.

## Comandos

Ambiente principal recomendado: Windows/PowerShell em `D:\Emprely\Projetos\Emprely`.

```powershell
pnpm install
pnpm dev:web
pnpm lint:web
pnpm build:web
pnpm test:e2e:web
pnpm landing:check
pnpm landing:build
pnpm build:api
pnpm test:api
pnpm beta:env:new
pnpm beta:env:domains
pnpm beta:env:validate
pnpm beta:env:validate:public
pnpm validate:deploy
pnpm validate:deploy:runtime
pnpm validate:lightsail
pnpm lightsail:api:build
pnpm web:build:beta
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web"
pnpm validate:beta
pnpm validate:mvp
docker compose config
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
```

Quando a automação estiver rodando pelo WSL/OpenCode, prefira chamar o gate pelo ambiente Windows para evitar conflito entre `node_modules`/Corepack do Linux e do Windows:

```bash
cmd.exe /c "pnpm validate:mvp"
```

O script `scripts/run-web-e2e.mjs` detecta Windows, WSL e Linux para escolher o comando correto do `pnpm` no E2E.

Antes de rodar `pnpm validate:beta` ou `pnpm validate:mvp`, feche qualquer instância local da API/Visual Studio que esteja usando DLLs de `apps/api/src/Emprely.Api/bin`, porque o `dotnet build` precisa sobrescrever esses arquivos.

## Beta local

Use [docs/product/beta-mvp-runbook.md](docs/product/beta-mvp-runbook.md) para subir PostgreSQL, aplicar migrations, rodar API/web e executar o aceite local do MVP.

Use [docs/operations/manutencao-projetos-emprely.md](docs/operations/manutencao-projetos-emprely.md) como manual central de manutencao, deploy, configuracao, acesso a dados, banco, secrets e operacao dos projetos Emprely, incluindo a landing externa.

Use [docs/product/checklist-final-beta-mvp.md](docs/product/checklist-final-beta-mvp.md) para decidir prontidao do MVP, separar bloqueantes reais de beta e manter prints/imagens/polimento visual adiados para a etapa final.

Use [spec/2026-06-14-deploy-lightsail-api-baixo-custo.md](spec/2026-06-14-deploy-lightsail-api-baixo-custo.md) para a spec SDD atual do primeiro beta real barato: web em S3 + CloudFront, API em Lightsail Linux US$7/mes e banco Neon Free.

Use [spec/2026-06-17-emails-transacionais-html-retencao.md](spec/2026-06-17-emails-transacionais-html-retencao.md) para a spec atual dos e-mails transacionais: Amazon SES, `contato@emprely.com.br`, template central com logo real, botao de acao e copy pt-BR revisada.

Use [docs/product/beta-staging-deploy.md](docs/product/beta-staging-deploy.md) como runbook operacional do deploy beta/staging. O kit `infra/lightsail` e o caminho oficial da API; `infra/docker` permanece util para imagem base, validacao local, smoke e fallback.

Use [docs/product/webapp-s3-cloudfront-deploy.md](docs/product/webapp-s3-cloudfront-deploy.md) como runbook operacional do proximo passo: publicar o webapp React/Vite em S3 + CloudFront com `VITE_API_BASE_URL=https://api.emprely.com.br`.

Use [apps/landing/README.md](apps/landing/README.md) para operar a landing externa pelo workspace. O projeto real permanece em `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp` e pode ser validado por `pnpm landing:check`.

Use [docs/architecture/dominios-ambientes.md](docs/architecture/dominios-ambientes.md) para o mapa oficial de dominios: landing em `www.emprely.com.br`, SaaS web em `app.emprely.com.br` e API em `api.emprely.com.br`.

Use [spec/2026-05-23-regras-proposta-trial-watermark.md](spec/2026-05-23-regras-proposta-trial-watermark.md) para as regras V1 implementadas de ciclo de proposta, trial expirado, bloqueios comerciais e marca d'água.

## Beta/staging baixo custo

O primeiro ambiente fora da maquina local deve seguir a decisao de custo minimo:

- Web: S3 + CloudFront em `https://app.emprely.com.br`.
- API: AWS Lightsail Linux US$7/mes com Docker Compose + Caddy em `https://api.emprely.com.br`.
- Banco: Neon Free PostgreSQL.
- Arquivos/logos: S3 privado + CloudFront em `https://dz3i7ivpc873w.cloudfront.net`.
- E-mails transacionais: Amazon SES em `us-east-1` com `contato@emprely.com.br`.
- Caixa de entrada: Zoho Mail em `contato@emprely.com.br`.
- Landing: manter como esta em S3 + CloudFront.

Estado real em 2026-06-17:

- API publicada e validada em `https://api.emprely.com.br/health/live` e `/health/ready`.
- Revisao local de 2026-06-16 validou `pnpm validate:mvp` e build beta web com API real.
- Bucket S3 privado `emprely-app-web` criado e build do webapp publicado nele.
- Webapp publicado em `https://app.emprely.com.br` via CloudFront/OAC, com HTTP 200 validado em 2026-06-17.
- Amazon SES em producao para `emprely.com.br` configurado e envio real funcionando por `contato@emprely.com.br`.
- API compila com templates transacionais revisados em 2026-06-17.
- Proximo passo: validar fluxo real completo pelo dominio `https://app.emprely.com.br`, revalidar emails reais apos deploy da API revisada e criar alertas de custo.

Configure variaveis de ambiente em vez de reutilizar secrets dev:

- `ConnectionStrings__EmprelyDb`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__SigningKey`
- `Jwt__ExpirationMinutes`
- `Cors__OrigensPermitidas__0`
- `App__PublicWebUrl`
- `AdminOperacoes__OperationsKey`
- `RateLimit__AuthPermitLimit`
- `RateLimit__AdminPermitLimit`
- `RateLimit__WindowSeconds`
- `EmailTransacional__Provider`
- `EmailTransacional__FromEmail`
- `EmailTransacional__FromName`
- `EmailTransacional__SesRegion`
- `EmailTransacional__SuporteDestinoEmail`
- `LogoPerfilStorage__Provider`
- `LogoPerfilStorage__S3BucketName`
- `LogoPerfilStorage__S3KeyPrefix`
- `LogoPerfilStorage__S3PublicBaseUrl`
- `LogoPerfilStorage__S3Region`
- `RateLimit__PublicSupportPermitLimit`
- `VITE_API_BASE_URL`

Para a API em Lightsail, use `LogoPerfilStorage__Provider=S3` com bucket/CDN configurados. `Local` e apenas para desenvolvimento/testes, e `Disabled` serve apenas como fallback temporario sem upload.

O email oficial inicial da API e `contato@emprely.com.br`; configure `EmailTransacional__FromEmail` e `EmailTransacional__SuporteDestinoEmail` com esse endereco no beta. Para envio automatico real, use `EmailTransacional__Provider=SES` e `EmailTransacional__SesRegion=us-east-1`.

Zoho Mail continua sendo a caixa de entrada/resposta manual. Amazon SES fica como provedor de e-mails automaticos do SaaS.

O formulario publico de suporte/interesse fica em `/suporte` no webapp e envia para `POST /api/support/public`, sem login, com destino em `contato@emprely.com.br`.

As Data Protection keys da API sao persistidas no Postgres pela tabela `data_protection_keys`; aplique as migrations no Neon antes do beta para preservar links de confirmacao/reset apos restart ou deploy.

Deploy da API no Lightsail:

- build local da imagem: `pnpm lightsail:api:build`;
- validar env example: `pnpm validate:lightsail`;
- runbook: [infra/lightsail/README.md](infra/lightsail/README.md).

Deploy do webapp:

- build beta apontando para API real: `pnpm web:build:beta`;
- upload para S3: `powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web"`;
- runbook: [docs/product/webapp-s3-cloudfront-deploy.md](docs/product/webapp-s3-cloudfront-deploy.md).

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
