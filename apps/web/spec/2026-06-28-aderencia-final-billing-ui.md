# Spec Web - aderencia final billing UI

## Tela de plano

A tela deve consumir `BillingStatusResponse` e renderizar:

- estado comercial;
- estado da assinatura;
- estado do pagamento atual;
- ciclo, valor e metodo;
- periodo atual e proxima cobranca;
- link para checkout quando houver pagamento pendente;
- historico dos ultimos 12 meses;
- acoes disponiveis conforme estado.

## Estados

- Trial: mostra dias restantes e CTA de assinatura.
- Pendente/vencido: mostra status do pagamento e botao para voltar ao checkout hospedado.
- Ativo: mostra periodo, proxima cobranca e cancelamento de renovacao.
- Cancelamento agendado: informa fim do acesso.
- Suspenso/cancelado/reembolsado: orienta novo checkout ou suporte.

## Fora do escopo

- Cartao ativo.
- Checkout transparente.
- Captura de dados de cartao.
