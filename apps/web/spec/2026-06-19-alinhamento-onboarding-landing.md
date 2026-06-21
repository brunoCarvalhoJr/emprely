# Spec Web - alinhamento onboarding landing

## Visao geral

Alinhar a primeira experiencia autenticada com a nova mensagem da landing.

## Rotas

- Dashboard autenticado.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: primeiros passos continuam aparecendo quando houver etapa pendente.
- Erro: sem mudanca.
- Sucesso: cards mantem comportamento atual.

## Componentes

- `DashboardContent`.
- `PrimeirosPassosDashboard`.
- `buildPrimeirosPassosDashboard`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Sem novos campos | - | - | - |

## Integracao com API

- Sem endpoint novo.
- Sem payload novo.

## Criterios de aceite

- Dashboard reforca "primeira proposta" e valor antes do preco.
- Passos orientam marca, cliente, servico e proposta com linguagem mais comercial.
- Nenhum fluxo de clique ou chamada de API muda.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenario manual: abrir dashboard de conta nova e verificar copy dos primeiros passos.
