# Spec Web - Ajustes mobile do fluxo de nova proposta

## Visao geral

No mobile, o editor de proposta deve funcionar como fluxo guiado. O usuario deve ver onde esta, o progresso e a proxima acao, sem barras flutuantes concorrentes.

## Componentes

- `PropostaWizardBar`: adicionar modo mobile compacto com painel de etapas.
- `proposal-action-rail`: ocultar no mobile.
- `proposal-step-actions`: manter navegacao contextual.
- CSS responsivo: reduzir altura minima e molduras.

## Estados da interface

- Etapa atual: resumo compacto e botao principal.
- Etapa concluida: check no painel de etapas.
- Etapa bloqueada: botao desabilitado no painel.
- Revisao: acoes de salvar/gerar/preview continuam no conteudo da revisao.

## Criterios de aceite

- `Recolher` nao aparece no mobile da proposta.
- `Ver etapas` permite abrir a lista de etapas.
- Nao ha scroll horizontal em 390px.
- O formulario ocupa mais area util no primeiro viewport.

## Testes

- Lint.
- Build beta.
- Playwright mobile com screenshot do fluxo de proposta.

