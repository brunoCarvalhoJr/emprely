# Analise - correcoes da bateria QA full e deploy

## Contexto

A bateria completa executada em `D:\Emprely\Testes` validou criacao, status e limpeza de entidades, mas encontrou fragilidade no fluxo de propostas depois da geracao/visualizacao. O bloqueio pratico ocorreu ao tentar seguir para a acao de duplicar proposta: o overlay/modal e os seletores por texto deixaram a automacao vulneravel a interceptacao de clique e variacoes de UI.

## Problemas confirmados

- Modais de visualizacao/preview de proposta nao tinham identificadores estaveis para automacao.
- As acoes de listagem de proposta dependiam de texto acessivel e menu dinamico sem `data-testid`.
- O fechamento de modais era possivel por botao/backdrop, mas faltava rotina uniforme por `Escape`, importante para recuperacao em testes E2E e uso real.
- A cobertura E2E local nao exercitava o caminho que quebrou na bateria: visualizar, fechar e duplicar proposta a partir da lista.

## Escopo escolhido

- Melhorar testabilidade sem alterar regra de negocio.
- Adicionar fechamento previsivel dos modais de proposta por `Escape`.
- Adicionar `data-testid` nas acoes e dialogs criticos de proposta.
- Cobrir duplicacao em Playwright mockado.
- Validar localmente antes de deploy web.

## Fora de escopo

- Refatorar `App.tsx` inteiro ou quebrar chunks de rota neste ciclo.
- Criar endpoints administrativos de limpeza QA.
- Alterar API, banco ou regras de status.
