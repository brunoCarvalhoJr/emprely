# Análise - Curadoria de templates de orçamento para serviços digitais

## Contexto

Após a pesquisa de fluxo e de referências de orçamento para prestadores de serviços digitais, os templates atuais precisam sair de uma coleção genérica para uma galeria mais direcionada ao público-alvo da Emprely: social media, gestores de tráfego, designers, consultores e pequenas agências.

## Problema

A galeria atual tem muitos templates com diferença mais estética do que comercial. Alguns nomes como Claymorphism e Emprely não comunicam um uso real para o usuário final. Também faltam visuais que ajudem a proposta a parecer criada para o ramo de trabalho do prestador.

## Decisões

- Manter os IDs técnicos existentes para evitar quebra em propostas antigas e no contrato da API.
- Desativar da galeria os templates menos úteis para aquisição e escolha rápida.
- Reposicionar os templates ativos por caso de uso, com nomes e descrições comerciais.
- Adicionar imagens/ilustrações SVG dentro dos templates para representar rotina e entregáveis do ramo.
- Preservar renderização dos templates antigos para propostas já salvas.

## Templates ativos esperados

- Orçamento rápido
- Proposta completa
- Social media planner
- Social premium
- Tráfego performance
- Identidade visual studio
- Consultoria estratégica
- Agência growth board

## Riscos

- Como os IDs técnicos continuam iguais, o texto do label pode mudar em propostas existentes quando exibido no app. O risco é aceitável porque o objetivo é evoluir a curadoria sem migração de banco.
- Imagens externas aumentariam risco de carregamento/exportação; por isso serão SVGs/CSS locais no próprio documento.
