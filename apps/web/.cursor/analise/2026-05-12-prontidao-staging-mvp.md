# Analise Web - Prontidao staging MVP

## Contexto

O web chama a API usando `VITE_API_BASE_URL`, mas ainda cai em `localhost` por padrao.

## Objetivo da tela/fluxo

Garantir que o build usado em beta/staging aponte para a API correta e nao dependa silenciosamente de localhost.

## Rotas impactadas

- Todas as rotas que usam o cliente HTTP.

## Componentes impactados

- Nenhum componente visual.

## Formularios e validacao

- Campos: nenhum.
- Regras: nenhuma.
- Mensagens: nenhuma.

## Dados e chamadas de API

- Queries: todas passam pelo mesmo `apiFetch`.
- Mutations: todas passam pelo mesmo `apiFetch`.
- Estados de loading/erro/vazio: sem alteracao.

## Responsividade e acessibilidade

- Fora do escopo desta rodada.

## Duvidas

- Sem duvidas bloqueantes. Assumo que a URL publica da API sera definida no ambiente de build do web.
