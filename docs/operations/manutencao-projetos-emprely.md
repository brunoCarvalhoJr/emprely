# Manual operacional - Emprely

Documento para manutencao, deploy, configuracao, acesso a dados e diagnostico dos projetos Emprely.

Use este arquivo como ponto de partida quando for pedir manutencao ou deploy futuro. Ele nao guarda secrets reais. Connection strings, chaves AWS, JWT, admin key e tokens devem continuar fora do repositorio e fora do chat.

## Atualizacao operacional 2026-07-09 - Tela Plano

Status: melhoria de usabilidade implementada, validada e publicada no webapp.

Entregue:

- Tela `Plano` reorganizada em resumo do plano, cobranca atual, pagamento, beneficios e historico.
- Pagamento em andamento mostra somente um CTA destacado `Abrir Comprovante`; o historico mantem link discreto.
- Mensagem de renovacao cancelada orienta iniciar um novo plano e informa a validade restante quando disponivel.
- `Cancelar renovacao` continua sendo apenas cancelamento da proxima renovacao; o acesso permanece ate o fim do periodo atual.
- Nenhuma regra de billing, webhook, Asaas, banco de dados ou secret foi alterada.

Validacoes:

- `pnpm lint:web`: passou.
- `pnpm web:build:beta`: passou.
- QA visual local desktop/mobile com mocks de billing.
- Publicacao web em S3/CloudFront e smoke de producao devem ser conferidos na release correspondente em `docs/product/release-2026-07-09-billing-plano-cancelamento-ui.md`.

## Atualizacao operacional 2026-06-28 - Asaas billing V2

Status: implementado localmente e validado; pendente publicar API/web/landing e configurar secrets reais do Asaas no ambiente privado.

Atualizacao 2026-07-08:

- Webhook Asaas foi configurado no painel e os segredos foram separados fora do repo em `D:\Emprely\Segredos`.
- Arquivos privados: `ASAAS-SANDBOX-API-KEYY.env`, `ASAAS-PROD-API-KEYY.env` e `ASAAS-TOKEN-WEBHOOK.env`.
- O comando `pnpm lightsail:asaas:prod` importa a chave de producao e o token de webhook para `D:\Emprely\Segredos\lightsail.env`, cria backup e nao mostra secrets.
- O comando `pnpm lightsail:asaas:sandbox` faz a mesma operacao apontando para sandbox.
- O env privado foi atualizado com producao em 2026-07-08 e validado com `scripts/validate-lightsail-env.ps1 -EnvPath ..\..\Segredos\lightsail.env`.

Entregue:

- API com dominio de billing, migration `AsaasBillingCompleto`, provider `AsaasProvedorPagamentos`, assinatura recorrente Asaas, webhook idempotente e endpoints administrativos.
- Hardening adicional inclui migration `BillingCicloPlanoReembolsoParcial`, ciclos mensal/anual, reativacao local bloqueada e sync admin isolado por conta.
- Webhook cria/atualiza pagamentos locais de cobrancas recorrentes quando o Asaas gerar novos ciclos.
- Cancelamento remoto de assinatura e reembolso remoto integral/parcial de pagamento foram conectados ao provider Asaas.
- Emprely envia e-mail transacional de Plano Fundador ativado quando o pagamento for confirmado/recebido.
- App web com menu `Plano`, seletor mensal/anual, formulario de dados do pagador, Pix/cartao hospedados no Asaas e retorno `/billing/sucesso`, `/billing/cancelado`, `/billing/expirado`.
- Landing externa deve comunicar Plano Fundador com pagamento hospedado no Asaas.
- Exemplos de ambiente atualizados com `Asaas__ApiKey`, `Asaas__WebhookToken` e URLs de retorno, sem secrets reais.

Decisao tecnica:

- A V2 usa assinatura recorrente nativa do Asaas e liberacao por webhook de pagamento confirmado/recebido.
- Pix atual e cobranca recorrente hospedada pelo Asaas; nao e Pix Automatico bancario.
- Reativacao de assinatura pelo cliente deve sempre criar novo checkout.
- Reembolso parcial nao suspende acesso; reembolso integral cancela recorrencia remota e suspende.
- E-mails financeiros de cobranca devem ficar habilitados no Asaas; o Emprely envia e-mail proprio apenas para confirmar ativacao do plano.
- Reconciliacao ativa por job ainda fica como melhoria posterior.
- O Emprely nao coleta nem armazena dados de cartao.

