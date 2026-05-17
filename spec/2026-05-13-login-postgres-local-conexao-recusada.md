# Spec - Login com PostgreSQL local recusando conexao

## Visao geral

Corrigir a falha local de login causada por PostgreSQL indisponivel em `localhost:5432`.

## Escopo

Inclui:

- Validar listener da porta 5432.
- Subir o servico `postgres` do `docker-compose.yml`.
- Aplicar migrations da API.
- Testar `POST /api/auth/register` e `POST /api/auth/login`.

Fora do escopo:

- Alterar regras de autenticacao.
- Trocar banco de dados.
- Alterar contratos da API.
- Mudar layout do web.

## Fluxo ponta a ponta

1. Docker Compose cria/roda o container `emprely-postgres`.
2. API conecta no PostgreSQL usando `appsettings.Development.json`.
3. Migrations garantem schema atualizado.
4. Register cria usuario/conta para teste local.
5. Login retorna token JWT e dados de usuario/conta.

## Requisitos

- PostgreSQL deve escutar em `localhost:5432`.
- Banco `emprely` deve existir.
- Usuario `emprely` deve autenticar com senha `emprely_dev`.
- Migrations devem estar aplicadas.

## Regras de negocio

- Credenciais invalidas continuam retornando erro de autenticacao.
- Credenciais validas retornam access token e contexto da conta.

## Impactos por projeto

- API: validacao runtime/migration.
- Web: nenhum.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: uso do Compose local.

## Criterios de aceite

- `docker compose ps` mostra `emprely-postgres` healthy.
- `dotnet ef database update` conclui sem erro.
- API sobe localmente.
- `POST /api/auth/register` funciona para usuario de teste.
- `POST /api/auth/login` funciona para o mesmo usuario.
- Portas/processos temporarios usados no teste sao encerrados ao final.

## Estrategia de implementacao

- Corrigir o ambiente local primeiro, pois a excecao indica dependencia recusando conexao.
- Evitar alteracao de codigo se o comportamento voltar ao normal com banco disponivel.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api`
- Teste HTTP de register/login.
