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

## Interfaces iniciais

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`
- `GET /api/account`
- OpenAPI em ambiente local via `MapOpenApi`.

## Banco local

Connection string padrão:

```txt
Host=localhost;Port=5432;Database=emprely;Username=emprely;Password=emprely_dev
```

Suba o PostgreSQL com o `docker-compose.yml` da raiz antes de aplicar migrations.
