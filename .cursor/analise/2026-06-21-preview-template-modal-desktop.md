# Análise - Preview de template maior e navegação entre templates

## Contexto

No desktop, o preview de template abre em uma modal central, mas o documento fica
menor do que poderia. A modal usa apenas `max-height`, então ela encolhe ao
conteúdo já escalado e não aproveita toda a altura útil da tela. Além disso,
para comparar templates, o usuário precisa fechar o preview, abrir outro card e
repetir o fluxo.

## Decisão

Melhorar a experiência do preview de templates sem alterar o contrato da API:

- no desktop, a modal de preview deve ocupar quase toda a área útil da tela;
- o modo `Inteiro` deve priorizar encaixar o documento completo sem corte;
- o stage deve preencher a altura disponível da modal;
- adicionar botões `Anterior` e `Próximo` para navegar entre os templates da
  galeria sem fechar o preview;
- manter os controles existentes de zoom, voltar, usar e fechar.

## Critérios de aceite

- Ao abrir o preview no desktop, a modal ocupa a maior parte da largura e altura
  disponíveis.
- No modo `Inteiro`, o documento aparece inteiro, sem corte vertical.
- O preview fica maior do que antes em telas desktop.
- O usuário consegue ir para o template anterior e próximo sem fechar a modal.
- O botão `Usar` aplica o template atualmente visível.
