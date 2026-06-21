# Spec Web - Gerar proposta sem salvar rascunho manualmente

## Visão geral

Na etapa Revisao da proposta, o usuario deve conseguir clicar em "Gerar proposta" sem antes salvar manualmente o rascunho. O sistema salva/cria o rascunho por baixo dos panos e gera a proposta final na mesma acao.

## Rotas

- Fluxo autenticado de propostas.

## Estados da interface

- Carregando: botao mostra estado de geracao/salvamento e fica desabilitado.
- Vazio: sem alteracao.
- Erro: erros de salvar ou gerar continuam visiveis via `MensagemErro`.
- Sucesso: proposta gerada abre a visualizacao final como no fluxo atual.

## Componentes

- `gerarPropostaDoFluxo`.
- Botoes "Gerar proposta" na revisao e acoes laterais.

## Formulários

| Campo | Tipo | Obrigatório | Validação |
| --- | --- | --- | --- |
| Proposta | formulario existente | Sim | `propostaForm.trigger()` |

## Integração com API

- `createProposta` quando nao houver rascunho salvo.
- `updateProposta` quando houver rascunho salvo com alteracoes.
- `generateProposta` sempre apos obter um id valido.

## Critérios de aceite

- Em proposta nova, clicar em "Gerar proposta" cria o rascunho e gera a proposta final.
- O usuario nao precisa clicar manualmente em "Salvar rascunho".
- Se houver campos obrigatorios faltando, o app navega para a primeira etapa pendente.
- Se o plano bloquear exportacao, a geracao continua bloqueada.
- Fluxo antigo de salvar rascunho manualmente continua disponivel.

## Testes

- Lint: `npm.cmd run lint`.
- Build: `npm.cmd run build`.
- Cenario manual: preencher proposta nova ate revisao e clicar diretamente em "Gerar proposta".
