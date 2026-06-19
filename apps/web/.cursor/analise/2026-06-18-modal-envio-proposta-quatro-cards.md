# Analise - Modal de envio da proposta com quatro cards

## Contexto

A modal de envio da proposta gerada exibe duas opcoes principais de WhatsApp e duas acoes menores de anexo. Isso deixa PDF e imagem com menor peso visual, apesar de serem acoes equivalentes no fluxo de envio.

## Objetivo

Reorganizar a modal para quatro cards:

- Mensagem inicial + anexo.
- Proposta completa por texto.
- Download PDF.
- Download imagem.

## Regras

- Remover o icone de WhatsApp do cabecalho.
- "Mensagem inicial + anexo" deve, no desktop, baixar o PDF e abrir o WhatsApp com a mensagem preenchida.
- "Mensagem inicial + anexo" deve, no mobile, tentar compartilhar PDF e texto juntos via Web Share API.
- Se o compartilhamento mobile com arquivo nao estiver disponivel, usar fallback de download do PDF e abertura do WhatsApp.
- Manter as rotinas existentes de exportacao para PDF e imagem.

## Impactos

- Frontend: UI e handlers da modal de envio.
- Backend: sem impacto.

## Riscos

- Navegadores mobile variam no suporte a compartilhamento de arquivos. O fallback preserva a entrega via download + WhatsApp.