Deploy 2026-07-08:

- `D:\Emprely\Segredos\lightsail.env` foi atualizado com Asaas producao e enviado no deploy da API.
- API publicada em `https://api.emprely.com.br` com checkout exigindo dados do pagador.
- Web publicada em `https://app.emprely.com.br` com formulario de CPF/CNPJ, endereco, Pix e cartao hospedado Asaas.
- Comandos executados:
  - `pnpm lightsail:asaas:prod`
  - `pnpm lightsail:env:validate`
  - `pnpm lightsail:api:build`
  - `scripts/deploy-lightsail-api-image.ps1`
  - `pnpm web:build:beta`
  - `scripts/deploy-web-s3.ps1 -BucketName emprely-app-web -DistributionId E1NWXIL7S19BU1`
- Validacao publica:
  - API `/health/live` e `/health/ready`: HTTP 200.
  - App `/`, `/billing/sucesso`, `/billing/cancelado`, `/billing/expirado`: HTTP 200.
- Permissao `cloudfront:GetInvalidation` segue ausente no usuario de deploy, mas a invalidation foi criada com sucesso.

Proximo passo:

- Fazer smoke real controlado com Pix e cartao usando conta de teste.
- Confirmar webhook/reconciliacao e liberacao do Plano Fundador apos pagamento.
- Landing externa foi revisada em 2026-07-08; a copy ativa agora informa Pix ou cartao no Asaas para o plano pago.
- Ver relatorio: `docs/product/teste-pos-deploy-billing-2026-07-08.md`.

## Visao geral

| Projeto | Caminho | Papel | Status operacional |
| --- | --- | --- | --- |
| Monorepo Emprely | `D:\Emprely\Projetos\Emprely` | SaaS Emprely Orcamentos, API, webapp, infra e documentacao | Ativo |
| API SaaS | `apps/api` | ASP.NET Core API, dominio, contratos, Postgres, emails e upload | Ativo, publicada em beta |
| Webapp SaaS | `apps/web` | React/Vite da area logada do Emprely Orcamentos | Ativo, publicado em S3 + CloudFront; `https://app.emprely.com.br` validado com HTTP 200 |
| Landing V1 | `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp` | Landing publica de conversao | Ativa, externa ao monorepo |
| Landing bridge | `apps/landing` | Ponte operacional para a Landing V1 externa | Ativo como referencia |
| Mobile | `apps/mobile` | Futuro app Expo | Placeholder |
| Packages | `packages/*` | Tokens, tipos e config compartilhada | Inicial, pouco acoplado ao web atual |
| Infra | `infra/*` | Docker local/fallback, Lightsail, web deploy e runbooks | Ativo |

## Regra de trabalho

Antes de alterar codigo ou documentacao relevante:

1. Criar checkpoint de rollback do workspace.
2. Seguir SDD: analise em `.cursor/analise/` e spec em `spec/`.
3. Nao gravar secrets reais.
4. Validar com comandos reais do projeto afetado.
5. Se a decisao mudar arquitetura, custo, provedor, MVP, dominio, deploy, banco, email, pagamento ou mobile, atualizar tambem os rastreadores de projeto fora do repo.

## Estado beta atual

Estado registrado em 2026-06-17:

