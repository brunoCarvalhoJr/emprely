# Spec - Refatoracao de grids responsivas

## Visao geral

Melhorar a responsividade das grids do sistema Emprely, reduzindo barras horizontais desnecessarias e redistribuindo colunas conforme a importancia da informacao.

## Escopo

Inclui:

- Listagem de clientes.
- Listagem de servicos/pacotes.
- Listagem de propostas.
- Propostas recentes no dashboard.
- CSS compartilhado de `data-table`.

Fora do escopo:

- Alterar endpoints.
- Alterar dados exibidos.
- Recriar componente de tabela do zero.

## Fluxo ponta a ponta

1. Usuario acessa uma listagem.
2. Em desktop, ve a tabela ocupando 100% do container sem rolagem horizontal artificial.
3. Colunas principais recebem mais espaco; colunas curtas ficam compactas.
4. Em telas menores, a tabela vira cards legiveis.

## Requisitos

- A soma das larguras das colunas deve caber em 100% no desktop.
- A coluna `Tipo` em propostas deve ser menor que a coluna `Cliente`.
- A coluna `Acoes` deve ter espaco suficiente para botoes sem forcar overflow.
- Textos longos devem quebrar linha ou truncar de forma controlada.
- O layout mobile em cards deve continuar funcionando.

## Regras de negocio

- Sem alteracao de negocio.

## Impactos por projeto

- API: sem alteracao.
- Web: `apps/web/src/App.tsx` e `apps/web/src/styles.css`.
- Mobile: sem alteracao.
- Landing: sem alteracao.
- Packages: sem alteracao.
- Infra: sem alteracao.

## Criterios de aceite

- A tela de propostas do print nao mostra barra horizontal quando ha uma linha comum.
- `Tipo` nao ocupa espaco excessivo.
- Clientes e servicos mantem acoes utilizaveis.
- Dashboard de propostas recentes usa o mesmo criterio.
- Lint e build do web passam.

## Estrategia de implementacao

- Substituir larguras fixas mistas por percentuais por grid.
- Criar wrapper sem scroll horizontal forçado.
- Ajustar breakpoint da tabela para cards em telas intermediarias.

## Testes

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
- Smoke visual desktop/mobile das listagens.
