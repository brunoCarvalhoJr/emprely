# Analise - Preparacao deploy beta staging

## Contexto

O MVP funcional local do Emprely Orcamentos ja possui checklist final, runbook beta local e gate automatizado. O proximo passo e preparar a execucao fora da maquina local sem acoplar o projeto a um provedor especifico antes de uma decisao de infraestrutura.

## Objetivo

Criar um kit minimo de deploy beta/staging com Docker para API, web e PostgreSQL, usando variaveis de ambiente reais fora do repositorio e mantendo os arquivos versionados apenas como exemplos e documentacao.

## Projetos impactados

- API: empacotamento em container .NET para staging.
- Web: empacotamento Vite/React como estatico servido por Nginx.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: utilizados somente no install do workspace web.
- Infra: Dockerfiles, compose beta/staging e exemplos de ambiente.
- Docs: guia operacional de deploy beta/staging.

## Fluxo atual

O projeto possui `docker-compose.yml` local apenas para PostgreSQL e documentacao de variaveis para staging, mas ainda nao possui artefatos versionados para subir API e web em containers.

## Fluxo proposto

1. Criar Dockerfile da API.
2. Criar Dockerfile do web com build Vite e Nginx.
3. Criar configuracao Nginx para SPA.
4. Criar `docker-compose.beta.example.yml` para beta/staging controlado.
5. Criar `beta.env.example` com placeholders sem secrets reais.
6. Documentar comandos de build, up, migrations, health e rollback manual.
7. Adicionar script `validate:deploy` e incluir no gate `validate:mvp`.

## Regras de negocio

- Nenhum secret real deve entrar no repositorio.
- O deploy beta/staging nao muda regras comerciais do MVP.
- Plano Fundador continua ativado por operacao administrativa.
- Layout, prints e imagens seguem adiados.

## Impactos tecnicos

- O web Vite recebe `VITE_API_BASE_URL` em tempo de build.
- A API roda com `ASPNETCORE_ENVIRONMENT=Staging` e `ASPNETCORE_URLS=http://0.0.0.0:8080`.
- O PostgreSQL do compose beta usa volume separado do compose local.
- A validacao automatizada confere a sintaxe do compose beta sem subir containers.

## Riscos

- Se a URL publica da API mudar, o web precisa ser rebuildado por causa do Vite.
- O compose beta e adequado para beta controlado/VM simples, nao substitui arquitetura cloud definitiva.
- Migrations em staging precisam ser aplicadas com cuidado antes de liberar usuarios.

## Duvidas

- Provedor final ainda nao foi escolhido. Assumido: preparar uma base neutra em Docker Compose para beta controlado.
- Dominio final ainda nao foi definido. Assumido: usar placeholders e variaveis obrigatorias.