- API publicada em `https://api.emprely.com.br`.
- Health da API validado em `/health/live` e `/health/ready`.
- Banco beta em Neon Free, com migrations aplicadas.
- API roda em AWS Lightsail Linux com Docker Compose + Caddy.
- Assets/logos usam S3 privado + CloudFront em `https://dz3i7ivpc873w.cloudfront.net`.
- E-mail transacional usa Amazon SES `us-east-1` com `contato@emprely.com.br`.
- Caixa manual/profissional usa Zoho Mail em `contato@emprely.com.br`.
- WhatsApp publico oficial para suporte, contato comercial e ativacao de plano: `+55 (35) 99738-9755` (`https://wa.me/5535997389755`).
- Webapp React/Vite publicado em S3 + CloudFront em `https://app.emprely.com.br`.
- `https://app.emprely.com.br` validado com HTTP 200 em 2026-06-17.
- Painel administrativo fica no mesmo webapp, em `/admin`, com login administrativo separado do login do cliente.
- Manutencao de administradores no painel deve ser feita por admin com perfil `SuperAdmin`.
- Feature admin de usuarios, planos, dias gratis, emails e auditoria publicada em beta em 2026-06-17; ajuste de layout publicado no webapp em 2026-06-17.
- Em 2026-07-09, o painel `/admin` passou a ter a area "Seguranca da conta" para o admin logado alterar a propria senha usando senha atual, nova senha e confirmacao. A troca chama `POST /api/admin/auth/password`, exige token admin, valida a senha atual e registra auditoria `AdminAlterarSenhaPropria` sem armazenar senha em logs, documentos ou auditoria.
- Em 2026-07-09, o layout do `/admin` foi refatorado para navegacao por secoes: Usuarios, Seguranca, Administradores e Emails. A secao Usuarios concentra operacao e detalhe; as demais secoes deixam de ficar empilhadas abaixo da tabela.
- Landing publica continua em `https://www.emprely.com.br` e `https://emprely.com.br`.
- Landing publicada em 2026-06-17 com botao `Entrar` para `https://app.emprely.com.br`.
- API publicada novamente no Lightsail em 2026-06-17 com os ajustes finais do admin.
- `GET https://api.emprely.com.br/api/admin/auth/bootstrap-owner` validado com `404 Not Found` apos o deploy.

## Comandos de validacao

Na raiz do monorepo:

```powershell
pnpm validate:mvp
```

Esse gate roda:

- lint do web;
- build do web;
- E2E Playwright do web com API mockada;
- build da API;
- testes unitarios e de integracao da API;
- validacao do Docker Compose local;
- validacao do Docker Compose beta/fallback;
- validacao do compose/env example do Lightsail.

Comandos por escopo:

```powershell
pnpm lint:web
pnpm build:web
pnpm test:e2e:web
pnpm build:api
pnpm test:api
pnpm validate:deploy
pnpm validate:lightsail
```

Se o `dotnet build` falhar tentando baixar pacotes do NuGet, o problema pode ser rede/sandbox. Repetir com acesso de rede aprovado antes de concluir que a API quebrou.

## API SaaS

### Caminhos

| Item | Caminho |
| --- | --- |
| Solucao .NET | `apps/api/Emprely.sln` |
| API HTTP | `apps/api/src/Emprely.Api` |
| Casos de aplicacao/interfaces | `apps/api/src/Emprely.Application` |
| Dominio | `apps/api/src/Emprely.Domain` |
| Infra/banco/email | `apps/api/src/Emprely.Infrastructure` |
| Contratos publicos | `apps/api/src/Emprely.Contracts` |
| Testes | `apps/api/tests` |

### Responsabilidades

- Autenticacao e conta.
- Perfil/marca.
- Clientes.
- Servicos/pacotes.
- Propostas e ciclo comercial.
- Trial e Plano Fundador administrativo.
- E-mails transacionais.
- Formulario de suporte/interesse.
- Upload de logo para Local/S3/Disabled.
- Health checks, rate limit, CORS e headers de seguranca.

### Configuracao local

Banco local padrao via Docker Compose:

```txt
Host=localhost;Port=5432;Database=emprely;Username=emprely;Password=emprely_dev
```

Subir local:

```powershell
docker compose up -d postgres
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
dotnet run --project apps/api/src/Emprely.Api/Emprely.Api.csproj --launch-profile http
```

URLs locais:

```txt
API: http://localhost:5262
Health: http://localhost:5262/health
Liveness: http://localhost:5262/health/live
Readiness: http://localhost:5262/health/ready
```

### Configuracao beta/staging

Nao usar secrets dev no beta. As variaveis reais devem ficar no host/servidor:

```txt
ASPNETCORE_ENVIRONMENT=Staging
ASPNETCORE_URLS=http://0.0.0.0:8080
ConnectionStrings__EmprelyDb=<connection-string-neon>
Jwt__Issuer=Emprely
Jwt__Audience=Emprely.Web
Jwt__SigningKey=<secret-com-32-ou-mais-caracteres>
Jwt__ExpirationMinutes=120
Cors__OrigensPermitidas__0=https://app.emprely.com.br
App__PublicWebUrl=https://app.emprely.com.br
AdminOperacoes__OperationsKey=<secret-admin>
AdminPainel__OwnerEmail=Bruno.jr.ti@hotmail.com
RateLimit__AuthPermitLimit=30
RateLimit__AdminPermitLimit=10
RateLimit__PublicSupportPermitLimit=10
RateLimit__WindowSeconds=60
EmailTransacional__Provider=SES
EmailTransacional__FromEmail=contato@emprely.com.br
EmailTransacional__FromName=Emprely
EmailTransacional__SesRegion=us-east-1
EmailTransacional__SuporteDestinoEmail=contato@emprely.com.br
LogoPerfilStorage__Provider=S3
LogoPerfilStorage__S3BucketName=<bucket-assets>
LogoPerfilStorage__S3KeyPrefix=uploads/account-logos
LogoPerfilStorage__S3PublicBaseUrl=https://dz3i7ivpc873w.cloudfront.net
LogoPerfilStorage__S3Region=us-east-1
```

