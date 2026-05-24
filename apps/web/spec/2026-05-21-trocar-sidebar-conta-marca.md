# Spec - Trocar conta e marca no menu lateral

## Arquivos

- `src/App.tsx`
- `src/styles.css`

## Comportamento esperado

- O menu da conta fica antes da navegacao principal.
- A marca Emprely Orcamentos fica depois da navegacao principal, alinhada ao final do sidebar.
- O botao de recolher continua disponivel.
- O dropdown da conta abre abaixo do botao no menu expandido e ao lado no menu recolhido.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
