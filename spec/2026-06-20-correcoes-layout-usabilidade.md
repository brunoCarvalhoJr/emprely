# Spec - correcoes de layout e usabilidade

## Objetivo

Atacar os achados P0/P1 do relatorio de layout e usabilidade mantendo o comportamento funcional atual do SaaS.

## Criterios de aceite

- Em mobile, botoes de salvar em formularios nao ficam cobertos pela bottom nav.
- Drawer mobile distingue acoes de criacao (`Novo cliente`, `Novo servico`) de navegacao (`Servicos / Pacotes`).
- Controles iconicos e tabs principais tem area clicavel minima mais confortavel.
- Labels de acento em fundos claros ficam mais legiveis.
- `pnpm lint:web`, `pnpm build:web` e `pnpm test:e2e:web` passam.

## Risco

Baixo a moderado. As mudancas sao majoritariamente CSS e rotulos, mas podem alterar layout mobile e snapshots visuais.
