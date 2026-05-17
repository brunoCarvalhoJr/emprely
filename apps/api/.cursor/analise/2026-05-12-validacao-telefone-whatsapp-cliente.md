# Analise API - Validacao de telefone WhatsApp do cliente

## Contexto

O MVP ja permite cadastrar clientes, criar propostas e abrir WhatsApp com mensagem pronta. O telefone do cliente ainda aceita qualquer texto, o que pode gerar links de WhatsApp incorretos ou sem destino.

## Objetivo

Validar telefone de cliente no dominio/API para aceitar telefone vazio ou telefone brasileiro valido para WhatsApp.

## Endpoints impactados

- `POST /api/customers`
- `PUT /api/customers/{id}`

## Contratos impactados

- Requests:
  - `Telefone` continua opcional.
- Responses:
  - Sem mudanca.

## Dominio impactado

- Entidade: `Cliente`.
- Regras:
  - Telefone vazio continua permitido.
  - Telefone preenchido precisa conter 10 ou 11 digitos nacionais, ou 12/13 digitos com prefixo `55`.
  - Formatacao com espacos, parenteses, hifen e `+` e aceita, pois a validacao usa apenas digitos.

## Persistencia e integracoes

- Banco: sem alteracao de schema.
- WhatsApp: valida a base de dados que alimenta o link `wa.me`.

## Multi-tenancy

Sem mudanca. Cliente continua protegido por `ContaId`.

## Riscos

- Telefones internacionais fora do Brasil ficam fora do MVP.
- Clientes antigos com telefone invalido podem precisar de ajuste manual ao editar.

## Duvidas

Nao ha duvida bloqueante. Suporte internacional pode ser planejado depois.
