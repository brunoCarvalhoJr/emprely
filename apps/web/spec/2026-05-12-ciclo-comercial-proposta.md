# Spec Web - Ciclo comercial da proposta

## Visao geral

Adicionar acoes e metricas para acompanhar o status comercial da proposta.

## Escopo

### Incluido

- Funcoes API `sendProposta`, `acceptProposta`, `rejectProposta`.
- Mutations React Query para transicoes de status.
- Botoes:
  - `Marcar enviada`
  - `Marcar aceita`
  - `Marcar recusada`
- Filtros do historico por status.
- Dashboard com metricas comerciais.
- Mensagens de sucesso/erro.

### Fora do escopo

- Link publico de aceite.
- Envio real via WhatsApp API.
- Auditoria/historico de eventos.
- Datas especificas de envio, aceite ou recusa.

## Estados da interface

- `Rascunho`: exibe gerar.
- `Gerada`: exibe imprimir/PDF, abrir WhatsApp e marcar enviada.
- `Enviada`: exibe aceitar/recusar.
- `Aceita` e `Recusada`: exibe status final.
- Filtro sem resultados exibe estado vazio contextual.

## Criterios de aceite

- Usuario consegue marcar proposta gerada como enviada.
- Usuario consegue marcar proposta enviada como aceita ou recusada.
- Dashboard mostra valor total aceito e taxa de conversao.
- Historico filtra propostas por status.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.
