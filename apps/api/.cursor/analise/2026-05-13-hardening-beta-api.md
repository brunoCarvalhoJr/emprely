# Analise API - Hardening beta API

## Contexto

API esta funcional para MVP, mas ainda precisa de protecoes basicas para beta externo.

## Objetivo

Adicionar headers de seguranca e rate limit nativo.

## Endpoints impactados

- Todos recebem headers.
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/admin/accounts/{contaId}/activate-founder`

## Contratos impactados

- Requests: nenhum.
- Responses: headers adicionais e possivel `429`.

## Dominio impactado

- Entidades: nenhuma.
- Value objects: nenhum.
- Regras: nenhuma regra de negocio alterada.

## Persistencia e integracoes

- Banco: sem alteracao.
- S3/SES/SQS: sem impacto.
- Auth/Billing: auth recebe rate limit.

## Multi-tenancy

Rate limit particiona por IP, host e usuario quando existir.

## Riscos

- Limites devem ser monitorados no beta para evitar falso positivo.

## Duvidas

- Sem duvidas bloqueantes.
