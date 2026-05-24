# Spec Web - Remover descricoes dos cards do dashboard

## Visao geral

Remover as frases inferiores dos cards de metricas no dashboard.

## Rotas

- Dashboard.

## Estados da interface

- Carregando: sem mudanca.
- Vazio: valores continuam aparecendo como `0`.
- Erro: sem mudanca.
- Sucesso: cards mostram titulo, numero e icone.

## Componentes

- `DashboardContent`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- Sem mudanca.

## Criterios de aceite

- Nenhum card superior mostra frase abaixo do numero.
- Titulos, numeros e icones permanecem.

## Testes

- Lint: `pnpm.cmd --dir apps/web lint`.
- Build: `pnpm.cmd --dir apps/web build`.
- Busca textual pelas frases removidas.
