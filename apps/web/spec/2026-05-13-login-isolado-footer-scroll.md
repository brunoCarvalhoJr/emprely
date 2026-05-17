# Spec Web - Login isolado e footer com scroll

## User Story

Como usuario, quero uma tela de login clara e isolada, e quero que o footer faca parte do conteudo da pagina, sem ficar preso como o menu.

## Implementacao

- Renderizar header apenas no app autenticado.
- Inserir footer dentro de `.app-content`.
- Refatorar `AuthContent` para `auth-isolated-page` com `auth-floating-card`.
- Usar SVG local de WhatsApp no botao de suporte.
- Remover regras CSS que posicionavam footer em linha fixa do grid autenticado.

## Validacao

- `pnpm lint:web`
- `pnpm build:web`
- `pnpm --dir apps/web test:e2e`
- Checagem visual por screenshot quando houver dev server.
