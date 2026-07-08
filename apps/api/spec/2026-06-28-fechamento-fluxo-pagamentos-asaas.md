# Spec - fechamento fluxo pagamentos Asaas

## Escopo

Corrigir bugs finais do billing Asaas e preparar recorrencia mensal/anual sem microservico novo.

## Regras API

- Remover a rota publica `POST /api/billing/reactivate`.
- `BillingService.ReactivarAsync` nao deve restaurar assinatura de cliente; qualquer reativacao deve orientar novo checkout.
- `CreateBillingCheckoutRequest` deve aceitar ciclo do plano, com default mensal para compatibilidade.
- Catalogo deve retornar opcoes mensal e anual com preco, ciclo e metodos por ciclo.
- Asaas deve receber `cycle = MONTHLY` ou `YEARLY` conforme request.
- `AssinaturaConta` e `PagamentoConta` devem persistir ciclo (`Mensal`/`Anual`).
- Ativacao por pagamento deve ajustar `PeriodoAtualFim` pelo ciclo real ou pela proxima data de vencimento quando ela for mais informativa.
- Checkout deve persistir tentativa local antes de chamar Asaas e chamar o provedor fora da transacao local.
- Se a gravacao final apos Asaas falhar, a API deve tentar cancelar a recorrencia remota antes de propagar erro.
- Sync por conta nao pode processar eventos de outras contas.
- Se `CancelamentoAgendado` vencer, sync deve marcar assinatura como `Cancelada`.
- Reembolso admin deve aceitar `Valor` opcional, negar valor <= 0 e negar valor maior que o saldo reembolsavel do pagamento.
- Reembolso parcial nao deve suspender assinatura automaticamente; reembolso total deve cancelar recorrencia e suspender acesso.

## Aceite

- Testes cobrem reativacao bloqueada, ciclo anual, sync isolado por conta, cancelamento agendado vencido e reembolso parcial.
- Testes da API passam.
