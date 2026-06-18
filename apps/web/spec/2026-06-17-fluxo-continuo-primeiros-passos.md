# Spec Web - Fluxo continuo de primeiros passos

## Visao geral

O dashboard deve conduzir a conta nova por um roteiro de ativacao, e nao apenas listar tarefas. A etapa concluida deve levar naturalmente para a proxima tela necessaria.

## Rotas

- Dashboard: exibe o fluxo guiado enquanto houver passo pendente.
- Clientes: salva o primeiro cliente e redireciona para servicos.
- Servicos / pacotes: salva o primeiro servico e redireciona para propostas.
- Propostas: abre o assistente de nova proposta.

## Estados da interface

- Carregando: permanece o estado atual do dashboard.
- Vazio: primeiros passos aparecem quando ainda nao ha cliente, servico ou proposta.
- Erro: permanece o estado atual de erro do dashboard.
- Sucesso: cards indicam passos concluidos e acao primaria aponta para a proxima etapa.

## Componentes

- `PrimeirosPassosDashboard`:
  - calcula passo atual;
  - mostra progresso numerico;
  - mostra barra de progresso;
  - destaca passo atual;
  - reduz peso visual de passos futuros.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Sem novos campos | - | - | - |

## Integracao com API

- Sem endpoint novo.
- O redirecionamento usa o sucesso de `createCliente` e `createServico`.
- Os totais atuais (`clientesTotal`, `servicosTotal`) definem se a etapa era a primeira.

## Criterios de aceite

- Salvar o primeiro cliente abre cadastro de servico.
- Salvar o primeiro servico abre assistente de nova proposta.
- Salvar um segundo cliente continua no cadastro de cliente.
- Salvar um segundo servico continua no cadastro de servico.
- Editar cliente ou servico volta para listagem.
- Layout funciona em 390px e em desktop.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `scripts/build-web-beta.ps1`.
- Cenario automatizado: dashboard vazio, criar cliente, criar servico, chegar no assistente de proposta.

