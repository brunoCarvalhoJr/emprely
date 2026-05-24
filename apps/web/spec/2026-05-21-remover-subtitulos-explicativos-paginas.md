# Spec - Remover subtitulos explicativos das paginas

## Arquivos

- `src/App.tsx`
- `src/styles.css`

## Comportamento esperado

- Cabecalhos de pagina ficam mais diretos, com titulo e acoes.
- O dashboard nao deve exibir paragrafo explicativo abaixo da chamada principal.
- Login/cadastro nao deve exibir subtitulo abaixo do titulo do formulario.
- Estados vazios, erros e ajuda de campos continuam visiveis.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
