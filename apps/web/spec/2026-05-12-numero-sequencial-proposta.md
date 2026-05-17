# Spec Web - Numero sequencial da proposta

## Visao geral

Exibir o numero sequencial da proposta retornado pela API.

## Rotas

- `/`: SPA React, view `propostas`.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: sem mudanca.
- Erro: sem mudanca.
- Sucesso: proposta mostra numero formatado.

## Componentes

- Card de historico de proposta.
- Preview da proposta.
- Mensagem de WhatsApp.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- `PropostaResponse.numero`.
- Nenhuma request envia numero.

## Criterios de aceite

- Historico mostra `#0001`, `#0002` etc.
- Preview mostra o numero da proposta salva.
- WhatsApp inclui o numero quando existir.
- Busca de propostas encontra por numero.
- Duplicar proposta retorna e abre copia com novo numero.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais:
  - Criar duas propostas e ver numeros diferentes.
  - Duplicar proposta e ver novo numero.
  - Buscar proposta pelo numero.
