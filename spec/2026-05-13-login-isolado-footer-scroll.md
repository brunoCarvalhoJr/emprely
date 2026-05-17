# Spec - Login isolado e footer com scroll

## Objetivo

Corrigir a estrutura de layout para que o footer acompanhe o scroll da pagina e refatorar a experiencia publica de login/cadastro para um box central isolado.

## Requisitos

- Footer deve ficar dentro do conteudo rolavel e nao em linha fixa do shell.
- Sidebar e topbar permanecem fixas no app autenticado.
- Botao de suporte WhatsApp usa icone visual do WhatsApp.
- Tela sem sessao deve exibir apenas a experiencia de autenticacao centralizada.
- Login/cadastro continuam usando os mesmos formularios e mutations.

## Aceite

- Ao rolar o conteudo autenticado, sidebar e topbar permanecem fixas; footer aparece apenas ao chegar ao final do conteudo.
- Botao de WhatsApp tem tooltip e icone de WhatsApp.
- Tela publica tem card central flutuante, responsivo e com identidade Emprely.
- `pnpm lint:web`, `pnpm build:web` e e2e passam.
