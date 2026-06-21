# Analise - Curadoria de templates de orcamento para servicos digitais

## Contexto

A pesquisa estrategica mostrou que a Emprely deve vender mais do que um PDF bonito. O produto precisa parecer um sistema de propostas para quem vende servicos criativos e digitais por WhatsApp, DM e e-mail: social medias, creators, UGC creators, gestores de trafego, designers, consultores e pequenas agencias.

## Problema

A galeria atual mistura templates por estilo visual e nao por situacao real de venda. Nomes como Claymorphism e Emprely nao comunicam o uso comercial para o usuario final. Tambem faltava um template claro para midia kit/rate card de creators e uma separacao melhor entre social media mensal, UGC, trafego, design, consultoria e agencia.

## Decisoes

- Reaproveitar os IDs tecnicos existentes, conforme decisao de produto, sem alterar enum, contrato da API ou banco.
- Aceitar que propostas antigas que usem IDs reaproveitados passem a exibir o novo conceito visual do template.
- Desativar da galeria os templates menos uteis para aquisicao e escolha rapida.
- Reposicionar os templates ativos por caso de uso, com nomes e descricoes comerciais.
- Usar imagens/ilustracoes SVG/CSS locais dentro dos templates para representar rotina e entregaveis do ramo.
- Evitar imagens externas para reduzir risco em exportacao PDF/PNG.

## Templates ativos esperados

- Orcamento rapido WhatsApp
- Proposta comercial completa
- Social media mensal
- Reels, videos curtos e UGC
- Midia kit e rate card
- Trafego pago e campanhas
- Design e identidade visual
- Consultoria e diagnostico
- Agencia growth board

## Riscos

- Como os IDs tecnicos serao reaproveitados, o layout de propostas antigas pode mudar quando reaberto no app. O risco e aceitavel porque a prioridade e evoluir a curadoria sem migracao.
- Templates removidos da galeria precisam continuar aceitos pelo normalizador para nao quebrar dados existentes.
- Imagens externas aumentariam risco de carregamento/exportacao; por isso os visuais devem ser SVG/CSS locais no proprio documento.
