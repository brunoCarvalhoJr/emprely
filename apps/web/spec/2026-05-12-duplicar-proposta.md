# Spec Web - Duplicar proposta

## Visao geral

Permitir duplicar uma proposta diretamente no historico para acelerar propostas recorrentes ou parecidas.

## Rotas

- `/`: SPA React, view `propostas`.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: sem mudanca.
- Erro: erro da duplicacao aparece na area de mensagens de proposta.
- Sucesso: copia fica selecionada e aberta no formulario como rascunho.

## Componentes

- Botao `Duplicar` no card de proposta.
- Mutation React Query para `POST /api/proposals/{id}/duplicate`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- Criar funcao `duplicateProposta(id, token)`.
- Atualizar cache de propostas com a copia retornada.
- Invalidar query de propostas apos sucesso.

## Criterios de aceite

- Usuario consegue duplicar proposta ativa a partir do historico.
- Copia fica em `Rascunho`.
- Copia abre selecionada para edicao.
- Proposta original permanece inalterada.
- Se houver alteracao nao salva aberta, o usuario precisa confirmar descarte antes de duplicar.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais:
  - Duplicar proposta gerada.
  - Duplicar proposta enviada/aceita/recusada.
  - Duplicar com formulario aberto e alterado.
