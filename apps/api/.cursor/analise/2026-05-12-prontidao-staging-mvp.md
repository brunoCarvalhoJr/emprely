# Analise API - Prontidao staging MVP

## Contexto

A API ja atende o fluxo principal do MVP, mas ainda tem CORS local hardcoded e valores dev no appsettings base.

## Objetivo

Permitir que a API rode em beta/staging com configuracao explicita e endpoints de health adequados para operacao.

## Endpoints impactados

- `GET /health`
- `GET /health/live`
- `GET /health/ready`

## Contratos impactados

- Requests: nenhum.
- Responses: payload tecnico simples de health/readiness.

## Dominio impactado

- Entidades: nenhuma.
- Value objects: nenhum.
- Regras: nenhuma regra comercial alterada.

## Persistencia e integracoes

- Banco: readiness valida conectividade via `EmprelyDbContext`.
- S3/SES/SQS: sem impacto.
- Auth/Billing: JWT passa a exigir secret por ambiente fora de Development.

## Multi-tenancy

Sem alteracao. Os endpoints de health nao acessam dados de conta.

## Riscos

- Ambiente staging sem `Cors:OrigensPermitidas` deve falhar cedo.
- Ambiente staging sem connection string/JWT deve falhar cedo.

## Duvidas

- Sem duvidas bloqueantes. Assumo que secrets serao fornecidos pelo host.
