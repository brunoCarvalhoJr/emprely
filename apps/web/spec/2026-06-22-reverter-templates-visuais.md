# Spec Web - Reverter templates visuais

## Visao geral

Restaurar os templates visuais de proposta/orcamento para o estado anterior ao commit `9a67ab2`, mantendo o restante do produto sem refatoracao adicional.

## Rotas

- `/`: fluxo autenticado de propostas.
- Modal de visualizacao de proposta.

## Estados da interface

- Carregando: sem alteracao.
- Vazio: sem alteracao.
- Erro: sem alteracao.
- Sucesso: proposta gerada deve continuar permitindo visualizar, exportar PDF/imagem e compartilhar conforme comportamento anterior.

## Componentes

- Galeria/selecao de templates.
- Componentes `Template*` do documento de proposta.
- Estilos `.doc-*` usados pelos templates.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Template visual | hidden/select UI | Sim | Valor conhecido em `propostaTemplateVisualValores` |

## Integracao com API

- Sem mudanca de endpoint.
- Propostas podem continuar recebendo campos extras da API, mas o visual restaurado nao deve depender da refatoracao rejeitada.

## Criterios de aceite

- Templates voltam ao estado do commit `9a67ab2^`.
- PDF volta ao comportamento anterior de exportacao visual baseada no documento renderizado.
- E2E do fluxo MVP deixa de exigir PDF textual com link de aprovacao.
- `pnpm lint:web` e `pnpm build:web` devem passar.

## Testes

- Lint: `pnpm lint:web`
- Build: `pnpm build:web`
- Cenarios manuais: gerar proposta e revisar templates visualmente.
