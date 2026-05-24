# Analise API - Campos opcionais de endereco e numero no cliente

## Contexto

Clientes sao gerenciados por `/api/customers`, com dados persistidos em `clientes`. Hoje a entidade possui nome, e-mail, telefone, documento e observacoes.

## Objetivo

Persistir `Endereco` e `Numero` como campos opcionais de cliente, retornando os valores nas consultas e aceitando-os em criacao/edicao.

## Endpoints impactados

- `GET /api/customers`
- `GET /api/customers/{id}`
- `POST /api/customers`
- `PUT /api/customers/{id}`

## Contratos impactados

- Requests: `CreateClienteRequest`, `UpdateClienteRequest`.
- Responses: `ClienteResponse`.

## Dominio impactado

- Entidades: `Cliente`.
- Value objects: nenhum.
- Regras: normalizar strings opcionais com trim e salvar `null` quando vazio.

## Persistencia e integracoes

- Banco: adicionar colunas nullable `Endereco` e `Numero` em `clientes`.
- S3/SES/SQS: sem impacto.
- Auth/Billing: sem impacto.

## Multi-tenancy

O isolamento continua via `ContaId` no controller, sem alterar a resolucao do tenant.

## Riscos

- Atualizar todos os construtores posicionais para evitar quebra de compilacao.
- Garantir migracao nullable para manter clientes existentes.

## Duvidas

- Nenhuma bloqueante; o pedido define os campos como opcionais.