Arquivos de referencia, sem secrets reais:

- `apps/api/src/Emprely.Api/appsettings.Staging.example.json`
- `infra/lightsail/lightsail.env.example`
- `infra/docker/beta.env.example`

Arquivo privado esperado no servidor Lightsail:

```txt
/opt/emprely/orcamentos/lightsail.env
```

Arquivos privados locais para Asaas:

```txt
D:\Emprely\Segredos\ASAAS-SANDBOX-API-KEYY.env
D:\Emprely\Segredos\ASAAS-PROD-API-KEYY.env
D:\Emprely\Segredos\ASAAS-TOKEN-WEBHOOK.env
D:\Emprely\Segredos\lightsail.env
```

Importar Asaas para o env privado da API:

```powershell
pnpm lightsail:asaas:prod
pnpm lightsail:env:validate
```

Use `pnpm lightsail:asaas:sandbox` somente para smoke sandbox. Nao copiar o conteudo desses arquivos para chat, Notion, Obsidian ou repositorio.

### Deploy API em Lightsail

Pre-check local:

```powershell
pnpm validate:mvp
pnpm validate:lightsail
```

Build da imagem:

```powershell
pnpm lightsail:api:build
```

Deploy para o servidor:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-lightsail-api-image.ps1 `
  -SshHost "<ip-ou-host>" `
  -User "ubuntu" `
  -KeyPath "C:\caminho\chave.pem" `
  -EnvFile "C:\caminho\lightsail.env" `
  -RemoteDirectory "/opt/emprely/orcamentos"
```

Smoke depois do deploy:

```powershell
Invoke-RestMethod https://api.emprely.com.br/health/live
Invoke-RestMethod https://api.emprely.com.br/health/ready
```

Se trocar templates de email, confirmar no beta real:

- cadastro novo;
- confirmacao de email;
- recuperacao de senha;
- suporte publico;
- recebimento em Gmail e Hotmail quando aplicavel.

## Banco de dados

### Bancos existentes

| Ambiente | Tecnologia | Onde fica | Como acessar |
| --- | --- | --- | --- |
| Local dev | PostgreSQL Docker | `docker-compose.yml` na raiz | `localhost:5432`, usuario `emprely`, senha dev |
| Beta/staging | Neon PostgreSQL | Neon Free | Connection string fora do repo |
| Data Protection | Tabela no mesmo Postgres | `data_protection_keys` | Via EF/migration |

### Como acessar o banco local

Subir Postgres:

```powershell
docker compose up -d postgres
```

Usar `psql`, DBeaver, DataGrip ou pgAdmin com:

```txt
Host: localhost
Porta: 5432
Database: emprely
Usuario: emprely
Senha: emprely_dev
```

Aplicar migrations locais:

```powershell
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
```

Reset local destrutivo, somente quando quiser apagar dados dev:

```powershell
docker compose down -v
docker compose up -d postgres
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
```

### Como acessar o banco beta/Neon

Nao existe connection string real neste repo. Para manutencao:

1. Obter a connection string no local seguro usado no projeto ou no painel Neon.
2. Nunca salvar a connection string em arquivo versionado.
3. Usar variavel de ambiente temporaria na sessao:

```powershell
$env:ConnectionStrings__EmprelyDb="<connection-string-neon>"
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
Remove-Item Env:\ConnectionStrings__EmprelyDb
```

Para abrir no cliente SQL:

```powershell
psql "<connection-string-neon>"
```

Para backup manual com `pg_dump`:

```powershell
pg_dump "<connection-string-neon>" --format=custom --file "emprely-beta-YYYYMMDD.dump"
```

Guardar dumps fora do repositorio.

