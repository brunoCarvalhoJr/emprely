# Relatorio de layout e usabilidade - Emprely

Data da execucao: 2026-06-20  
Ambiente: `https://app.emprely.com.br`  
Foco: layout, responsividade, hierarquia visual, alvos de toque, contraste, navegacao e usabilidade operacional.

## Resumo executivo

A interface principal do Emprely esta funcional e sem overflow horizontal nas telas auditadas. O desktop tem boa estrutura de SaaS operacional: sidebar, listas, formularios e acoes contextuais previsiveis. O maior risco esta no mobile: a barra inferior fixa interfere com formularios e compete com a conclusao de tarefas; o dashboard mobile concentra muitos blocos de prioridade alta; e a navegacao mobile tem ambiguidades entre acoes rapidas e itens de menu.

Foram executados dois ciclos de auditoria visual automatizada. O primeiro ciclo coletou 13 telas e revelou falhas do roteiro em navegacao tablet/mobile. O segundo ciclo corrigiu a navegacao responsiva do auditor e coletou 23 telas: desktop completo e telas principais em tablet/mobile. O plugin `@chrome` foi tentado conforme solicitado, mas o runtime do plugin falhou antes de aceitar comandos (`sandboxPolicy` ausente). A bateria foi executada com automacao Playwright/Chromium local, registrando essa limitacao como falha de ferramenta, nao do produto.

Evidencias salvas em:

- `docs/testing/evidencias/layout-usabilidade-2026-06-20/`
- JSON bruto: `docs/testing/evidencias/layout-usabilidade-2026-06-20/audit-layout-usabilidade.json`

## Cobertura executada

| Viewport | Telas auditadas |
|---|---|
| Desktop 1440x1000 | login, dashboard, clientes lista/formulario, servicos lista/formulario, propostas lista, inicio do assistente de proposta, suporte, personalizacao, configuracoes |
| Tablet 768x1024 | login, dashboard, clientes lista/formulario, servicos/propostas principais |
| Mobile 390x844 | login, dashboard, clientes lista/formulario, servicos lista, propostas lista |

## Achados prioritarios

### P0 - Barra inferior mobile cobre a acao principal de formularios

Evidencia: `mobile-clientes-formulario.png`

No formulario mobile de cliente, a bottom navigation fixa fica sobre a area inferior do formulario e cobre parcialmente o botao principal de salvar. Isso cria risco direto de abandono ou erro, porque a conclusao da tarefa fica visualmente bloqueada no ponto mais importante do fluxo.

Impacto:

- Criar/editar cliente em mobile fica mais dificil.
- O mesmo padrao pode afetar servicos, proposta e configuracoes sempre que a acao final fica no rodape.

Recomendacao:

- Adicionar padding inferior global no conteudo mobile equivalente a altura da bottom nav + margem segura.
- Em formularios, tornar a barra de acoes sticky acima da bottom nav ou ocultar a bottom nav durante edicao.
- Validar em 390x844, 430x932 e 768x1024.

### P1 - Dashboard mobile tem excesso de prioridades no primeiro fluxo

Evidencia: `mobile-dashboard.png`

O dashboard mobile apresenta, em sequencia, CTA de nova proposta, cadastro de servico/cliente, alerta de plano trial, guia inicial, fluxo guiado, metricas e propostas recentes. A tela funciona, mas o usuario precisa atravessar muitos blocos antes de entender qual tarefa deve executar primeiro.

Impacto:

- Reduz clareza para primeiro uso.
- Compete com a tarefa principal: criar a primeira proposta.
- Aumenta custo cognitivo no mobile.

Recomendacao:

- Definir uma prioridade por estado da conta: onboarding incompleto, trial, uso recorrente.
- Transformar aviso de trial em faixa compacta ou card colapsavel.
- Mostrar apenas CTA principal + proximo passo imediato no primeiro viewport.
- Mover metricas e propostas recentes para depois do fluxo guiado ou para uma aba/colapso.

### P1 - Navegacao mobile tem ambiguidade entre acao rapida e item de menu

Evidencias: `tablet-servicos-lista.png`, `mobile-servicos-lista.png`

No drawer mobile existem botoes rapidos como `Servico` e tambem item de navegacao `Servicos`. Na automacao, a selecao por texto parcial abriu formulario em vez da lista. Para usuario humano, a proximidade visual e semantica tambem pode gerar confusao, especialmente porque uma opcao cria algo e outra apenas navega.

Impacto:

- Usuario pode abrir criacao quando queria ver catalogo.
- Testes de UI ficam frageis.

Recomendacao:

- Renomear a acao rapida para `Novo servico`.
- Renomear o item de navegacao para `Catalogo` ou `Servicos e pacotes`.
- Separar visualmente acoes de criacao e navegacao com titulos claros.
- Adicionar `data-testid` estaveis tambem para itens do drawer mobile.

### P1 - Alvos de toque abaixo de 44px em pontos recorrentes

Evidencias: `desktop-login-publico.png`, `tablet-login-publico.png`, `mobile-login-publico.png`, `mobile-dashboard.png`

