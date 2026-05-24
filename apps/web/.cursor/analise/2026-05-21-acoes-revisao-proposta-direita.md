# Analise Web - Acoes da revisao de proposta a direita

## Contexto

A etapa de revisao final do fluxo de proposta exibe `Voltar`, `Visualizar Proposta`, `Salvar rascunho` e `Gerar proposta` no mesmo grupo de acoes.

## Problema

Os botoes principais da revisao aparecem alinhados a esquerda junto com `Voltar`. Isso enfraquece a hierarquia do rodape, porque as acoes de conclusao deveriam ficar agrupadas no lado direito, seguindo o padrao das demais etapas do wizard.

## Objetivo

Manter `Voltar` no lado esquerdo e alinhar `Visualizar Proposta`, `Salvar rascunho` e `Gerar proposta` no lado direito do rodape da revisao.

## Escopo

- Ajustar apenas a etapa de revisao final do fluxo de proposta.
- Criar um grupo visual para as acoes de conclusao.
- Preservar empilhamento em telas pequenas para evitar overflow horizontal.

## Riscos

- Em telas estreitas, o novo grupo pode apertar os botoes se nao houver quebra responsiva.
- A ordem dos botoes deve continuar igual para nao mudar o fluxo mental do usuario.

## Duvidas

- Nenhuma bloqueante.
