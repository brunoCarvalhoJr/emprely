# Analise Web - Proposta gerada, impressao e WhatsApp

## Contexto

O web ja permite montar proposta, salvar rascunho, selecionar proposta existente e visualizar preview visual. Falta fechar o ciclo demonstravel: gerar, imprimir/salvar PDF pelo navegador e enviar mensagem ao cliente.

## Situacao atual

- A tela de propostas contem formulario, preview e historico ativo.
- O preview usa dados do formulario, nao necessariamente a versao salva.
- A API ainda nao possui chamada de geracao no client.
- Nao existe CSS de impressao para isolar a proposta.
- Nao existe link WhatsApp com mensagem pronta.

## Decisoes

- Adicionar acao `Gerar proposta` para propostas salvas.
- Exibir acoes de imprimir e WhatsApp apenas quando houver proposta selecionada e `status === "Gerada"`.
- Usar `window.print()` para o PDF inicial controlado pelo navegador.
- Usar CSS `@media print` para imprimir apenas a area da proposta.
- Montar link `wa.me` quando o cliente tiver telefone; caso contrario usar `https://wa.me/?text=...`.
- A mensagem deve conter titulo, cliente, total e assinatura da marca quando disponivel.

## Perguntas

Nao ha duvida bloqueante. A integracao WhatsApp oficial/API de envio automatico fica fora do MVP inicial.

## Riscos

- O usuario precisa salvar a proposta antes de gerar.
- PDF via navegador depende da impressora/pdf do sistema, mas atende ao MVP demonstravel.
