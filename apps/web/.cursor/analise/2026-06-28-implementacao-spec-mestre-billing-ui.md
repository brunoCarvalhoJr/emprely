# Analise - UI de billing conforme spec mestre

## Contexto

A tela de plano ja existe no app, mas precisa refletir as decisoes finais da spec mestre de billing: precos finais, Pix ativo, cartao futuro/inativo, estados de pendencia, cancelamento, inadimplencia, suspensao e historico.

## Escopo

- Corrigir precos exibidos conforme API/spec.
- Garantir que cartao nao dispara checkout.
- Exibir estado pendente com link de pagamento.
- Manter cancelamento como cancelamento de renovacao.
- Ajustar mensagens de Pix hospedado Asaas.

## Fora do escopo

- UI admin completa de billing.
- Tokenizacao de cartao.
- Landing externa, que fica fora de `apps/web`.
