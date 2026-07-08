# Spec - hardening billing UI

## Escopo

Ajustar a tela de Plano para refletir as regras reais do backend.

## Regras

- Nao renderizar botao de reativacao quando `cancelAtPeriodEnd` exigir novo checkout.
- Metodo de pagamento inativo deve aparecer desabilitado ou sem acao de checkout.
- Mensagens devem orientar novo checkout em vez de reativacao local.

## Aceite

- Build web passa.
- Nenhuma acao exibida deve ser rejeitada por desenho pela API.
