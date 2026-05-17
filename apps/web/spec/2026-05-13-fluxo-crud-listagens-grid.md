# Spec Web - CRUD com grid de listagem

## Escopo

- `Clientes`: listagem, criar, visualizar, editar, arquivar.
- `Servicos / Pacotes`: listagem, criar, visualizar, editar, arquivar.
- `Propostas`: listagem, criar, visualizar, editar, gerar/imprimir/WhatsApp/status quando aplicavel, arquivar.

## UI

- Cabecalho da pagina com titulo, descricao curta e CTA principal.
- Card de listagem com busca e filtros.
- Grid desktop com colunas e acoes no fim.
- Mobile em cards, sem overflow horizontal.
- Formularios e visualizacao em telas separadas com botao voltar.

## Validacao

- `pnpm lint:web`
- `pnpm build:web`
- `pnpm --dir apps/web test:e2e`