### Tabelas principais

| Tabela | Papel |
| --- | --- |
| `usuarios` | Usuarios ASP.NET Identity |
| `contas` | Conta/tenant do cliente |
| `membros_conta` | Relacao usuario-conta |
| `perfis_conta` | Marca, contato, cores e logo |
| `clientes` | Clientes cadastrados |
| `servicos` | Servicos e pacotes |
| `propostas` | Cabecalho e status de propostas |
| `proposta_itens` | Itens das propostas |
| `emails_transacionais` | Historico de emails enviados |
| `emails_alteracao_pendente` | Fluxo de alteracao de email |
| `suporte_solicitacoes` | Suporte/interesse recebido |
| `data_protection_keys` | Chaves para tokens de confirmacao/reset sobreviverem a restart/deploy | 
| `admins_usuarios` | Administradores do painel interno, separados dos usuarios comuns |
| `admin_auditorias` | Auditoria de login, exportacao e acoes administrativas |
| `dias_gratis_conta` | Beneficios de dias gratis separados do trial |

Evitar alteracao direta em banco para regra de negocio. Preferir endpoint, migration ou script revisado.

### Operacao administrativa

Painel administrativo:

```txt
https://app.emprely.com.br/admin
```

Criacao inicial de admin:

1. O fluxo publico `Criar owner`/`bootstrap-owner` nao deve ser usado.
2. O primeiro admin deve ser criado por processo operacional seguro fora da UI publica, por migration/script revisado ou acesso controlado ao banco.
3. Depois que existir admin `SuperAdmin`, acessar `/admin` e usar login administrativo normal.
4. Criacao, bloqueio/desbloqueio e alteracao de perfil de outros admins devem ser feitas por `SuperAdmin`.

O painel administrativo substitui a operacao manual preferencial para usuarios, contas, planos, dias gratis, suspensao, bloqueio, emails personalizados e exportacao CSV. Toda acao critica exige motivo e registra auditoria com IP e user-agent.

Funcionalidades cobertas no painel:

- Filtros administrativos por busca, plano, status comercial, status da conta, papel na conta, email confirmado, bloqueio, usuario sem conta, trial ativo, trial expirado, dias gratis ativo, data de criacao e ultimo email enviado.
- Criacao de usuario com conta nova ou sem conta.
- Criacao de conta para usuario existente sem conta, com owner obrigatorio.
- Dias gratis individuais ou em lote, com revisao final dos alvos.
- Email personalizado individual ou em lote, com revisao final dos destinatarios, HTML, preview e anexos simples.
- CSV exportado com os mesmos filtros aplicados na listagem.
- Status comercial da conta atual considera dias gratis ativos como `TrialAtivo`.

Administracao de admins:

- Apenas `SuperAdmin` consegue listar e manter outros admins.
- `SuperAdmin` pode criar admins `SuperAdmin` ou `Suporte`.
- `SuperAdmin` pode bloquear/desbloquear admins e alterar perfil, sempre com motivo auditado.
- A propria conta admin autenticada nao deve ser bloqueada ou rebaixada pela tela.
- Todo admin autenticado, inclusive `Suporte`, pode trocar a propria senha em `/admin` na area "Seguranca da conta". O fluxo exige a senha atual; para perda total de acesso, usar processo operacional seguro fora da UI e nunca registrar a nova senha no repositorio, chat, Notion ou Obsidian.

Ativar Plano Fundador manualmente:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://api.emprely.com.br/api/admin/billing/accounts/<contaId>/manual-credit" `
  -Headers @{ "X-Emprely-Admin-Key" = "<chave-admin>" }
```

## Webapp SaaS

### Caminhos

| Item | Caminho |
| --- | --- |
| App React/Vite | `apps/web` |
| Entrada principal | `apps/web/src/App.tsx` |
| Client HTTP | `apps/web/src/lib/api.ts` |
| Tipos | `apps/web/src/types` |
| E2E | `apps/web/e2e/mvp-fluxo.spec.ts` |

### Configuracao

Local:

```txt
VITE_API_BASE_URL=http://localhost:5262
```

Beta/staging:

```txt
VITE_API_BASE_URL=https://api.emprely.com.br
```

Fora de `DEV`, o web exige `VITE_API_BASE_URL`; sem isso, o build/runtime deve falhar para evitar apontar para localhost em beta.

### Desenvolvimento local

```powershell
pnpm --dir apps/web dev
```

URL padrao:

```txt
http://localhost:5173
```

### Build e deploy webapp

Build beta apontando para API real:

```powershell
pnpm web:build:beta
```

Upload para S3:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web"
```