Foram detectados controles com altura menor que 44px: abas de login/cadastro com 34px, botao de mostrar senha com 33px, botao de menu mobile com 41px e toggle de recolher sidebar com 28px no desktop.

Impacto:

- Piora usabilidade touch.
- Aumenta erro de toque em mobile/tablet.
- Afeta acessibilidade motora.

Recomendacao:

- Padronizar controles interativos com minimo real de 44x44px.
- Manter icones compactos visualmente, mas com area clicavel maior.
- Revisar tabs, botoes iconicos e botoes de acao secundaria.

### P1 - Contraste baixo em textos de acento sobre fundos claros

Evidencias: `desktop-dashboard.png`, `mobile-dashboard.png`, `mobile-propostas-lista.png`, `tablet-clientes-lista.png`

O auditor marcou contraste baixo em textos teal/acento como `Primeiros passos`, `Base ativa` e `Historico ativo`, com razao aproximada de 2.11:1. Alguns alertas em areas com gradiente podem ser falso positivo, mas os textos teal sobre fundo claro aparecem de fato leves demais para leitura confortavel.

Impacto:

- Leitura pior em telas de baixa qualidade ou brilho alto.
- Risco de nao conformidade WCAG para texto informativo.

Recomendacao:

- Escurecer o teal usado em texto ou reservar a cor atual para icones/bordas.
- Para labels pequenas, usar cor neutra escura e acento apenas como detalhe.
- Rodar axe/contraste apos ajuste.

## Achados secundarios

### P2 - Dados da conta truncam na sidebar desktop

Evidencias: `desktop-dashboard.png`, `desktop-clientes-lista.png`

Nome da conta e e-mail aparecem truncados na sidebar. Isso e aceitavel em sidebar estreita, mas o usuario perde identificacao completa da conta.

Recomendacao:

- Adicionar tooltip/title com nome e e-mail completos.
- Considerar duas larguras: sidebar normal com mais espaco e colapsada apenas por acao explicita.

### P2 - Formularios mobile usam escala visual muito grande

Evidencia: `mobile-clientes-formulario.png`

O formulario mobile tem cabecalho, botao voltar e campos muito grandes. A legibilidade e boa, mas a densidade e baixa para um SaaS operacional, fazendo o usuario rolar muito para concluir uma tarefa simples.

Recomendacao:

- Reduzir H1 em telas internas mobile.
- Aproximar botao voltar, titulo e card do formulario.
- Compactar espaçamentos verticais mantendo alvos de toque.

### P2 - Personalizacao desktop tem densidade alta e acao fixa competindo com conteudo

Evidencia: `desktop-personalizacao.png`

A tela de personalizacao e visualmente rica, mas concentra muitas escolhas: tema, formato, cores, templates e previews. O botao fixo de salvar e util, mas pode competir com a area de cards de template.

Recomendacao:

- Separar em abas: `Aparencia`, `Templates`, `Envio`.
- Manter salvar fixo apenas quando houver alteracao pendente.
- Usar estado "sem alteracoes" para reduzir pressao visual.

### P2 - Alguns controles aparecem sem nome acessivel na heuristica

Evidencias: JSON bruto da auditoria

O auditor apontou controles sem nome em formularios e configuracoes. Pode haver falso positivo porque a heuristica nao resolve todos os `label for`, mas vale validar com axe-core.

Recomendacao:

- Rodar auditoria axe em login, formulario de cliente, servico, suporte e configuracoes.
- Garantir `label`, `aria-label` ou associacao explicita para inputs iconicos/checkboxes.

## Limites da execucao

- O plugin `@chrome` foi solicitado e tentado, mas o runtime do plugin falhou antes da navegacao. A bateria visual foi executada com automacao local equivalente para gerar evidencias.
- O painel admin nao foi auditado visualmente nesta rodada: a automacao nao encontrou os campos esperados de login admin no estado atual.
- O assistente de proposta foi auditado no inicio do fluxo; as etapas internas completas devem entrar em uma proxima bateria visual dedicada.

## Ordem recomendada para atacar

1. Corrigir bottom nav mobile cobrindo acoes de formulario.
2. Reorganizar dashboard mobile por prioridade do estado do usuario.
3. Separar acoes rapidas e navegacao no drawer mobile.
4. Padronizar alvo minimo de toque em 44x44px.
5. Ajustar contraste dos textos de acento.
6. Validar acessibilidade com axe-core.
7. Fazer bateria dedicada nas etapas completas do assistente de proposta e preview/PDF.

## Evidencias principais

| Achado | Evidencia |
|---|---|
| Bottom nav cobre salvar em formulario mobile | `mobile-clientes-formulario.png` |
| Dashboard mobile denso | `mobile-dashboard.png` |
| Lista de propostas mobile com filtros e cards funcionais | `mobile-propostas-lista.png` |
| Personalizacao desktop densa | `desktop-personalizacao.png` |
| Login com alvos baixos e contraste a revisar | `desktop-login-publico.png`, `mobile-login-publico.png` |
