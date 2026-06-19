# Deploy beta/staging - Emprely Orcamentos

## Objetivo

Subir o MVP em um ambiente beta/staging barato, sem cold start na API e mantendo secrets reais fora do repositorio.

Caminho oficial atual:

- Web React/Vite: S3 + CloudFront em `https://app.emprely.com.br`.
- Painel administrativo: mesma publicacao do webapp, em `https://app.emprely.com.br/admin`, com login separado.
- API ASP.NET Core: Lightsail Linux US$7/mes + Docker Compose + Caddy em `https://api.emprely.com.br` (publicada e validada).
- Banco: Neon Free PostgreSQL.
- Arquivos/logos: S3 privado + CloudFront em `https://dz3i7ivpc873w.cloudfront.net`.
- E-mails transacionais: Amazon SES em `us-east-1` usando `contato@emprely.com.br`.
- Caixa profissional/manual: Zoho Mail em `contato@emprely.com.br`.
- Landing V1: manter como esta em S3 + CloudFront.

Lambda + API Gateway deixam de ser o caminho oficial inicial e ficam como alternativa futura.

## Referencias

- Spec SDD atual: `spec/2026-06-14-deploy-lightsail-api-baixo-custo.md`.
- Runbook Lightsail: `infra/lightsail/README.md`.
- Runbook webapp S3 + CloudFront: `docs/product/webapp-s3-cloudfront-deploy.md`.
- Mapa de dominios: `docs/architecture/dominios-ambientes.md`.
- Checklist beta: `docs/product/checklist-final-beta-mvp.md`.
- Runbook local: `docs/product/beta-mvp-runbook.md`.

## Pre-requisitos

- Conta AWS com acesso a Lightsail, S3, CloudFront, Route 53, ACM e Budgets.
- Dominio `emprely.com.br` gerenciado no Route 53.
- Instancia Lightsail Linux US$7/mes com IP estatico ja criada para a API.
- Docker e Docker Compose plugin instalados no Lightsail.
- Projeto Neon Free criado para o banco beta/staging.
- .NET SDK instalado na maquina que aplicar migrations pelo `dotnet ef`.
- Docker Desktop local para buildar a imagem da API.
- `pnpm validate:mvp` passando localmente antes do deploy.
- Secrets reais configurados fora do Git.

## Ordem recomendada

1. Finalizar e validar email Zoho: MX, SPF, DKIM, DMARC, envio e recebimento.
2. Rodar `pnpm validate:mvp`.
3. Criar banco Neon Free.
4. Aplicar migrations EF Core no Neon.
5. Criar bucket/CDN para assets/logos.
6. Criar instancia Lightsail Linux US$7/mes e IP estatico.
7. Apontar `api.emprely.com.br` para o IP do Lightsail.
8. Criar `/opt/emprely/orcamentos/lightsail.env` com secrets reais.
9. Buildar imagem da API localmente com `pnpm lightsail:api:build`.
10. Enviar imagem e compose para o Lightsail.
11. Subir API + Caddy e validar health checks.
12. Buildar web com `VITE_API_BASE_URL=https://api.emprely.com.br`.
13. Publicar web em S3 + CloudFront.
14. Configurar DNS e certificados do app web.
15. Criar AWS Budgets/alertas.
16. Rodar aceite manual com dados reais de teste.
17. Abrir beta assistido para poucos usuarios.

Etapas 1, 3, 4, 5, 6, 7, 8, 9, 10 e 11 ja foram executadas para o ambiente atual. O SES tambem ja foi configurado em producao para o dominio `emprely.com.br`, com envio real funcionando por `contato@emprely.com.br`.

Em 2026-06-16, a revisao geral confirmou:

- lint web passou;
- build beta web passou com `VITE_API_BASE_URL=https://api.emprely.com.br`;
- build da API passou;
- testes unitarios e de integracao da API passaram apos ajuste do logger dos testes de integracao no Windows;
- E2E web passou apos ajuste do wrapper `scripts/run-web-e2e.mjs`;
- `pnpm validate:mvp` passou;
- arquivos locais sensiveis continuam fora do Git.

O proximo bloqueante e publicar o webapp.

## Variaveis da API

Use `infra/lightsail/lightsail.env.example` como base para o arquivo privado `lightsail.env` no servidor.

Principais variaveis:

