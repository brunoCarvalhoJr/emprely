# Spec Web - Prontidao staging MVP

## Visao geral

Preparar o cliente web para beta/staging usando URL de API por ambiente.

## Rotas

- Aplicacao inteira, por depender do cliente HTTP compartilhado.

## Estados da interface

- Carregando: sem alteracao.
- Vazio: sem alteracao.
- Erro: erros de API continuam exibidos pelos fluxos existentes.
- Sucesso: sem alteracao.

## Componentes

- Nenhum componente visual alterado.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- `VITE_API_BASE_URL` define a URL base.
- Em modo dev, se a variavel nao existir, usar `http://localhost:5262`.
- Em modo nao dev, se a variavel nao existir, falhar de forma explicita no runtime.
- Remover barras finais para evitar URLs como `https://api//api/customers`.

## Criterios de aceite

- Build do web continua passando sem `.env` local.
- E2E com API mockada continua passando.
- `.env.example` documenta local e staging.

## Testes

- Lint: `pnpm --dir apps/web lint`
- Build: `pnpm --dir apps/web build`
- E2E: `pnpm --dir apps/web test:e2e`
