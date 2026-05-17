# Spec Web - Polimento layout pelo prototipo Lovable

## Comportamento esperado

- Usuario autenticado ve sidebar clara com navegacao principal.
- Topbar mostra contexto do produto/workspace e botao de sair.
- Dashboard prioriza nova proposta, servicos e historico recente.
- Clientes, servicos e propostas continuam com busca, filtros e paginacao.
- Visual deve usar identidade Emprely: navy, roxo, azul e teal com fundos claros.

## Implementacao

- Alterar `apps/web/src/App.tsx` para novo shell autenticado.
- Ajustar `DashboardContent` e metricas.
- Atualizar CSS global em `apps/web/src/styles.css`.
- Atualizar teste e2e apenas se a mudanca de layout remover textos antigos.

## Validacao

- `pnpm lint:web`
- `pnpm build:web`
- `pnpm --dir apps/web test:e2e`

