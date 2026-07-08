# Analise - hardening fluxo pagamentos Asaas

## Contexto

A revisao do fluxo completo de pagamento, recorrencia, webhook, cancelamento e reembolso encontrou riscos ainda abertos apos a primeira rodada de correcoes.

## Riscos

- Cancelamento solicitado pelo cliente pode agendar acesso ativo para assinatura sem pagamento confirmado/recebido.
- Restauracao admin pode reativar assinatura sem periodo vigente e sem pagamento confirmado/recebido.
- Eventos de webhook podem chegar fora de ordem; pagamentos confirmados/recebidos/reembolsados nao podem ser rebaixados por eventos atrasados.
- Reembolso automatico pode selecionar pagamento pendente/vencido ou ja reembolsado.
- Checkout concorrente pode criar assinaturas duplicadas.
- Webhook processado dentro da requisicao aumenta risco de retry indefinido do provedor.
- Sync admin ainda nao executa reconciliacao local.
- Cartao automatico nativo ainda nao tem tokenizacao/dados de cartao; o sistema nao deve vender esse caminho como pronto.

## Decisoes

- Aplicar maquina de estados monotona para pagamento.
- Exigir acesso pago ativo para cancelar e exigir periodo vigente para restaurar.
- Serializar checkout por conta com lock persistido no banco.
- Separar recebimento de webhook de processamento reexecutavel.
- Implementar sync admin local: reprocessar eventos recebidos/erro e expirar assinaturas ativas com periodo encerrado.
- Deixar cartao inativo no catalogo ate existir contrato seguro de tokenizacao.
