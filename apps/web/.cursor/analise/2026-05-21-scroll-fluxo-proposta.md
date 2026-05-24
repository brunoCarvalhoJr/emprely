# Analise Web - Scroll vertical no fluxo de proposta

## Contexto

O fluxo de criar/editar proposta usa o layout autenticado com sidebar fixa e `app-content` rolavel. As etapas do builder tambem receberam alturas minimas para manter os botoes alinhados no rodape do painel.

## Problema

Em telas de desktop, algumas etapas passam a gerar scroll vertical mesmo quando o conteudo visivel caberia no viewport. O caso mais evidente e a etapa de itens: existe espaco em branco dentro do painel, mas a pagina ainda fica rolavel.

## Causa provavel

- `app-content` usa padding amplo em todos os contextos autenticados.
- `proposal-step-screen` e `proposal-wizard-step` usam `min-height` baseada no viewport, deixando altura artificial grande dentro de um card que ja possui cabecalho, wizard, margens e padding.
- O builder de proposta precisa ser mais compacto que listagens e dashboards, pois e um fluxo operacional de varias etapas.

## Objetivo

Reduzir scroll vertical desnecessario no fluxo de proposta sem remover scroll quando o conteudo realmente exceder a tela.

## Escopo

- Adicionar classe especifica ao `app-content` quando o editor/assistente de proposta estiver ativo.
- Compactar padding e gaps do editor em desktop.
- Trocar a altura minima rigida das etapas por uma altura responsiva menor, preservando `margin-top: auto` nos botoes.
- Manter comportamento mobile com scroll quando necessario.

## Riscos

- Reduzir demais as alturas pode deixar os botoes colados no conteudo. O ajuste deve manter respiro visual minimo.
- Etapas com conteudo maior, como detalhamento e revisao, devem continuar podendo rolar.

## Duvidas

- Nenhuma bloqueante.
