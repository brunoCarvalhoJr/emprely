# Analise Web - Validacao de telefone WhatsApp do cliente

## Contexto

A tela web cadastra cliente na tela completa e no cadastro rapido dentro da proposta. O link de WhatsApp usa o telefone do cliente quando existe, mas telefone invalido pode gerar link incorreto.

## Objetivo da tela/fluxo

Validar telefone nos formularios de cliente e garantir que o link de WhatsApp so use telefone quando ele for valido.

## Rotas impactadas

- SPA React, views `clientes` e `propostas`.

## Componentes impactados

- `App`
- Formulario completo de cliente.
- Formulario rapido de cliente na proposta.
- Helper `normalizarTelefoneWhatsapp`.

## Formularios e validacao

- Campos:
  - `telefone`
- Regras:
  - Opcional.
  - Aceita `(11) 99999-9999`, `11999999999`, `+55 11 99999-9999`.
  - Rejeita quantidade de digitos incompatível.

## Dados e chamadas de API

- Sem nova chamada.
- Requests existentes passam a ser validadas antes do envio.

## Responsividade e acessibilidade

- Mantem labels visiveis e mensagens de erro do formulario.

## Duvidas

Nao ha duvida bloqueante. Suporte internacional fica fora desta etapa.
