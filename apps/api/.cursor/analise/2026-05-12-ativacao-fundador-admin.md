# Analise API - Ativacao Fundador Admin

## Contexto

A rota de conta atual permite autoativar Plano Fundador. Isso nao deve ir para beta porque billing real ainda nao existe.

## Objetivo

Bloquear autoativacao e criar endpoint administrativo simples, protegido por chave operacional.

## Endpoints impactados

- `POST /api/account/activate-founder`
- `POST /api/admin/accounts/{contaId}/activate-founder`

## Contratos impactados

- Requests: header `X-Emprely-Admin-Key`.
- Responses: `AdminContaResponse`.

## Dominio impactado

- Entidades: `Conta`.
- Value objects: nenhum.
- Regras: `Conta.ActivatePlanoFundador()` continua sendo a regra central.

## Persistencia e integracoes

- Banco: atualizar conta existente.
- S3/SES/SQS: sem impacto.
- Auth/Billing: billing real permanece fora; endpoint admin usa chave operacional.

## Multi-tenancy

Endpoint admin recebe `contaId` explicitamente e nao usa o contexto do usuario logado.

## Riscos

- Chave administrativa ausente ou fraca deve bloquear a operacao.
- Endpoint admin precisa ser documentado como uso interno.

## Duvidas

- Sem duvidas bloqueantes.
