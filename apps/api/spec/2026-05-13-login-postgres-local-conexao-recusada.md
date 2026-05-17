# Spec API - Login com PostgreSQL local recusando conexao

## Visao geral

Restaurar o login local garantindo disponibilidade do PostgreSQL configurado para desenvolvimento.

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

## Requests/Responses

- Sem alteracao de contrato.

## Validacoes

- Manter validacoes atuais de email, senha e conta.

## Persistencia

- Subir PostgreSQL local.
- Aplicar migrations existentes.
- Confirmar que a API consegue conectar pelo `EmprelyDbContext`.

## Seguranca

- Sem alteracao de JWT.
- Sem novas secrets no repositorio.

## Criterios de aceite

- Banco local aceita conexao em `localhost:5432`.
- Migrations aplicadas.
- Register retorna token para usuario de teste.
- Login retorna token para o mesmo usuario.
- Build e testes da API passam.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api`
- Requisicoes HTTP locais de register/login.
