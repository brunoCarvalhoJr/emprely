# Analise Web - Ciclo comercial da proposta

## Contexto

Imprimir PDF e abrir WhatsApp ja funcionam. Falta a tela refletir o acompanhamento comercial depois do envio, permitindo marcar proposta como enviada, aceita ou recusada e filtrar historico.

## Objetivo da tela/fluxo

Transformar o historico de propostas em um acompanhamento simples de vendas, com filtros por status e metricas do funil comercial.

## Componentes impactados

- `App`
- `DashboardContent`
- Lista/historico de propostas
- Card de acoes da proposta selecionada
- Client API em `src/lib/api.ts`
- Tipo `PropostaStatus`

## Fluxo esperado

- Proposta `Rascunho`: pode ser gerada.
- Proposta `Gerada`: pode imprimir/PDF, abrir WhatsApp e marcar como enviada.
- Proposta `Enviada`: pode marcar como aceita ou recusada.
- Proposta `Aceita`/`Recusada`: mostra status final comercial.
- Historico permite filtrar por status.
- Dashboard mostra metricas mais uteis: total, enviadas, aceitas, valor aceito e conversao.

## Perguntas

Nao ha duvida bloqueante. Datas de envio/aceite e link publico de aceite ficam fora desta etapa.

## Riscos

- O usuario ainda precisa marcar manualmente que enviou pelo WhatsApp.
- A taxa de conversao usa contagem simples de propostas enviadas/aceitas, sem periodo.
