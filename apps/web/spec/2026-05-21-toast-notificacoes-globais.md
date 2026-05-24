# Spec - Toast de notificacoes globais

## Arquivos

`src/App.tsx`
`src/styles.css`

## Comportamento esperado

- Notificacoes de sucesso, aviso e informacao devem aparecer como toast no canto superior direito.
- O toast deve fechar automaticamente apos 3 segundos.
- O toast deve exibir uma barra de progresso do tempo restante.
- O toast deve permitir fechamento manual por X.
- A tela nao deve mais renderizar banners duplicados para a mesma mensagem.
- Mensagens de erro de formularios e chamadas devem continuar visiveis nos pontos atuais.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
