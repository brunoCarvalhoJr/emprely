# Analise Web - Login isolado e footer com scroll

## Arquivos afetados

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`

## Ajustes

- Mover `FooterAplicacao` para dentro de `.app-content`.
- Ajustar grid autenticado para duas linhas: topbar e conteudo.
- Remover header publico.
- Refatorar `AuthContent` para um card central.
- Substituir `MessageCircle` por `WhatsAppIcon`.

## Riscos

- E2E pode precisar de seletor mais especifico se novos elementos compartilharem labels.
- Login/cadastro devem preservar nomes de botoes existentes para nao quebrar fluxo.
