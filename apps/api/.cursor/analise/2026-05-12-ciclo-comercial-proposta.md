# Analise API - Ciclo comercial da proposta

## Contexto

O sistema ja permite cadastrar clientes, servicos e propostas, gerar proposta, imprimir/PDF e abrir WhatsApp. O proximo passo e acompanhar o resultado comercial da proposta depois do envio.

## Objetivo

Adicionar transicoes de status para que a proposta saia de documento gerado e passe a representar um fluxo comercial simples: enviada, aceita ou recusada.

## Escopo afetado

- Dominio `Emprely.Domain/Propostas`.
- Controller REST `api/proposals`.
- Contratos de resposta ja existentes.
- Testes unitarios de dominio.

## Regras de negocio assumidas

- `Rascunho` precisa ser gerada antes de ser enviada.
- `Gerada` pode virar `Enviada`.
- `Enviada` pode virar `Aceita` ou `Recusada`.
- `Aceita` e `Recusada` sao estados finais comerciais nesta etapa.
- `Arquivada` nao pode mudar de status.
- Editar proposta `Gerada`, `Enviada`, `Aceita` ou `Recusada` volta para `Rascunho`, pois o documento precisa ser gerado/enviado novamente.

## Perguntas

Nao ha pergunta bloqueante. Em etapas futuras pode ser decidido se uma proposta aceita podera voltar para enviada ou se havera historico/auditoria de status.

## Riscos

- Ainda nao existe trilha de eventos com data de envio/aceite/recusa.
- Abrir WhatsApp nao marca envio automaticamente; o usuario precisa acionar `Marcar como enviada`.
- Nao ha notificação ao cliente nem link publico de aceite nesta etapa.
