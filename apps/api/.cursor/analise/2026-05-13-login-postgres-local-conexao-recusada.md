# Analise API - Login com PostgreSQL local recusando conexao

## Contexto

O endpoint de login usa ASP.NET Identity com EF Core/PostgreSQL. A excecao exibida no debugger informa conexao recusada, e a porta local `5432` nao possui listener ativo.

## Camadas impactadas

- API: `AuthController`.
- Application: sem mudanca esperada.
- Domain: sem mudanca esperada.
- Infrastructure: conexao `EmprelyDbContext` com PostgreSQL.
- Contracts: sem mudanca.

## Endpoints impactados

- `POST /api/auth/login`
- `POST /api/auth/register`, para teste de usuario local.

## Contratos

- Manter requests/responses atuais.
- Nao alterar status codes esperados.

## Banco de dados

- PostgreSQL local via Docker Compose.
- Database: `emprely`.
- User: `emprely`.
- Migrations devem estar atualizadas.

## Regras de negocio

- Login depende de usuario existente no banco.
- Falha de infraestrutura nao deve ser confundida com senha invalida.

## Riscos

- Docker ausente/parado impede validacao local.
- Banco recriado sem dados exigira novo cadastro local.

## Duvidas

- Nenhuma duvida bloqueante.
