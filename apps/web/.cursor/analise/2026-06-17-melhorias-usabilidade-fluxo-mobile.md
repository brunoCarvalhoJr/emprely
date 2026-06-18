# Analise - Melhorias de usabilidade do fluxo mobile

## Escopo afetado

`apps/web`, principalmente o shell autenticado mobile e o fluxo de criacao/edicao de proposta.

## Problemas observados

- Template fica implicito no fluxo.
- Etapas do wizard ocupam area demais em telas pequenas.
- Acoes finais da revisao exigem rolagem longa.
- Toasts empilhados prejudicam leitura do preview.

## Solucao proposta

- Incluir etapa `Template` entre `Itens` e `Detalhamento`.
- Expor cards de template diretamente no wizard.
- Ajustar CSS mobile para stepper compacto e acoes de revisao sticky.
- Limitar visualmente os toasts no mobile ao item mais recente.
