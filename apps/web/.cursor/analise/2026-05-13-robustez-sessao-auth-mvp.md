# Analise Web - Robustez sessao auth MVP

## Contexto

O web persiste somente o token, sem metadata de expiracao, e a limpeza de sessao depende de caminhos manuais.

## Objetivo da tela/fluxo

Melhorar sessao para beta sem mudar layout: expiração local, logout limpo e resposta automatica a `401`.

## Rotas impactadas

- Aplicacao principal.

## Componentes impactados

- Header/logout.
- Conteudo de autenticacao.
- Cliente HTTP.

## Formularios e validacao

- Campos: nenhum.
- Regras: login/cadastro mantidos.
- Mensagens: sessão expirada deve aparecer no bloco de auth.

## Dados e chamadas de API

- Queries: qualquer query autenticada pode disparar encerramento por `401`.
- Mutations: qualquer mutation autenticada pode disparar encerramento por `401`.
- Estados de loading/erro/vazio: sessão inválida volta para auth.

## Responsividade e acessibilidade

- Sem alteração visual relevante.

## Duvidas

- Sem duvidas bloqueantes.
