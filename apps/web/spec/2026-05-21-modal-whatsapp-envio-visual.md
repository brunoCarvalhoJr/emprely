# Spec Web - Modal de envio por WhatsApp

## Visao geral

A modal de envio da proposta deve comunicar rapidamente que o destino e o WhatsApp e diferenciar melhor as duas formas de envio.

## Regras

- O cabecalho da modal deve exibir o icone do WhatsApp no topo esquerdo.
- O texto `WhatsApp` no cabecalho deve usar cor verde.
- O card `Proposta completa em texto` continua com icone de documento.
- O card `Mensagem curta + anexo` deve usar icone de envio/anexo, nao o icone do WhatsApp.
- O layout deve continuar responsivo em telas pequenas.

## Criterios de aceite

- O usuario identifica o WhatsApp como destino da modal antes de ler os cards.
- O card de mensagem curta comunica melhor que a proposta deve ser enviada como arquivo em seguida.
- `pnpm --dir apps/web lint` e `pnpm --dir apps/web build` devem passar.
