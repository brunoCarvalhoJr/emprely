# Analise API - Duplicar proposta

## Contexto

O MVP ja permite salvar, gerar, imprimir/PDF, compartilhar no WhatsApp e acompanhar status comercial de propostas. O proximo ganho funcional sem mexer em imagens ou layout e permitir reaproveitar uma proposta existente como base de uma nova negociacao.

## Objetivo

Adicionar uma operacao para duplicar proposta ativa da conta autenticada, criando uma nova proposta em `Rascunho` com os mesmos dados comerciais e itens da proposta original.

## Endpoints impactados

- `POST /api/proposals/{id}/duplicate`
- `GET /api/proposals`
- `GET /api/proposals/{id}`

## Contratos impactados

- Requests: sem body.
- Responses: reutiliza `PropostaResponse`.

## Dominio impactado

- Entidades: `Proposta`.
- Value objects: `PropostaItemDados`.
- Regras:
  - Proposta arquivada nao pode ser duplicada.
  - Copia sempre nasce como `Rascunho`.
  - Copia preserva cliente, introducao, observacoes, validade e itens.
  - Titulo da copia recebe sufixo ` (copia)`.

## Persistencia e integracoes

- Banco: sem mudanca de schema.
- S3/SES/SQS: nao aplicavel.
- Auth/Billing: endpoint exige JWT e respeita `ContaId` do usuario autenticado.

## Multi-tenancy

O `ContaId` vem de `ICurrentContaContext`. A proposta original so pode ser buscada dentro da conta autenticada, e a copia usa o mesmo `ContaId`.

## Riscos

- Ainda nao ha numeracao automatica de proposta; a copia sera diferenciada pelo titulo.
- Duplicar proposta aceita/recusada cria rascunho, nao uma nova proposta aceita/recusada.

## Duvidas

Nao ha duvida bloqueante. Numeracao automatica por conta pode entrar em uma etapa futura.
