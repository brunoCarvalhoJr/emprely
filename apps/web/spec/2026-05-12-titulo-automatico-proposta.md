# Spec Web - Titulo automatico da proposta

## Visao geral

Reduzir atrito na criacao de proposta preenchendo o titulo automaticamente quando houver contexto suficiente.

## Rotas

- `/`: SPA React, view `propostas`.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: sem mudanca.
- Erro: sem mudanca.
- Sucesso: titulo e sugerido no campo existente.

## Componentes

- Formulario de proposta.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| titulo | text | Sim | Sugestao automatica ate 160 caracteres |

## Integracao com API

- Sem alteracao de request/response.

## Criterios de aceite

- Ao selecionar cliente com titulo vazio, preencher `Proposta para {Cliente}`.
- Ao adicionar o primeiro servico com cliente selecionado, preencher `Proposta de {Servico} para {Cliente}`.
- Ao criar cliente rapido, selecionar o cliente e preencher titulo quando estiver vazio.
- Se o usuario digitou titulo proprio, a automacao nao deve sobrescrever.
- Ao criar nova proposta, a memoria de titulo automatico deve ser reiniciada.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais:
  - Selecionar cliente sem titulo.
  - Adicionar primeiro servico sem titulo.
  - Digitar titulo proprio e depois trocar cliente.
  - Criar cliente rapido dentro da proposta.
