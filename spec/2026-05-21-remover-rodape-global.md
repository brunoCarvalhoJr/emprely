# Spec - Remover rodape global

## Escopo

Remover o rodape global do app web.

## Requisitos

- Nenhuma pagina deve renderizar o rodape com logo, texto de direitos reservados e botoes de contato.
- O restante do layout principal deve continuar renderizando normalmente.
- Codigo e estilos exclusivos do rodape devem ser removidos quando ficarem sem uso.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
