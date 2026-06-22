# Análise - Seleção/caret em elementos não editáveis

## Contexto

Em algumas áreas da interface, como botões de paginação e cards interativos, o
usuário consegue selecionar texto e aparece um caret piscando, como se fosse
possível digitar. Isso gera sensação de bug porque esses elementos não são
campos editáveis.

## Decisão

Aplicar `user-select: none` em elementos interativos e regiões estruturais da
UI, preservando seleção e caret apenas em campos editáveis:

- `input`, `textarea`, `select`, `[contenteditable]` e campos de código mantêm
  seleção normal;
- botões, links, cards, tabelas, navegação, modais e badges deixam de mostrar
  seleção/caret acidental.

## Critérios de aceite

- Clicar em botões de paginação não exibe caret piscando.
- Clicar em cards/badges/tabelas não parece campo editável.
- Inputs, textareas e selects continuam funcionando normalmente.
