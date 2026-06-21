# Analise - Repaginacao de layout e usabilidade mobile do Emprely

## Contexto

O Emprely esta evoluindo de um MVP funcional para um SaaS que precisa ser pratico no celular. A visao mobile ja recebeu correcoes pontuais em menu, dashboard, primeiros passos, fluxo de proposta, preview e navegacao fixa entre etapas. O proximo passo deve consolidar esses ajustes em um sistema mobile consistente para evitar novas correcoes isoladas tela a tela.

Nesta analise, "repaginacao" e usada como redesenho estruturado da experiencia mobile. O objetivo nao e mudar identidade visual ou criar uma versao separada do produto, mas tornar a experiencia mobile mais rapida, limpa, previsivel e adequada ao uso real de um pequeno prestador de servicos criando orcamentos pelo celular.

## Pesquisa usada como base

Principios considerados a partir da pesquisa web anterior:

- Apple Human Interface Guidelines: navegacao familiar, hierarquia clara, layout adaptavel e controles contextualizados.
- Material Design 3: navegacao inferior em larguras compactas, alvos de toque confortaveis e componentes consistentes.
- Nielsen Norman Group: reduzir carga cognitiva, formularios com menos esforco, feedback rapido e alvos de toque adequados.
- Baymard Institute: labels persistentes acima dos campos, campos opcionais explicitos e formularios mobile com contexto claro.
- WCAG 2.2: alvos de toque minimos e acessibilidade para interacoes por toque.
- Web Vitals: responsividade percebida, INP e estabilidade visual.

## Problemas atuais observados

### Navegacao

- O app ainda carrega herancas de layout desktop em algumas telas mobile.
- O usuario pode perder contexto quando esta dentro de fluxos longos.
- Algumas acoes globais e acoes contextuais competem visualmente.
- Menu lateral adaptado para mobile funciona, mas ainda pode ser simplificado em uma navegacao principal mais direta.

### Formularios

- Algumas telas mostram muitos campos ao mesmo tempo.
- Campos opcionais podem parecer obrigatorios quando ficam no mesmo peso visual dos obrigatorios.
- Fluxos longos exigem rolagem extensa.
- A hierarquia entre "obrigatorio para avancar" e "melhora a proposta" ainda nao e sempre evidente.

### Propostas

- O fluxo de nova proposta e o ponto mais critico do app mobile.
- Criar uma proposta exige alternar entre cliente, item, template, detalhes, revisao e preview.
- O usuario precisa conseguir montar uma proposta minima rapidamente e enriquecer detalhes depois.
- Preview e template precisam continuar inspecionaveis, com zoom e sem cortar conteudo.

### Dashboard

- O dashboard mobile deve priorizar proxima acao, nao apenas indicadores.
- Primeiros passos devem ensinar o fluxo real: perfil -> cliente -> servico -> proposta -> preview/geracao.

### Listagens

- Tabelas e grids densos nao sao adequados no mobile.
- Acoes de editar, duplicar, excluir, visualizar e enviar precisam ser agrupadas de forma previsivel.

## Principios de decisao

1. Mobile e fluxo guiado, nao desktop reduzido.
2. Uma tarefa principal por tela.
3. Acao primaria sempre visivel em fluxos longos.
4. Campos opcionais devem ser progressivos.
5. Toques devem ter area confortavel.
6. Feedback deve aparecer imediatamente apos a acao.
7. Preview deve ser facil de abrir, fechar, ampliar e reduzir.
8. O usuario deve conseguir criar uma proposta minima em poucos minutos.

## Oportunidades

- Criar um "Mobile UX Foundation" dentro do app web.
- Padronizar barras fixas, secoes, cards, formularios, listagens e modais.
- Reduzir ruído visual no mobile sem perder capacidade no desktop.
- Transformar o fluxo de proposta em uma experiencia quase assistida.
- Medir a qualidade mobile com testes Playwright em 360px, 390px e 430px.

## Riscos

- Refatorar muitas telas de uma vez pode gerar regressao.
- Barras fixas podem cobrir conteudo se safe-area e padding inferior nao forem padronizados.
- Ocultar demais os campos opcionais pode prejudicar usuarios avancados.
- Mudar navegacao principal pode exigir novo teste manual completo.

## Recomendacao

Implementar em fases:

1. Fundacao visual mobile e navegacao.
2. Formularios e componentes de entrada.
3. Fluxo de proposta.
4. Listagens e acoes.
5. Preview, modais e feedback.
6. Auditoria final, testes e deploy.

