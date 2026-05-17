# Spec Web - Proposta gerada, impressao e WhatsApp

## Visao geral

Fechar o fluxo demonstravel de proposta no web: gerar proposta salva, imprimir/salvar PDF via navegador e abrir WhatsApp com mensagem pronta.

## Escopo

Inclui:

- Funcao API `generateProposta`.
- Botao `Gerar proposta` em proposta selecionada.
- Acoes `Imprimir/Salvar PDF` e `Enviar WhatsApp` para proposta gerada.
- CSS de impressao para imprimir somente o preview da proposta.
- Mensagem pronta com titulo, cliente e total.

Fora do escopo:

- Exportacao PDF server-side.
- Upload no S3.
- Link publico de proposta.
- Aceite de proposta.
- Checkout/billing.

## Criterios de aceite

- Usuario seleciona uma proposta salva e consegue gerar.
- Status da proposta muda para `Gerada`.
- Ao editar uma proposta gerada e salvar, ela volta para `Rascunho`.
- Acoes de imprimir e WhatsApp aparecem apenas para proposta gerada.
- Impressao mostra o preview e oculta navegacao/form/lista.
- WhatsApp abre com mensagem codificada.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.
