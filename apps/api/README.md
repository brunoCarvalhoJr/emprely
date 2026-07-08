# Emprely API

API ASP.NET Core do Emprely Orçamentos.

## Estrutura

- `Emprely.Api`: controllers, health checks, OpenAPI e composição.
- `Emprely.Application`: casos de uso, validações e interfaces.
- `Emprely.Domain`: entidades, value objects e regras de domínio.
- `Emprely.Infrastructure`: banco, integrações e implementações externas.
- `Emprely.Contracts`: requests/responses públicos da API.

## Comandos

```powershell
dotnet restore Emprely.sln
dotnet build Emprely.sln
dotnet test Emprely.sln
dotnet ef database update --project src/Emprely.Infrastructure --startup-project src/Emprely.Api
dotnet run --project src/Emprely.Api/Emprely.Api.csproj
```

## Interfaces atuais

- `GET /health`
- `GET /health/live`
- `GET /health/ready`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/confirm-email`
- `POST /api/auth/resend-confirmation`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/confirm-change-email`
- `GET /api/me`
- `PUT /api/me/password`
- `PUT /api/me/email`
- `GET /api/account`
- `GET /api/billing/plans`
- `GET /api/billing/status`
- `POST /api/billing/checkouts`
- `POST /api/billing/cancel`
- `POST /api/webhooks/asaas`
- `GET /api/admin/billing/accounts/{contaId}`
- `POST /api/admin/billing/accounts/{contaId}/manual-credit`
- `GET /api/account/profile`
- `PUT /api/account/profile`
- `GET /api/customers`
- `GET /api/customers/{id}`
- `POST /api/customers`
- `PUT /api/customers/{id}`
- `DELETE /api/customers/{id}`
- `GET /api/services`
- `GET /api/services/{id}`
- `POST /api/services`
- `PUT /api/services/{id}`
- `DELETE /api/services/{id}`
- `GET /api/proposals`
- `GET /api/proposals/{id}`
- `POST /api/proposals`
- `PUT /api/proposals/{id}`: permitido para `Rascunho` e `Gerada`; retorna `409 Conflict` para `Enviada`, `Aceita` e `Recusada`.
- `POST /api/proposals/{id}/generate`
- `POST /api/proposals/{id}/duplicate`
- `POST /api/proposals/{id}/send`
- `POST /api/proposals/{id}/accept`
- `POST /api/proposals/{id}/reject`
- `DELETE /api/proposals/{id}`
- OpenAPI em ambiente local via `MapOpenApi`.

## Regra comercial atual

- Contas novas nascem em trial de 7 dias.
- O Plano Fundador pago e liberado pelo billing Asaas ou por credito manual auditado temporario.
- Nao existe mais endpoint legado de ativacao Fundador; credito manual temporario deve usar `POST /api/admin/billing/accounts/{contaId}/manual-credit` com Super Admin.
- Plano Fundador: R$ 19,99 mensal ou R$ 180,00 anual.
- Pix e cartao de credito usam checkout/cobranca hospedada no Asaas; o Emprely nao recebe dados sensiveis de cartao.
- Novo checkout exige dados do pagador (`pagador`) com tipo de pessoa, CPF/CNPJ, e-mail, telefone, CEP e endereco.
- Trial expirado bloqueia gerar e enviar proposta.
- Trial expirado permite criar clientes, servicos, propostas rascunho e duplicar propostas.
- Proposta `Gerada` pode ser editada e volta para `Rascunho` ao salvar.
- Propostas `Enviada`, `Aceita` e `Recusada` nao podem ser editadas diretamente; devem ser duplicadas para nova versao.
- Acoes bloqueadas por regra de status retornam `409 Conflict` com `message`.
- Usuario autenticado pode trocar a propria senha por `PUT /api/me/password`.
- Billing real usa Asaas, webhook persistido/processado por worker, reconciliacao admin/diaria com consulta remota e reembolso parcial/integral.
- `GET /api/billing/status` retorna assinatura, pagamento atual e historico de cobrancas dos ultimos 12 meses para a tela de plano.

## Banco local

Connection string padrão:

```txt
Host=localhost;Port=5432;Database=emprely;Username=emprely;Password=emprely_dev
```

Suba o PostgreSQL com o `docker-compose.yml` da raiz antes de aplicar migrations.

## Configuracao beta/staging

O `appsettings.json` base nao deve guardar secrets. Para ambiente fora do local, configure:

