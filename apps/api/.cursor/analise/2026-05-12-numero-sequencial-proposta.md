# Analise API - Numero sequencial da proposta

## Contexto

O MVP ja permite criar, duplicar, gerar, compartilhar e acompanhar propostas. Falta uma identificacao simples por conta para o usuario reconhecer rapidamente cada orcamento no historico, no preview, na impressao/PDF e na mensagem de WhatsApp.

## Objetivo

Adicionar numero sequencial por conta para propostas, começando em `1` e sem reaproveitar numeros de propostas arquivadas.

## Endpoints impactados

- `POST /api/proposals`
- `POST /api/proposals/{id}/duplicate`
- `GET /api/proposals`
- `GET /api/proposals/{id}`

## Contratos impactados

- Responses:
  - `PropostaResponse` passa a retornar `numero`.
- Requests:
  - Sem mudanca. O cliente nao informa numero.

## Dominio impactado

- Entidades: `Proposta`.
- Regras:
  - `Numero` e obrigatorio e maior que zero.
  - Numero e atribuido na criacao.
  - Editar proposta nao altera numero.
  - Duplicar proposta cria novo numero.

## Persistencia e integracoes

- Banco:
  - Adicionar coluna `Numero` em `propostas`.
  - Criar indice unico por `ContaId` + `Numero`.
  - Preencher propostas existentes com `ROW_NUMBER` por conta.
- S3/SES/SQS: nao aplicavel.
- Auth/Billing: sem alteracao.

## Multi-tenancy

O proximo numero e calculado dentro da conta autenticada (`ContaId` do `ICurrentContaContext`). O indice unico garante que duas contas possam ter o mesmo numero, mas a mesma conta nao.

## Riscos

- O calculo `max + 1` e suficiente para MVP, mas pode exigir estrategia transacional/lock se houver muita concorrencia criando proposta simultaneamente.
- Numeracao formatada (`#0001`) fica no frontend; o banco guarda inteiro.

## Duvidas

Nao ha duvida bloqueante. Prefixo personalizado por conta pode ser avaliado depois do MVP.
