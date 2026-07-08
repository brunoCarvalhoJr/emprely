# Spec - hardening fluxo pagamentos Asaas

## Escopo

Corrigir os bugs restantes do fluxo de pagamento Asaas sem introduzir microservico novo.

## Regras

- Cancelamento pelo cliente deve exigir assinatura com acesso pago ativo.
- Restauracao admin deve exigir assinatura com pagamento confirmado/recebido e periodo vigente.
- `ReembolsarUltimoPagamentoAsync` deve operar somente sobre pagamento confirmado/recebido ainda nao reembolsado.
- Eventos atrasados nao podem rebaixar pagamento terminal ou ja liberado.
- Webhook deve persistir evento e retornar sucesso; processamento deve poder ser reexecutado.
- Checkout deve ser protegido por lock por conta.
- Sync admin deve reprocessar eventos pendentes/erro e vencer assinatura cujo periodo acabou.
- Cartao deve ficar inativo no catalogo enquanto a recorrencia automatica nativa nao tiver tokenizacao.

## Aceite

- Testes da API cobrem cancelamento sem pagamento, restauracao invalida, reembolso filtrado, evento atrasado e checkout concorrente.
- Lint/build do web passam.
- Testes da API passam.
