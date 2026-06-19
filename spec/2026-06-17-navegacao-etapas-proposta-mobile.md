# Spec - Navegacao entre etapas da proposta no mobile

## Visao geral

Melhorar a usabilidade mobile do fluxo de nova proposta permitindo avancar ou voltar de etapa sem precisar rolar ate o final de secoes longas.

## Escopo

Inclui:

- Barra fixa inferior mobile para navegacao do wizard.
- Acao contextual por etapa.
- Padding inferior para evitar conteudo coberto.
- Estados de disabled/loading coerentes com os botoes existentes.

Fora do escopo:

- Alterar regras de validacao dos campos obrigatorios.
- Alterar API.
- Remover os botoes de navegacao ja existentes no fim das secoes.

## Comportamento esperado

- Na etapa `Cliente`, a barra inferior mostra `Proximo`.
- Nas etapas `Proposta`, `Itens`, `Template` e `Detalhes`, a barra mostra `Voltar` e `Proximo`.
- Na etapa `Revisao`, a barra mostra `Voltar` e `Salvar rascunho` ou `Salvando...`.
- Quando ja houver proposta salva, a barra pode exibir `Gerar` se nao houver alteracoes pendentes.
- A barra aparece apenas no mobile.
- O conteudo da etapa nao fica escondido atras da barra fixa.

## Criterios de aceite

- O usuario consegue avancar da etapa de detalhes sem rolar ate o final.
- Nao ha scroll horizontal em 390px.
- A barra nao cobre campos importantes ao final da pagina.
- O fluxo continua validando campos obrigatorios antes de avancar.
- `Salvar` e `Preview` continuam disponiveis no topo mobile.

## Testes

- `pnpm.cmd --dir apps/web lint`
- Playwright mobile em 390px validando a barra fixa na etapa de detalhes.
- `scripts/build-web-beta.ps1`
