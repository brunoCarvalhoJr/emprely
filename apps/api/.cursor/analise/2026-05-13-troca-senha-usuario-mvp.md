# Analise API - Troca senha usuario MVP

## Contexto

API usa ASP.NET Identity para cadastro/login, mas nao expoe troca de senha.

## Objetivo

Permitir troca da propria senha para usuario autenticado.

## Endpoints impactados

- `PUT /api/me/password`

## Contratos impactados

- Requests: `ChangeSenhaUsuarioRequest`.
- Responses: `204 No Content` ou validacao.

## Dominio impactado

- Entidades: UsuarioAplicacao.
- Value objects: nenhum.
- Regras: politica de senha do Identity.

## Persistencia e integracoes

- Banco: atualizar hash de senha Identity.
- S3/SES/SQS: sem impacto.
- Auth/Billing: sem impacto em billing; auth usa senha nova nos proximos logins.

## Multi-tenancy

Usuario atual vem do token; troca nao altera conta.

## Riscos

- Tokens ja emitidos continuam validos ate expirar.

## Duvidas

- Sem duvidas bloqueantes.
