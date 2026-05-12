# Analise API - Clientes CRUD

## Contexto

Auth, conta, sessao e perfil profissional ja estao funcionais. O proximo bloco do MVP e permitir que cada conta cadastre clientes para usar na criacao guiada de propostas.

## Objetivo

Criar CRUD de clientes por conta autenticada, mantendo isolamento por `conta_id` do token.

## Endpoints impactados

- `GET /api/customers`
- `GET /api/customers/{id}`
- `POST /api/customers`
- `PUT /api/customers/{id}`
- `DELETE /api/customers/{id}`

## Contratos impactados

- Requests:
  - `CreateClienteRequest`
  - `UpdateClienteRequest`
- Responses:
  - `ClienteResponse`

## Dominio impactado

- Entidades:
  - `Cliente`
  - `Conta`
- Value objects:
  - Nenhum nesta entrega.
- Regras:
  - Cliente sempre pertence a uma conta.
  - Request nao aceita `contaId`.
  - `DELETE` arquiva o cliente em vez de remover fisicamente.
  - Listagem retorna apenas clientes ativos.

## Persistencia e integracoes

- Banco:
  - Nova tabela `clientes`.
  - FK obrigatoria para `contas`.
- S3/SES/SQS:
  - Nao impactado.
- Auth/Billing:
  - Endpoints exigem JWT.
  - Trial/plano pago nao impactado.

## Multi-tenancy

Todos os filtros usam `currentContaContext.ContaId`. Atualizacao, leitura por id e arquivamento buscam sempre por `id + conta_id`.

## Riscos

- Ainda nao ha propostas vinculadas, entao arquivamento nao precisa validar dependencias.
- Email/documento duplicado nao sera bloqueado nesta etapa para evitar atrito no MVP.

## Duvidas

- Cliente deve ser pessoa fisica, juridica ou ambos? Decisao atual: campo generico `Nome`, com documento opcional.
- Delete deve apagar ou arquivar? Decisao atual: arquivar, para preservar historico futuro.
- Campos obrigatorios alem do nome? Decisao atual: somente nome.
