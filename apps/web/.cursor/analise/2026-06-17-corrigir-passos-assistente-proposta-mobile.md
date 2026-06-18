# Analise Web - Corrigir passos do assistente de proposta no mobile

## Area afetada

- Assistente inicial de nova proposta em `apps/web/src/App.tsx`.
- CSS responsivo em `apps/web/src/styles.css`.

## Ajuste

- Substituir o uso de `proposal-wizard-steps` no assistente inicial por `proposal-assistant-steps`.
- Manter `proposal-wizard-steps` para o editor de proposta.
- Adicionar CSS mobile especifico para impedir quebra visual dos passos.

## Validacao

- Screenshot em viewport 390px.
- Sem scroll horizontal.
- Lint e build beta.

