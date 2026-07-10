# Analise - Corrigir cards de propostas no tema dark mobile

## Contexto

No tema dark, a listagem de propostas em mobile exibe as linhas da tabela como
cards brancos. Como os textos internos usam tokens do tema escuro, o contraste
fica muito baixo e a proposta quase desaparece.

## Causa

`apps/web/src/styles.css` possui regras gerais para `.data-table` em dark mode,
mas depois, dentro do bloco mobile, uma regra mais tardia define:

- `.data-table tr { background: #ffffff; }`

Essa regra sobrescreve o fundo dark dos cards mobile da listagem de propostas e
tambem pode afetar outras tabelas responsivas.

## Escopo

- Corrigir o fundo, borda, sombra e separadores dos cards mobile da `.data-table`
  quando `data-theme="dark"`.
- Manter a estrutura responsiva atual.
- Nao alterar API, dados, filtros, status ou acoes da proposta.

## Criterios de aceite

- Em dark mode, os cards mobile da listagem de propostas nao ficam brancos.
- Textos, labels, valores e botoes de acao continuam legiveis.
- A cor de status continua preservada.
- Build/lint web passam.
