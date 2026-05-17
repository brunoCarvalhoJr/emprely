# Analise - Login com PostgreSQL local recusando conexao

## Contexto

Ao tentar fazer login, o backend interrompe no debugger com `SocketException: Nenhuma conexao pode ser feita porque a maquina de destino as recusou ativamente`. A configuracao local da API aponta `ConnectionStrings:EmprelyDb` para `Host=localhost;Port=5432;Database=emprely;Username=emprely;Password=emprely_dev`.

## Objetivo

Restaurar o fluxo local de login garantindo que o PostgreSQL local esteja rodando, com schema atualizado, antes de testar o endpoint de autenticacao.

## Projetos impactados

- API: validacao de runtime e migrations.
- Web: nao impactado.
- Mobile: nao impactado.
- Landing: nao impactado.
- Packages: nao impactado.
- Infra: `docker-compose.yml` usado para subir PostgreSQL local.

## Fluxo atual

O frontend chama `/api/auth/login`, a API tenta acessar o banco via EF Core/Identity e a conexao TCP com `localhost:5432` e recusada porque nao existe listener ativo nessa porta.

## Fluxo proposto

1. Subir `postgres` via Docker Compose.
2. Aguardar health check do container.
3. Aplicar migrations da API.
4. Rodar build/test da solution.
5. Subir API temporariamente e testar register/login via HTTP local.
6. Encerrar processos de teste conforme combinado.

## Regras de negocio

- Login continua validando usuario e senha pelo ASP.NET Identity.
- Nenhum contrato publico de API sera alterado.
- Nenhuma secret real sera adicionada ao repositorio.

## Impactos tecnicos

- Nao ha necessidade inicial de mudar codigo se a causa for apenas banco parado.
- Se o banco subir e o erro persistir, revisar configuracao de connection string, migrations e endpoint de login.

## Riscos

- Se Docker Desktop estiver indisponivel, o PostgreSQL local nao sobe.
- Se o volume local estiver vazio, pode ser necessario reaplicar migrations e recriar usuario de teste.
- Se o debugger estiver configurado para quebrar em excecoes de banco, ele pode interromper antes do tratamento HTTP.

## Duvidas

- Nenhuma duvida bloqueante; o erro e consistente com dependencia local parada.
