# Spec - Sprint 1 Auth e Conta

## Visão geral

Implementar backend base com EF Core, PostgreSQL, ASP.NET Identity, JWT e conta inicial, além de uma tela React/Vite para cadastro/login.

## Escopo

Inclui:

- Entidades `Conta` e `MembroConta`.
- `UsuarioAplicacao` baseado em ASP.NET Identity.
- `EmprelyDbContext` com PostgreSQL.
- JWT bearer authentication.
- Endpoints `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me`, `GET /api/account`.
- Migration inicial.
- Tela web com cadastro, login e consulta do usuário atual.

Fora do escopo:

- Refresh token.
- Recuperação de senha.
- Confirmação de email.
- CRUD de clientes/serviços/propostas.
- Autorização por papel além do vínculo owner.

## Contratos

### POST /api/auth/register

Request:

```json
{
  "nome": "Bruno Carvalho",
  "email": "bruno@email.com",
  "senha": "Senha@123",
  "nomeConta": "Emprely"
}
```

### POST /api/auth/login

Request:

```json
{
  "email": "bruno@email.com",
  "senha": "Senha@123"
}
```

### Auth response

```json
{
  "accessToken": "...",
  "expiresAtUtc": "2026-05-12T00:00:00Z",
  "usuario": {},
  "conta": {}
}
```

## Critérios de aceite

- API compila e testes existentes passam.
- Migration inicial é criada.
- Web compila com Vite.
- Cadastro/login chamam a API configurada por `VITE_API_BASE_URL`.
- Endpoints protegidos exigem bearer token.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln`
- `pnpm lint:web`
- `pnpm build:web`
