# Spec Web - Cliente rapido na proposta

## Visao geral

Permitir criar cliente sem sair da tela de proposta.

## Rotas

- `/`: SPA React, view `propostas`.

## Estados da interface

- Carregando: botao fica em estado `Salvando...`.
- Vazio: quando nao ha clientes, o usuario pode criar o primeiro no proprio fluxo.
- Erro: erro da API aparece no bloco de cliente rapido.
- Sucesso: novo cliente fica selecionado no formulario da proposta.

## Componentes

- Botao `Novo cliente` ao lado do seletor de cliente.
- Formulario compacto de cliente rapido.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| nome | text | Sim | 2 a 160 caracteres |
| email | email | Nao | Email valido quando preenchido |
| telefone | text | Nao | Ate 40 caracteres |

## Integracao com API

- `createCliente`.
- Atualiza query/cache de `clientes`.
- Preenche `propostaForm.clienteId` com o `id` retornado.

## Criterios de aceite

- Usuario cria cliente na tela de proposta sem navegar para `Clientes`.
- Cliente criado aparece no select imediatamente.
- Cliente criado fica selecionado na proposta.
- Formulario da proposta fica marcado como alterado para o usuario salvar a proposta.
- Usuario ainda pode abrir a tela completa de clientes quando precisar.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais:
  - Criar primeiro cliente a partir de proposta.
  - Criar cliente com lista ja existente.
  - Cancelar cadastro rapido sem alterar proposta.