```txt
EMPRELY_API_IMAGE=emprely-api:lightsail
EMPRELY_API_DOMAIN=api.emprely.com.br
CADDY_ACME_EMAIL=contato@emprely.com.br
EMPRELY_DB_CONNECTION_STRING=<connection-string-neon>
Cors__OrigensPermitidas__0=https://app.emprely.com.br
Cors__OrigensPermitidas__1=https://www.emprely.com.br
Cors__OrigensPermitidas__2=https://emprely.com.br
App__PublicWebUrl=https://app.emprely.com.br
AdminPainel__OwnerEmail=Bruno.jr.ti@hotmail.com
LogoPerfilStorage__Provider=S3
LogoPerfilStorage__S3BucketName=<bucket-assets-emprely>
LogoPerfilStorage__S3PublicBaseUrl=https://dz3i7ivpc873w.cloudfront.net
EmailTransacional__Provider=Fake
EmailTransacional__FromEmail=contato@emprely.com.br
EmailTransacional__SuporteDestinoEmail=contato@emprely.com.br
```

Observacoes:

- `EmailTransacional__Provider=Fake` nao envia email real; use apenas para smoke tecnico.
- Para beta real, usar SES como provedor transacional.
- A caixa oficial inicial e `contato@emprely.com.br`.
- Zoho fica como caixa de entrada/resposta manual; nao usar Zoho como dependencia do envio automatico do SaaS enquanto o SES estiver validado.
- Os templates transacionais ficam centralizados na API em `EmailTransacionalTemplateBuilder`, com logo real do Emprely, botao de acao, fallback de link e copy pt-BR revisada.
- Data Protection keys ficam persistidas no Postgres via `data_protection_keys`; garantir que a migration foi aplicada no Neon.
- No beta real, `LogoPerfilStorage__Provider` deve ser `S3`.
- `AdminPainel__OwnerEmail` define o dono principal que pode administrar outros admins. Nao e secret, mas deve estar igual nos ambientes onde o painel admin sera usado.

## Banco Neon

1. Criar projeto Neon Free.
2. Criar banco/role para beta.
3. Guardar connection string fora do Git.
4. Aplicar migrations:

```powershell
dotnet tool restore
$env:ConnectionStrings__EmprelyDb="<connection-string-neon>"
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
Remove-Item Env:\ConnectionStrings__EmprelyDb
```

Essa etapa cria `data_protection_keys`, usada para manter links de confirmacao, recuperacao e alteracao de email validos apos restart/deploy da API.

## API Lightsail + Caddy

Validar env example:

```powershell
pnpm validate:lightsail
```

Buildar imagem localmente:

```powershell
pnpm lightsail:api:build
```

Enviar e subir no servidor:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-lightsail-api-image.ps1 `
  -SshHost "<ip-ou-host>" `
  -User "ubuntu" `
  -KeyPath "C:\caminho\chave.pem" `
  -EnvFile "C:\caminho\lightsail.env" `
  -RemoteDirectory "/opt/emprely/orcamentos"
```

Health esperado:

```powershell
Invoke-RestMethod https://api.emprely.com.br/health/live
Invoke-RestMethod https://api.emprely.com.br/health/ready
```

## Web S3 + CloudFront

Runbook completo: `docs/product/webapp-s3-cloudfront-deploy.md`.

No build do web:

```txt
VITE_API_BASE_URL=https://api.emprely.com.br
```

Depois do build, publicar `apps/web/dist` no bucket S3 do app e invalidar o CloudFront quando necessario.

O painel administrativo nao exige build separado. A rota `/admin` e servida pelo mesmo SPA e consome a mesma `VITE_API_BASE_URL`.

Com scripts:

```powershell
pnpm web:build:beta
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web" -DistributionId "<cloudfront-id>"
```

Smoke esperado:

```powershell
Invoke-WebRequest https://app.emprely.com.br
```

## Alertas de custo

Antes de liberar beta real, criar AWS Budgets/alertas para pelo menos:

- US$ 5;
- US$ 10;
- US$ 20.

## Aceite manual minimo

- Criar conta nova.
- Confirmar email via SES.
- Solicitar recuperacao de senha via SES.
- Fazer login.
- Configurar conta e logomarca.
- Cadastrar cliente com WhatsApp valido.
- Cadastrar servico.
- Criar e gerar proposta.
- Testar imprimir/PDF no navegador.
- Testar WhatsApp em dispositivo real.
- Enviar formulario publico em `/suporte`.
- Acessar `https://app.emprely.com.br/admin` e confirmar login administrativo com um admin `SuperAdmin` ja criado por processo operacional seguro.
- Validar listagem admin de usuarios, bloqueio/desbloqueio de usuario de teste e exportacao CSV.
- Ativar Plano Fundador via endpoint administrativo.
- Confirmar que health checks continuam 200 apos restart do container.

## Fallback Docker local

`infra/docker` continua versionado para validacao local, imagem base e plano B temporario. Para beta real de baixo custo, siga `infra/lightsail`.
