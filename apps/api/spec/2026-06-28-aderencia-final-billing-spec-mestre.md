# Spec API - aderencia final billing spec mestre

## Escopo

Complementar a implementacao atual para cumprir a spec mestre de billing.

## Regras

- Admin pode reembolsar pagamento `Confirmado`, `Recebido` ou `ReembolsadoParcial` enquanto houver saldo reembolsavel.
- Reembolso parcial deve manter acesso e recorrencia.
- Reembolso integral deve cancelar recorrencia remota, suspender acesso e enviar email.
- Restauracao admin deve permitir restaurar com pagamento vigente ou credito manual vigente.
- Credito manual continua temporario, auditado e sem pagamento Asaas falso.
- Reconciliacao deve consultar Asaas para pagamentos e assinaturas conhecidos.
- Asaas vence em divergencia financeira.
- Worker deve processar eventos frequentes e executar reconciliacao diaria.
- Webhook com erro deve ter retry controlado.
- UI do app deve receber pagamento atual e historico dos ultimos 12 meses via contrato de billing.

## Emails essenciais

- Pagamento confirmado/acesso liberado.
- Pagamento pendente ou vencido.
- Bloqueio por inadimplencia.
- Cancelamento agendado.
- Cancelamento efetivado.
- Reembolso parcial.
- Reembolso integral.

## Testes

- Reembolso parcial duplo.
- Restauracao por credito manual.
- Contrato de status com pagamento atual e historico.
- Reconciliacao remota de pagamento recebido, vencido, reembolso e cancelamento.
