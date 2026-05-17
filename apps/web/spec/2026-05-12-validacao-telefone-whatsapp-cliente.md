# Spec Web - Validacao de telefone WhatsApp do cliente

## Visao geral

Evitar cadastro de telefone invalido e impedir link de WhatsApp com destino incorreto.

## Rotas

- `/`: SPA React, views `clientes` e `propostas`.

## Estados da interface

- Carregando: sem mudanca.
- Erro: formulario mostra mensagem no campo telefone.
- Sucesso: telefone valido permite salvar cliente e abrir WhatsApp com destino.

## Componentes

- Formulario de cliente.
- Formulario de cliente rapido.
- Acoes de WhatsApp da proposta.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| telefone | text | Nao | 10/11 digitos nacionais ou 12/13 com prefixo 55 |

## Integracao com API

- `POST /api/customers`
- `PUT /api/customers/{id}`

## Criterios de aceite

- Telefone vazio continua permitido.
- Telefone `(11) 99999-9999` e aceito.
- Telefone `+55 11 99999-9999` e aceito.
- Telefone curto/incompleto e rejeitado no formulario.
- Link de WhatsApp so usa telefone quando ele for valido; caso contrario abre com mensagem sem numero.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais:
  - Criar cliente com telefone valido.
  - Criar cliente rapido com telefone invalido.
  - Abrir WhatsApp de proposta com e sem telefone.
