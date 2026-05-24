# Spec Web - Bloco nao incluso neutro no template

## Visao geral

Alterar a exibicao de listas de itens nao inclusos em templates de proposta para tons neutros, evitando vermelho e a percepcao de erro/alerta.

## Rotas

- Propostas.

## Estados da interface

- Carregando: nao se aplica.
- Vazio: listas vazias continuam ocultas.
- Erro: nao se aplica.
- Sucesso: bloco "O que nao esta incluso" aparece em cinza/slate e com icone neutro.

## Componentes

- `DocumentoLista`.
- CSS dos cards de listas no documento.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Nao se aplica | - | - | - |

## Integracao com API

- Sem mudanca de contrato.

## Criterios de aceite

- O bloco "O que nao esta incluso" nao usa vermelho.
- Os icones de itens nao inclusos nao parecem erro.
- O bloco continua legivel no preview, modal, PDF e imagem.
- O bloco "O que esta incluso" permanece positivo/verde.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
