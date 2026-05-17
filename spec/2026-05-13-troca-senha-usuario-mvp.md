# Spec - Troca senha usuario MVP

## Visao geral

Permitir que o usuario autenticado altere a propria senha antes do beta.

## Escopo

Inclui:

- Endpoint `PUT /api/me/password`.
- Formulario web na area Conta.
- Validacao de senha atual, nova senha e confirmacao.
- Testes de API e E2E web mockado.

Fora do escopo:

- Esqueci minha senha por email.
- Refresh token.
- Revogacao de todos os tokens ativos.
- Painel administrativo de usuario.
- Prints, imagens e layout final.

## Fluxo ponta a ponta

1. Usuario logado abre Conta.
2. Preenche senha atual e nova senha.
3. Web chama `PUT /api/me/password`.
4. API troca a senha via Identity.
5. Web exibe confirmacao e limpa os campos.
6. Login futuro usa a nova senha.

## Requisitos

- Endpoint exige Bearer token.
- Senha atual incorreta retorna `400`.
- Confirmacao diferente retorna `400`.
- Nova senha fraca retorna `400`.
- Sucesso retorna `204`.

## Regras de negocio

- O usuario altera apenas a propria senha.
- A politica de senha continua a mesma do cadastro.

## Impactos por projeto

- API: MeController e Contracts/Auth.
- Web: api client, types, App.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: docs.

## Criterios de aceite

- `pnpm validate:beta` passa.
- Teste de integracao valida senha atual incorreta e troca correta.
- E2E web valida formulario de troca de senha com API mockada.
- Documentacao indica que recuperacao por email esta fora desta rodada.

## Estrategia de implementacao

- Criar request em Contracts.
- Injetar `UserManager<UsuarioAplicacao>` no MeController.
- Implementar `ChangeSenhaUsuario`.
- Adicionar form e mutation no web.
- Atualizar docs.

## Testes

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `pnpm --dir apps/web test:e2e`
- `dotnet test apps/api/Emprely.sln`
- `pnpm validate:beta`
