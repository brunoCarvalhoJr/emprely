# Spec - Modal de envio da proposta com quatro cards

## Visao geral

A modal de envio de proposta deve apresentar quatro acoes de mesmo nivel visual, separando envio por mensagem, envio com anexo e downloads.

## Escopo

- Remover o icone de WhatsApp do topo da modal.
- Exibir quatro cards:
  - Mensagem inicial + anexo.
  - Proposta completa por texto.
  - Download PDF.
  - Download imagem.
- No desktop, o card de mensagem inicial + anexo baixa o PDF e abre o WhatsApp com texto preenchido.
- No mobile, o card de mensagem inicial + anexo tenta compartilhar o PDF com a mensagem.

## Fora do escopo

- Envio automatico direto pelo WhatsApp Web com anexo sem interacao do usuario.
- Alterar conteudo visual da proposta.
- Alterar status ou endpoints da proposta.

## Criterios de aceite

- A modal nao mostra icone de WhatsApp no cabecalho.
- A modal mostra quatro cards, nao dois cards mais botoes separados.
- PDF e imagem aparecem como cards.
- Lint e build do web passam.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `npm.cmd run build` em `apps/web`
