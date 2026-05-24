# Analise API - Redes sociais opcionais no cliente

## Contexto

Clientes sao gerenciados por `/api/customers`, com dados persistidos na tabela `clientes`. A alteracao anterior adicionou endereco e numero; agora entram tres novos contatos digitais opcionais.

## Objetivo

Persistir `Instagram`, `Facebook` e `TikTok` como campos opcionais de cliente, aceitando os valores em criacao/edicao e retornando nas consultas.

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

- Banco: adicionar colunas nullable `Instagram`, `Facebook` e `TikTok` em `clientes`.
- S3/SES/SQS: sem impacto.
- Auth/Billing: sem impacto.

## Multi-tenancy

O isolamento continua via `ContaId` no controller, sem alterar a resolucao do tenant.

## Riscos

- Atualizar todos os contratos posicionais para evitar quebra de compilacao.
- Usar colunas nullable para manter compatibilidade com clientes existentes.

## Duvidas

- Nenhuma bloqueante; o pedido define os campos como opcionais.
