# Spec - Corrigir preenchimento do perfil da conta no mobile

## Objetivo

Corrigir o formulario unificado de `Perfil da conta` para permitir edicao
normal dos dados no mobile, mantendo a arquitetura atual de React/Vite,
`react-hook-form` e a pagina unica de perfil.

## Escopo

- Remover registros duplicados do mesmo campo no `react-hook-form`.
- Separar `E-mail de acesso` de `E-mail de contato`.
- Adicionar cobertura E2E mobile que digita nos campos principais do perfil.

## Fora de escopo

- Alterar API ou banco de dados.
- Reabrir a separacao antiga entre configuracoes e personalizacao.
- Criar nova biblioteca de UI.

## Criterios de aceite

1. Em viewport mobile, os campos principais do perfil aceitam digitacao.
2. `E-mail de acesso` permanece readonly e mostra o login do usuario.
3. `E-mail de contato` fica editavel e usa o campo `emailContato` do perfil.
4. Salvar perfil envia o payload atualizado para `/api/account/profile`.
5. `pnpm --filter web lint`, `pnpm --filter web build` e teste E2E focado passam.