Com invalidacao CloudFront, quando existir distribution:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 `
  -BucketName "emprely-app-web" `
  -DistributionId "<cloudfront-id>"
```

Estado atual do deploy publico:

- CloudFront/OAC para `emprely-app-web` configurado.
- Certificado e DNS `app.emprely.com.br` configurados.
- `https://app.emprely.com.br` responde HTTP 200.
- Painel admin usa a mesma publicacao do webapp em `https://app.emprely.com.br/admin`.
- Ainda precisa validar o fluxo completo com dados reais pelo dominio publico.
- Ainda precisa confirmar CORS pelo uso real do webapp publicado.

## Landing V1

### Inclusao no workspace

A landing atual e um projeto Next.js separado, mantido fora do monorepo:

```txt
D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp
```

No monorepo, `apps/landing` funciona como ponte operacional para esse projeto. Nao copie a landing inteira para dentro do monorepo sem uma spec propria, porque o diretorio externo contem `.git`, `node_modules`, `.next`, `out` e artefatos de build.

### Stack

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript
- Tailwind CSS 4
- GSAP/ScrollTrigger
- Lenis
- npm/package-lock

### Dominios

```txt
https://www.emprely.com.br
https://emprely.com.br
```

### Deploy landing

O projeto externo tem script:

```powershell
npm run deploy:prod
```

Esse script executa build estatico e publica:

```txt
Bucket S3: emprely-landing-production
CloudFront distribution: E1NWXIL7S19BU1
```

Fluxo manual recomendado:

```powershell
Set-Location D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp
npm run check
npm run build:static
npm run deploy:prod
```

Comandos pelo workspace Emprely:

```powershell
pnpm landing:check
pnpm landing:build
pnpm landing:deploy:prod
```

### Variaveis publicas da landing

Configuradas em `.env.local` no projeto externo ou no ambiente de build:

```txt
NEXT_PUBLIC_SITE_URL=https://emprely.com.br
NEXT_PUBLIC_CONTACT_ENDPOINT=<endpoint-publico-de-contato>
NEXT_PUBLIC_CONTACT_INTERNAL_TOKEN=<token-publico-de-integracao>
NEXT_PUBLIC_LEAD_ENDPOINT=<endpoint-legado-opcional>
NEXT_PUBLIC_GA_ID=<ga4-id>
NEXT_PUBLIC_GTM_ID=<gtm-id>
```

Observacao: tudo com `NEXT_PUBLIC_` fica publico no navegador. Nao usar esses valores como segredo real. Se houver token, tratar apenas como triagem/rate-limit e validar no backend.

### Manutencao landing

Antes de alterar copy, SEO, analytics, formulario, estrutura ou visual:

1. Ler `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\AGENTS.md`.
2. Ler `docs/prd-landing-page.md` dentro do projeto da landing.
3. Criar analise/spec no projeto da landing.
4. Rodar:

```powershell
npm run check
```

## Mobile

`apps/mobile` ainda e placeholder. Nao ha deploy mobile ativo. A decisao atual e criar scaffold Expo somente depois de validar o fluxo web do MVP.

Contrato esperado futuro:

- Backend salva dados estruturados da proposta e template escolhido.
- Mobile gera PDF/PNG sob demanda no dispositivo.
- Compartilhamento usa share nativo do sistema com mensagem e arquivo anexado.

## Packages

| Package | Papel atual |
| --- | --- |
| `packages/design-tokens` | Tokens iniciais de cor/fonte |
| `packages/shared-types` | Tipos compartilhados planejados para web/mobile |
| `packages/config` | Config compartilhada inicial de TypeScript |

Hoje o web ainda usa tipos locais em `apps/web/src/types`. Antes de depender forte dos packages, fazer uma spec de compartilhamento de contratos para evitar divergencia com `Emprely.Contracts`.

## Infra e servicos externos

