# Analise Web - Ativacao Fundador Admin

## Contexto

O web exibe botoes de ativacao do Plano Fundador e chama uma rota que permitia autoativacao.

## Objetivo da tela/fluxo

Remover a acao de autoativacao do usuario final, mantendo somente informacao de status e orientacao operacional.

## Rotas impactadas

- Aplicacao principal.

## Componentes impactados

- Area de propostas com bloqueio comercial.
- Card de plano/acesso.
- Lista tecnica de endpoints.

## Formularios e validacao

- Campos: nenhum.
- Regras: nenhuma.
- Mensagens: ajustar texto para ativacao manual interna.

## Dados e chamadas de API

- Mutations: remover `activatePlanoFundador`.
- Estados de loading/erro/vazio: remover estado de loading/erro da autoativacao.

## Responsividade e acessibilidade

- Sem alteracao visual relevante.

## Duvidas

- Sem duvidas bloqueantes.
