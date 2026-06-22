# Análise - Tooltips cortados em bordas de tela e tabelas

## Contexto

Alguns tooltips aparecem cortados, principalmente em botões localizados na
última coluna das tabelas. O padrão atual posiciona o tooltip com `left: 50%` e
`transform: translateX(-50%)`. Isso funciona no centro da tela, mas corta texto
quando o botão está perto da borda direita ou dentro de containers com overflow
restrito.

## Decisão

Corrigir o padrão global:

- alinhar tooltips por padrão ao lado direito do botão, reduzindo corte na borda
  direita;
- manter comportamento especial da sidebar recolhida, que precisa abrir o
  tooltip à direita do ícone;
- em tabelas desktop, permitir overflow visível no shell para não cortar
  tooltips da coluna de ações;
- adicionar regra específica para última coluna de tabela garantindo tooltip
  alinhado para dentro da tela.

## Critérios de aceite

- Tooltip da coluna `Ações` em propostas recentes aparece inteiro.
- Tooltips de botões próximos à direita da tela não cortam horizontalmente.
- Tooltips da sidebar recolhida continuam abrindo ao lado do menu.