| Servico | Uso | Onde documentar/manter |
| --- | --- | --- |
| AWS Lightsail | API beta | `infra/lightsail` |
| Caddy | TLS/proxy da API | `infra/lightsail/Caddyfile` |
| Neon | Postgres beta | Painel Neon e env seguro |
| S3 `emprely-app-web` | Webapp SaaS | `docs/product/webapp-s3-cloudfront-deploy.md` |
| S3 `emprely-landing-production` | Landing V1 | Projeto externo da landing |
| CloudFront landing | `www`/apex landing | Distribution `E1NWXIL7S19BU1` |
| CloudFront assets | Logos/assets SaaS | `https://dz3i7ivpc873w.cloudfront.net` |
| SES `us-east-1` | Emails transacionais | AWS SES |
| Zoho Mail | Caixa manual | Zoho |
| Route 53/ACM | DNS/TLS | AWS |
| AWS Budgets | Alertas de custo | AWS, pendente antes do beta real |

## Secrets e arquivos sensiveis

Nunca versionar:

- `.env`
- `.env.*`
- `*.env`, exceto exemplos
- connection strings reais
- JWT signing keys
- admin keys
- AWS access keys
- SSH private keys
- dumps de banco

Arquivos esperados fora do Git:

| Arquivo/local | Uso |
| --- | --- |
| `infra/docker/beta.env` | Env privado local/fallback |
| `/opt/emprely/orcamentos/lightsail.env` | Env real no servidor Lightsail |
| `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\.env.local` | Env local da landing |
| Chave SSH `.pem` | Deploy Lightsail |
| Connection string Neon | Painel/gerenciador seguro |

## Checklist antes de qualquer deploy

1. Confirmar qual projeto sera implantado: API, webapp, landing ou infra.
2. Conferir `git status` do projeto afetado.
3. Criar checkpoint de rollback.
4. Rodar SDD quando houver mudanca.
5. Rodar validacao aplicavel.
6. Confirmar que secrets estao fora do Git.
7. Executar deploy.
8. Fazer smoke publico.
9. Conferir logs/health.
10. Atualizar docs/rastreadores se a decisao operacional mudou.

## Playbooks rapidos

### API: publicar nova imagem

```powershell
pnpm validate:mvp
pnpm lightsail:api:build
powershell -ExecutionPolicy Bypass -File scripts/deploy-lightsail-api-image.ps1 `
  -SshHost "<ip-ou-host>" `
  -User "ubuntu" `
  -KeyPath "C:\caminho\chave.pem" `
  -EnvFile "C:\caminho\lightsail.env" `
  -RemoteDirectory "/opt/emprely/orcamentos"
Invoke-RestMethod https://api.emprely.com.br/health/live
Invoke-RestMethod https://api.emprely.com.br/health/ready
```

### Webapp: publicar build no S3

```powershell
pnpm validate:mvp
pnpm web:build:beta
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 `
  -BucketName "emprely-app-web" `
  -DistributionId "<cloudfront-id>"
```

### Landing: publicar producao

```powershell
pnpm landing:check
pnpm landing:deploy:prod
```

### Banco: aplicar migration no Neon

```powershell
$env:ConnectionStrings__EmprelyDb="<connection-string-neon>"
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
Remove-Item Env:\ConnectionStrings__EmprelyDb
```

### Diagnostico de API publicada

```powershell
Invoke-RestMethod https://api.emprely.com.br/health/live
Invoke-RestMethod https://api.emprely.com.br/health/ready
```

Se `/health/live` passa e `/health/ready` falha, suspeitar primeiro de banco, connection string, rede Neon ou migration pendente.

## Ordem recomendada atual

1. Publicar a nova imagem da API com templates transacionais revisados.
2. Revalidar emails reais de confirmacao, recuperacao e suporte.
3. Validar fluxo real pelo dominio `https://app.emprely.com.br`.
4. Confirmar CORS pelo uso do webapp publicado.
5. Criar AWS Budgets/alertas.
6. Rodar aceite manual completo com dados reais de teste.
7. Linkar CTA/formulario da landing para o fluxo correto do SaaS.

## Quando pedir manutencao ao assistente

Informe sempre:

- projeto afetado: API, webapp, landing, banco, infra ou todos;
- ambiente: local, beta/staging ou producao;
- objetivo: corrigir bug, publicar deploy, alterar config, aplicar migration, investigar logs;
- se ha secrets/arquivos locais disponiveis e onde estao;
- se pode executar comandos com rede/AWS/SSH.

O assistente deve confirmar estado com `git status`, ler o runbook relevante, criar checkpoint, executar comandos reais e devolver resultado com comandos rodados e riscos restantes.
