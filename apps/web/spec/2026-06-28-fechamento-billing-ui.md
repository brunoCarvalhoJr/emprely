# Spec - fechamento billing UI

## Escopo

Ajustar a tela de Plano para ciclos mensal/anual do Asaas.

## Regras

- `BillingPlanoResponse` deve carregar `ciclo`, `preco`, `periodicidade`, mantendo compatibilidade com `precoMensal`.
- `CreateBillingCheckoutInput` deve enviar `ciclo`.
- Usuario escolhe mensal ou anual antes de clicar no metodo de pagamento.
- Cartao inativo continua desabilitado.
- Texto da tela deve dizer cobranca recorrente hospedada Asaas.
- Remover chamada de reativacao inexistente.

## Aceite

- Build web passa.
- Checkout mensal/anual envia ciclo correto.
