# Spec Web - Troca senha usuario MVP

## Visao geral

Adicionar troca de senha para usuario logado.

## Rotas

- View Conta.

## Estados da interface

- Carregando: botao "Atualizando...".
- Vazio: campos vazios.
- Erro: `MensagemErro` com retorno da API.
- Sucesso: "Senha atualizada.".

## Componentes

- Area Conta.
- Cliente API.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Senha atual | password | Sim | minimo 1 |
| Nova senha | password | Sim | minimo 8 |
| Confirmar nova senha | password | Sim | igual a nova senha |

## Integracao com API

- `PUT /api/me/password`.

## Criterios de aceite

- Formulario aparece apenas logado.
- Sucesso limpa os campos.
- Erro nao limpa os campos.
- E2E mockado cobre o envio.

## Testes

- Lint: `pnpm --dir apps/web lint`
- Build: `pnpm --dir apps/web build`
- E2E: `pnpm --dir apps/web test:e2e`
