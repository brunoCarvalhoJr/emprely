# Correcao Webhook Asaas - 2026-07-09

## Resumo

O webhook de pagamentos do Asaas estava retornando `401 Unauthorized` para eventos enviados a `https://api.emprely.com.br/api/webhooks/asaas`.

A API do Emprely estava correta: ela valida o token recebido pelo header `asaas-access-token` contra `Asaas__WebhookToken`. O problema estava na configuracao do webhook no Asaas, que precisava ser atualizada com o token correto e ter a fila reativada.

## Ambiente

- API: `https://api.emprely.com.br`
- Webhook: `https://api.emprely.com.br/api/webhooks/asaas`
- Webhook Asaas: `Emprely - Pagamentos`
- Arquivo privado do token: `D:\Emprely\Segredos\ASAAS-TOKEN-WEBHOOK.env`
- Chave do token: `Asaas__WebhookToken`

Nenhum valor de secret deve ser copiado para o repositorio, Notion, Obsidian ou chat.

## Diagnostico

- O endpoint de webhook retornava `Token de webhook invalido.` para as tentativas registradas no painel do Asaas.
- O token privado local foi comparado com o `lightsail.env` privado e com o ambiente do container em producao por metadados seguros, sem imprimir o valor.
- A API em producao respondeu HTTP 200 quando recebeu o token correto no header `asaas-access-token`.
- Isso confirmou que o backend estava configurado corretamente e que a divergencia estava no token salvo no cadastro do webhook no Asaas ou na fila penalizada.

## Correcao Aplicada

- O webhook `Emprely - Pagamentos` foi atualizado via API do Asaas com o `authToken` correto.
- A fila do webhook foi reativada com `interrupted=false`.
- O webhook permaneceu ativo e usando envio sequencial.

## Validacoes

- `POST https://api.emprely.com.br/api/webhooks/asaas` com `asaas-access-token` correto: HTTP 200.
- `GET https://api.emprely.com.br/health/live`: HTTP 200.
- `GET https://api.emprely.com.br/health/ready`: HTTP 200.
- Webhook Asaas depois da correcao:
  - `enabled=true`
  - `interrupted=false`
  - `sendType=SEQUENTIALLY`

## Observacoes Operacionais

- Nao houve mudanca de codigo nem de imagem Docker da API.
- O deploy operacional desta correcao foi a atualizacao da configuracao do webhook no Asaas.
- Eventos antigos que ficaram com erro 401 podem precisar ser reenviados pelo painel do Asaas, caso o Asaas nao reprocesse automaticamente.
