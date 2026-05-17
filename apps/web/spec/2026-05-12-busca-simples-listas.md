# Spec Web - Busca simples nas listas

## Visao geral

Permitir buscar rapidamente clientes, servicos e propostas sem criar nova infraestrutura.

## Rotas

- `/`: SPA React, views `clientes`, `servicos` e `propostas`.

## Estados da interface

- Carregando: permanece igual.
- Vazio: quando nao ha nenhum registro cadastrado, exibe o vazio atual.
- Sem resultado: quando existe registro, mas a busca nao encontra nada, exibe mensagem contextual.
- Sucesso: lista mostra apenas registros compatíveis com a busca.

## Componentes

- Campo `Buscar clientes`.
- Campo `Buscar servicos`.
- Campo `Buscar propostas`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| buscaClientes | search | Nao | Texto livre |
| buscaServicos | search | Nao | Texto livre |
| buscaPropostas | search | Nao | Texto livre |

## Integracao com API

- Sem nova chamada de API.
- Usa dados das queries existentes:
  - `getClientesConta`
  - `getServicosConta`
  - `getPropostasConta`

## Criterios de aceite

- Usuario consegue filtrar clientes por nome, email, telefone, documento ou observacoes.
- Usuario consegue filtrar servicos por nome, categoria, descricao, tipo ou unidade.
- Usuario consegue filtrar propostas por titulo, cliente, status, texto ou itens.
- Busca de propostas combina com filtro de status.
- Quando nao ha resultado, a tela mostra mensagem sem apagar dados.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais:
  - Buscar cliente existente e inexistente.
  - Buscar servico existente e inexistente.
  - Buscar proposta por cliente e por item.
  - Combinar busca de proposta com filtro de status.
