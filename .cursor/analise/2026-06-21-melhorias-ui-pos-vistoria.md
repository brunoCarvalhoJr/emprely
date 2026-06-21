# Analise - melhorias UI pos-vistoria Chrome

## Contexto

A vistoria assistida no Chrome apontou problemas visuais e de usabilidade no fluxo de propostas do Emprely:
cabecalho dos templates com informacao excessiva, PDFs quebrando em duas paginas em propostas curtas, card de
beneficios estreito, menu de acoes longo, modais compactas, stepper em duas linhas e toasts duplicados ao gerar
proposta sem salvar rascunho manualmente.

## Decisoes

- Manter as mudancas no webapp, sem alterar contratos de API ou banco.
- Tratar "template em uma pagina" como requisito para propostas tipicas e curtas dos roteiros de teste; conteudo
  excepcionalmente longo deve continuar legivel, sem corte de dados.
- Preservar seletores e `data-testid` existentes sempre que possivel para nao quebrar automacoes.
- Melhorar visual com os componentes existentes, sem adicionar biblioteca de UI.

## Impacto esperado

- Preview/PDF de proposta mais compacto e previsivel.
- Menus e modais mais escaneaveis para uso assistido e operacao real.
- Fluxo de gerar proposta com apenas uma notificacao de sucesso final.
- Stepper inicial da nova proposta em uma unica linha no desktop.

## Riscos

- Compactar templates demais pode reduzir legibilidade; mitigacao: limitar ajustes a densidade moderada e validar
  em desktop/PDF.
- Agrupar menu de acoes pode afetar testes que dependem de texto; mitigacao: manter labels e `data-testid`.
- Mudar fluxo de toast pode esconder mensagens de salvamento manual; mitigacao: suprimir apenas salvamento automatico
  dentro de `Gerar proposta`.
