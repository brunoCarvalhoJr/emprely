# Analise API - Cadastro Usuario CORS HTTPS Local

## Contexto

O cadastro de usuario no web local falhava com `Failed to fetch`.

No DevTools, a chamada de preflight `OPTIONS http://localhost:5262/api/auth/register` retornava `307 Temporary Redirect` para `https://localhost:7099/api/auth/register`.

Browsers nao aceitam redirect no preflight CORS. Por isso o POST real de cadastro nao era enviado.

## Objetivo

Permitir que o web local em `http://localhost:5173` consiga chamar a API local em `http://localhost:5262` sem redirect para HTTPS durante desenvolvimento.

## Endpoints impactados

- `OPTIONS /api/auth/register`
- `POST /api/auth/register`
- Demais endpoints chamados pelo web local em HTTP.

## Contratos impactados

- Requests:
  - Nenhum.
- Responses:
  - Nenhum.

## Dominio impactado

- Entidades:
  - Nenhuma.
- Value objects:
  - Nenhum.
- Regras:
  - Nenhuma regra de negocio alterada.

## Persistencia e integracoes

- Banco:
  - Sem alteracao.
- S3/SES/SQS:
  - Nao impactado.
- Auth/Billing:
  - Auth impactado apenas no transporte local HTTP/CORS.

## Multi-tenancy

Sem impacto em resolucao ou protecao de `conta_id`.

## Riscos

- Baixo risco para desenvolvimento local.
- Em ambientes fora de `Development`, o redirect HTTPS continua habilitado.

## Duvidas

- Sem duvidas bloqueantes para esta correcao.
