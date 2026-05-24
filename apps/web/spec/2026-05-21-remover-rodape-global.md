# Spec - Remover rodape global

## Arquivos

- `src/App.tsx`
- `src/styles.css`

## Comportamento esperado

- O layout principal nao deve exibir rodape ao final das paginas.
- O app deve manter header, sidebar, conteudo principal, modais e acoes existentes.
- Icones e componentes usados em outras areas nao devem ser removidos.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
