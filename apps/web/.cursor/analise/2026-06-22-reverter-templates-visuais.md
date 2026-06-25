# Analise - Reverter templates visuais

## Pedido

Voltar os templates de orcamento do Emprely para o visual anterior a alteracao recente que nao agradou.

## Contexto encontrado

- O commit `9a67ab2` (`Refatora templates com PDF textual e aprovacao publica`) alterou o visual/copy dos templates em `apps/web/src/App.tsx` e `apps/web/src/styles.css`.
- O mesmo commit alterou o E2E para validar PDF textual com link de aprovacao.
- O commit imediatamente anterior e `9a67ab2^` (`2fba126`), que contem os templates antes da refatoracao rejeitada.

## Decisao

- Reverter apenas os arquivos web responsaveis pelo visual/exportacao dos templates e o E2E diretamente acoplado a essa mudanca.
- Nao reverter API, migracao ou contratos de aprovacao publica neste passo, porque o pedido foi sobre os templates e uma reversao ampla do backend teria maior risco.

## Duvidas mapeadas

- Se a aprovacao publica tambem deve ser removida depois, isso deve ser tratado como decisao separada.
- A revisao visual deve ser feita novamente com PDFs gerados a partir dos templates restaurados.
