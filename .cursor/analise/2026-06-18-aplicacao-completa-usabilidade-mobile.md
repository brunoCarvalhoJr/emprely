# Analise - Aplicacao completa da usabilidade mobile

## Contexto

O Emprely ja recebeu melhorias mobile pontuais para menu, fluxo de proposta, preview e dock inferior. A solicitacao atual e aplicar o restante da spec de repaginacao mobile de forma completa, cobrindo a experiencia geral do SaaS no celular.

## Lacunas identificadas antes desta rodada

- Bottom navigation existe, mas precisa de acabamento para evitar ambiguidade visual de foco/ativo.
- Fluxo de proposta recebeu campos opcionais recolhidos, mas telas comuns ainda precisam de padroes globais para formularios, tabelas e acoes.
- Listagens mobile precisam preservar leitura rapida e botoes de acao com alvos confortaveis.
- Modais e dialogs precisam limitar altura no mobile, evitando conteudo inacessivel atras da barra inferior.
- Fluxos longos precisam reservar espaco inferior suficiente para barras fixas.
- A spec possui decisoes pendentes; nesta rodada a decisao operacional sera manter drawer para itens secundarios e usar bottom navigation para destinos principais.

## Decisoes de implementacao

- Manter `Dashboard`, `Propostas`, `Clientes`, `Servicos` e `Mais` na bottom navigation mobile.
- Manter o drawer como destino de `Mais`, contendo itens secundarios, conta e saida.
- Aplicar melhorias globais por CSS aos formulários existentes para reduzir risco de refatoracao ampla em uma tela monolitica.
- Priorizar a proposta como fluxo guiado principal, com dock fixo e opcionais recolhidos.
- Usar cards mobile para tabelas e botoes de acao com area minima de toque.
- Evitar alterar regra comercial, backend ou modelos de dados.

## Criterios de verificacao

- App sem overflow horizontal em 360, 390 e 430px.
- Dock da proposta sempre dentro do viewport.
- Usuario consegue avancar da etapa Detalhes para Revisao sem rolar ate o fim.
- Lint e build passam.
- Screenshots mobile principais nao apresentam sobreposicao evidente.
