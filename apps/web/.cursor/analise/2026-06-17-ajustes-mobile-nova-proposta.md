# Analise Web - Ajustes mobile do fluxo de nova proposta

## Componentes afetados

- `PropostaWizardBar`
- Formulario do editor de proposta
- `proposal-action-rail`
- CSS responsivo de proposta no mobile

## Estado atual

- `PropostaWizardBar` usa tabs horizontais tambem no mobile.
- A barra fica sticky no topo do fluxo.
- `proposal-action-rail` fica sticky no rodape no mobile e pode ser expandida.
- Cada etapa tambem tem seus proprios botoes de navegacao.

## Estado desejado

- Mobile:
  - resumo compacto: etapa atual, progresso e botao `Ver etapas`;
  - painel de etapas vertical quando expandido;
  - barra inferior apenas com navegacao de etapa;
  - acoes de salvar/preview como secundaria discreta;
  - menos cards aninhados e menos altura minima.
- Desktop:
  - manter stepper horizontal e rail de acoes.

## Criterios de validacao

- Em 390px, nao deve haver scroll horizontal.
- A barra superior nao deve cobrir campos.
- O rodape nao deve mostrar `Recolher`.
- `Proximo` deve ser a acao primaria no mobile durante as etapas.
- `Salvar rascunho` e `Preview` continuam disponiveis.

