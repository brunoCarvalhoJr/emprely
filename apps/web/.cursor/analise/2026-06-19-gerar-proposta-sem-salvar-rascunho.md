# Analise Web - Gerar proposta sem salvar rascunho manualmente

## Contexto

Na etapa de revisao da nova proposta, o usuario precisa clicar em "Salvar rascunho" e depois em "Gerar proposta". Isso adiciona uma etapa desnecessaria quando o usuario ja revisou os dados e quer finalizar.

## Objetivo da tela/fluxo

Permitir que o botao "Gerar proposta" funcione mesmo quando ainda nao existe rascunho salvo. Ao clicar, o app deve criar o rascunho em segundo plano e imediatamente gerar a proposta final.

## Rotas impactadas

- App autenticado, fluxo de nova proposta, etapa Revisao.

## Componentes impactados

- Fluxo de proposta em `App.tsx`.
- Acao `gerarPropostaDoFluxo`.
- Estado do botao "Gerar proposta" na revisao e na barra lateral de acoes.

## Formulários e validação

- Reutilizar a validacao completa existente de `propostaForm.trigger()`.
- Se houver erro, navegar para a primeira etapa pendente.
- Se a conta nao puder exportar, manter bloqueio de plano.

## Dados e chamadas de API

- Sem nova rota.
- Para proposta nova ou com alteracoes:
  1. montar payload com `buildPropostaPayload`;
  2. chamar `createProposta` ou `updateProposta`;
  3. chamar `generateProposta` com o id retornado.
- Para rascunho ja salvo e sem alteracoes, chamar somente `generateProposta`.

## Responsividade e acessibilidade

- Botao continua com mesmo tamanho e estados visuais.
- Texto/tooltip deve refletir que a acao pode salvar automaticamente antes de gerar.

## Dúvidas

- Nao ha duvida bloqueante. O comportamento pedido equivale a executar os dois cliques atuais em sequencia.
