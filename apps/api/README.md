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
- `GET /api/me`
- `PUT /api/me/password`
- `GET /api/account`
- `POST /api/account/activate-founder` bloqueado para autoativacao
- `POST /api/admin/accounts/{contaId}/activate-founder`
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
- `PUT /api/proposals/{id}`
- `POST /api/proposals/{id}/generate`
- `POST /api/proposals/{id}/send`
- `POST /api/proposals/{id}/accept`
- `POST /api/proposals/{id}/reject`
- `DELETE /api/proposals/{id}`
- OpenAPI em ambiente local via `MapOpenApi`.

## Regra comercial atual

- Contas novas nascem em trial de 7 dias.
- O Plano Fundador pode ser ativado manualmente por operacao admin em `POST /api/admin/accounts/{contaId}/activate-founder`.
- Trial expirado bloqueia gerar e enviar proposta.
- Usuario autenticado pode trocar a propria senha por `PUT /api/me/password`.
- Billing real fica para uma etapa futura.

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
AdminOperacoes__OperationsKey=<chave-admin-com-pelo-menos-32-caracteres>
RateLimit__AuthPermitLimit=30
RateLimit__AdminPermitLimit=10
RateLimit__WindowSeconds=60
```

Use `appsettings.Staging.example.json` apenas como referencia; nao grave secrets reais no repositorio.

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
  -Uri "https://api.emprely.com.br/api/admin/accounts/<contaId>/activate-founder" `
  -Headers @{ "X-Emprely-Admin-Key" = "<chave-admin>" }
```
