# Analise - Corrigir tour guiado mobile

## Contexto

O teste em celular mostrou que o guia inicial fica confuso no fluxo de
configurar conta. As evidencias anexadas mostram:

- modal "Conheca a Emprely antes de comecar" ocupando a tela mobile;
- tela "Perfil da conta" escurecida pelo spotlight do tour;
- video com o tour abrindo o menu mobile e avancando por itens de navegacao.

## Problemas provaveis

- O webapp inicia o tour automaticamente quando a modal nao esta aberta e o
  status do tour esta `NaoIniciado` ou `EmAndamento`. Isso faz o tour parecer
  obrigatorio.
- Ao clicar em "Configurar conta" ou fechar a modal, a sessao nao e marcada
  como dispensada antes da resposta do backend. Se `updatedAt` muda depois do
  evento, a modal pode reabrir e criar a sensacao de ir e voltar entre telas.
- O scroll do tour faz apenas uma tentativa imediata e uma atrasada. Em mobile,
  com drawer, header fixo e troca de view, o alvo pode nao estar pronto ou nao
  ficar centralizado.
- O texto "Lembrar depois" nao comunica claramente uma opcao de pular o guia.

## Decisao

Manter o onboarding como guia opcional e corrigir o comportamento mobile sem
reescrever o sistema de onboarding.

O app deve:

- nao iniciar o tour guiado automaticamente;
- oferecer uma opcao clara de "Pular guia";
- marcar a modal como dispensada na sessao ao fechar, pular, configurar conta
  ou criar proposta;
- preservar o botao "Ver tour guiado" como acao explicita;
- melhorar o scroll automatico do tour em mobile com multiplas tentativas apos
  troca de tela/menu;
- cobrir o fluxo com Playwright em viewport mobile.

## Revisao adicional de navegacao mobile

Em 2026-08-03, a revisao foi ampliada para agir como usuario autenticado no
celular e conferir a camada de navegacao e botoes:

- bottom nav: Inicio, Propostas, Clientes, Servicos;
- drawer "Mais": Nova proposta, Novo cliente, Novo pacote, Perfil da conta,
  Suporte e tema;
- acoes principais: criar cliente, criar pacote, montar proposta, gerar PDF e
  enviar solicitacao de suporte;
- layout: checagem de overflow horizontal apos a navegacao.

## Fora de escopo

- Alterar endpoints ou banco.
- Redesenhar todo o onboarding.
- Alterar regras de negocio de conclusao das jornadas.
- Fazer deploy neste ciclo sem pedido explicito.

## Perguntas tratadas como decisao neste ciclo

- "Pular" deve pular todo o guia inicial, nao apenas a aba ativa, mantendo
  possibilidade de retomar pelo painel.
- "Configurar conta" deve levar direto ao perfil sem reabrir a modal na mesma
  sessao.
- Tour guiado so deve iniciar por clique do usuario.