```txt
ASPNETCORE_ENVIRONMENT=Staging
ConnectionStrings__EmprelyDb=Host=<host>;Port=5432;Database=emprely;Username=<usuario>;Password=<senha>
Jwt__Issuer=Emprely
Jwt__Audience=Emprely.Web
Jwt__SigningKey=<chave-com-pelo-menos-32-caracteres>
Jwt__ExpirationMinutes=120
Cors__OrigensPermitidas__0=https://app.emprely.com.br
App__PublicWebUrl=https://app.emprely.com.br
AdminOperacoes__OperationsKey=<chave-admin-com-pelo-menos-32-caracteres>
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
LogoPerfilStorage__S3BucketName=<bucket-assets-emprely>
LogoPerfilStorage__S3KeyPrefix=uploads/account-logos
LogoPerfilStorage__S3PublicBaseUrl=https://dz3i7ivpc873w.cloudfront.net
LogoPerfilStorage__S3Region=us-east-1
Asaas__BaseUrl=https://api.asaas.com/v3
Asaas__ApiKey=<asaas-api-key>
Asaas__WebhookToken=<asaas-webhook-token>
Asaas__CheckoutSuccessUrl=https://app.emprely.com.br/billing/sucesso
Asaas__CheckoutCancelUrl=https://app.emprely.com.br/billing/cancelado
Asaas__CheckoutExpiredUrl=https://app.emprely.com.br/billing/expirado
```

Use `appsettings.Staging.example.json` apenas como referencia; nao grave secrets reais no repositorio.

Para o deploy Lightsail, os segredos Asaas ficam fora do repo em `D:\Emprely\Segredos`:

- `ASAAS-SANDBOX-API-KEYY.env`: `Asaas__BaseUrl` e `Asaas__ApiKey` sandbox.
- `ASAAS-PROD-API-KEYY.env`: `Asaas__BaseUrl` e `Asaas__ApiKey` producao.
- `ASAAS-TOKEN-WEBHOOK.env`: `Asaas__WebhookToken` configurado no painel Asaas.

Use `pnpm lightsail:asaas:prod` para atualizar `D:\Emprely\Segredos\lightsail.env` antes de publicar a API em producao. Use `pnpm lightsail:asaas:sandbox` apenas para smoke sandbox. Os comandos criam backup do env privado e nao exibem valores secretos.

O email oficial inicial da API e `contato@emprely.com.br`. Use esse endereco como remetente transacional e destino de suporte/contato ate haver decisao de criar alias ou caixa separada.

`EmailTransacional__Provider=Fake` nao envia email real; use apenas para smoke tecnico local. Para beta com usuarios reais, usar `EmailTransacional__Provider=SES`.

O contato publico usa `POST /api/support/public`, aceita visitante sem JWT, aplica rate limit e envia para `EmailTransacional__SuporteDestinoEmail`.

Estado atual em 2026-06-17:

- Amazon SES em `us-east-1` configurado como provedor transacional real.
- Dominio `emprely.com.br` verificado no SES e acesso a producao concedido.
- Envio real por `contato@emprely.com.br` validado.
- Zoho Mail permanece como caixa de entrada/resposta manual.
- Templates transacionais centralizados em `EmailTransacionalTemplateBuilder`, com logo real, botao de acao, fallback de link e copy pt-BR revisada.
- Build da API validado apos revisao dos templates.

## Data Protection keys

A API persiste Data Protection keys no Postgres usando `EmprelyDbContext` e a tabela `data_protection_keys`.
Isso evita que links de confirmacao, recuperacao de senha e alteracao de email quebrem apos restart/deploy da API.

Antes do beta real, aplique as migrations no Neon para garantir que essa tabela existe.

## Lightsail, Caddy e upload de logomarca

O caminho oficial do beta inicial e Lightsail Linux US$7/mes com Docker Compose + Caddy. O suporte Lambda fica mantido como alternativa futura e so e ativado quando `AWS_LAMBDA_FUNCTION_NAME` existe no ambiente.

A API usa forwarded headers para funcionar atras do proxy reverso Caddy, que expõe `https://api.emprely.com.br` e encaminha para Kestrel em `api:8080`.

O upload de logo usa `LogoPerfilStorage__Provider`:

- `Local`: grava em `wwwroot/uploads/account-logos` e serve por static files; use apenas em desenvolvimento/testes.
- `S3`: envia o WebP para S3 e retorna URL baseada em `LogoPerfilStorage__S3PublicBaseUrl`.
- `Disabled`: desativa temporariamente o endpoint de upload com erro controlado.

No beta em Lightsail, configure `Provider=S3`. `Disabled` serve apenas para subir a API temporariamente sem upload de logomarca.

Estado atual em 2026-06-16:

- API publicada em `https://api.emprely.com.br`.
- Health validado em `/health/live` e `/health/ready`.
- Runtime remoto em `/opt/emprely/orcamentos`.
- Assets/logos via S3 privado + CloudFront em `https://dz3i7ivpc873w.cloudfront.net`.

Runbook e arquivos do deploy ficam em `infra/lightsail`.

## Hardening beta

A API aplica headers basicos de seguranca em todas as respostas:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy`
- `Content-Security-Policy`

`api/auth` e `api/admin` usam rate limit configuravel. Quando o limite e excedido, a API retorna `429`.

Para ativar Plano Fundador manualmente no beta:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://api.emprely.com.br/api/admin/billing/accounts/<contaId>/manual-credit" `
  -Headers @{ "X-Emprely-Admin-Key" = "<chave-admin>" }
```
