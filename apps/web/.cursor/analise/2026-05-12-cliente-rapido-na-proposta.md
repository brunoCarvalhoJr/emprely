# Analise Web - Cliente rapido na proposta

## Contexto

O MVP ja permite cadastrar clientes em uma tela dedicada e criar propostas selecionando um cliente existente. No uso real, o usuario frequentemente percebe que o cliente ainda nao existe enquanto esta montando a proposta, e sair do fluxo quebra a continuidade.

## Objetivo da tela/fluxo

Permitir cadastrar um cliente basico diretamente na view de propostas e selecionar automaticamente esse cliente no formulario da proposta.

## Rotas impactadas

- SPA React, view `propostas`.

## Componentes impactados

- `App`
- Formulario de proposta
- Client API existente `createCliente`
- Query `["clientes", accessToken]`

## Formularios e validacao

- Campos:
  - `nome`
  - `email`
  - `telefone`
- Regras:
  - Nome obrigatorio com minimo de 2 caracteres.
  - Email opcional, mas quando informado precisa ser valido.
  - Telefone opcional.
  - Documento e observacoes ficam fora do cadastro rapido.

## Dados e chamadas de API

- Usa `POST /api/customers` existente.
- Ao salvar:
  - atualiza cache de clientes;
  - seleciona o novo cliente na proposta;
  - fecha o formulario rapido;
  - mostra mensagem de sucesso no fluxo de proposta.

## Responsividade e acessibilidade

- Formulario compacto dentro da area de proposta.
- Campos com labels visiveis.
- Botao claro para cancelar.

## Duvidas

Nao ha duvida bloqueante. Dados completos do cliente seguem editaveis na tela de clientes.
