# Analise - Remover rodape global

## Ideia

Remover o rodape exibido no fim das paginas do app web.

## Contexto

O rodape aparece como um bloco global no layout principal, com logo, direitos reservados e botoes de contato. Como ele e renderizado uma unica vez no shell da aplicacao, remover essa chamada elimina o rodape de todas as telas.

## Decisao

- Remover a chamada de `FooterAplicacao` no layout principal.
- Remover o componente `FooterAplicacao`, ja que nao tera mais uso.
- Remover constantes e estilos usados exclusivamente pelo rodape.

## Duvidas

Nao ha duvidas bloqueantes. O pedido e remover o rodape de todas as paginas.
