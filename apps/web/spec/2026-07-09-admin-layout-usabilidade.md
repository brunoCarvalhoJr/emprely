# Spec: layout operacional do painel admin

## Objetivo

Melhorar a leitura, navegacao e usabilidade do `/admin` sem alterar regras de negocio.

## Regras

- O painel autenticado deve ter navegacao clara por secoes.
- A secao de usuarios deve ser a tela inicial.
- O painel de detalhe deve aparecer apenas na secao de usuarios.
- Secoes de administradores e emails devem aparecer somente para `SuperAdmin`.
- A area de seguranca deve ficar acessivel para qualquer admin autenticado.
- Tabelas devem manter rolagem horizontal no desktop quando necessario, mas devem ter apresentacao em cards em telas menores.
- Acoes principais devem ficar agrupadas na secao em que sao usadas.

## Criterio de pronto

- `pnpm lint:web` passa.
- `pnpm web:build:beta` passa.
- A tela `/admin` nao deve exibir todas as areas empilhadas ao mesmo tempo.
- O layout deve usar melhor a largura em desktop e reduzir rolagem horizontal desnecessaria.
