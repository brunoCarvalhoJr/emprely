# Analise API - Robustez sessao auth MVP

## Contexto

O backend ja usa JWT Bearer, mas a bateria de integracao ainda nao cobre explicitamente endpoint protegido sem token.

## Objetivo

Adicionar regressao para confirmar `401` em `GET /api/me` sem autenticacao.

## Endpoints impactados

- `GET /api/me`

## Contratos impactados

- Requests: nenhum.
- Responses: `401 Unauthorized` sem token.

## Dominio impactado

- Entidades: nenhuma.
- Value objects: nenhum.
- Regras: nenhuma.

## Persistencia e integracoes

- Banco: sem alteracao.
- S3/SES/SQS: sem impacto.
- Auth/Billing: cobertura de autenticacao JWT.

## Multi-tenancy

Sem token, nenhum `ContaId` e resolvido.

## Riscos

- Nenhum risco relevante; teste cobre comportamento existente.

## Duvidas

- Sem duvidas bloqueantes.
