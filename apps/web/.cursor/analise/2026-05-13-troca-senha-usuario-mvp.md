# Analise Web - Troca senha usuario MVP

## Contexto

Area Conta ja concentra perfil, marca, plano e acesso. Falta seguranca basica de senha.

## Objetivo da tela/fluxo

Adicionar formulario de troca de senha na area Conta, sem refatorar layout.

## Rotas impactadas

- Aplicacao principal, view Conta.

## Componentes impactados

- Formulario de Conta.
- Cliente HTTP.

## Formularios e validacao

- Campos: senhaAtual, novaSenha, confirmarNovaSenha.
- Regras: obrigatorios, nova senha minimo 8, confirmacao igual.
- Mensagens: sucesso e erro da API.

## Dados e chamadas de API

- Mutations: `PUT /api/me/password`.
- Estados de loading/erro/vazio: loading no botao e mensagem de sucesso.

## Responsividade e acessibilidade

- Reusar componentes existentes.

## Duvidas

- Sem duvidas bloqueantes.
