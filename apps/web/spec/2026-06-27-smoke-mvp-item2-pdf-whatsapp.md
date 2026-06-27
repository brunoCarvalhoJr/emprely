# Spec - Smoke MVP item 2: exportacao em conta com dias gratis

## Objetivo

Permitir que o frontend respeite o status comercial efetivo informado pela API durante o smoke MVP completo, especialmente quando uma conta trial expirada recebe dias gratis operacionais.

## Comportamento esperado

1. Se a API retornar `statusComercial = TrialAtivo`, a conta pode exportar propostas.
2. Se a API retornar `statusComercial = FundadorAtivo`, a conta pode exportar propostas.
3. Se a API retornar `statusComercial = TrialExpirado`, a conta nao pode exportar propostas, exceto se o plano for `Fundador`.
4. `trialEndsAt` nao deve rebaixar localmente uma conta que a API ja marcou como ativa.
5. Para `TrialAtivo` com data original de trial vencida, o texto de validade deve indicar ativacao operacional em vez de "expirado".

## Fora de escopo

- Alterar contrato da API.
- Confirmar email automaticamente.
- Reestruturar o fluxo comercial de planos.
