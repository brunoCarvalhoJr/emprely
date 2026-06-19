# Spec - Repaginacao de layout e usabilidade mobile do Emprely

## 1. Visao geral

Criar uma fundacao de usabilidade mobile para o Emprely, tornando o app mais rapido, limpo e pratico no celular. A repaginacao deve consolidar os ajustes pontuais ja feitos e estabelecer padroes consistentes para navegacao, formularios, fluxos de proposta, listagens, modais, preview e feedback.

Esta spec nao cobre uma nova identidade visual nem uma versao nativa do app. O objetivo e melhorar a experiencia mobile do app web atual.

## 2. Objetivos

- Reduzir esforco para criar uma proposta pelo celular.
- Evitar que o usuario precise rolar longas telas para executar a acao principal.
- Tornar campos obrigatorios e opcionais claramente distintos.
- Padronizar componentes mobile para evitar inconsistencias tela a tela.
- Melhorar legibilidade, toque, hierarquia visual e velocidade percebida.
- Manter o desktop funcional e sem regressao.
- Criar uma base testavel para evolucoes futuras.

## 3. Nao objetivos

- Nao recriar o backend.
- Nao alterar regras comerciais do MVP.
- Nao mudar precificacao, planos ou autenticacao.
- Nao criar aplicativo nativo iOS/Android.
- Nao redesenhar a landing page.
- Nao remover recursos existentes do desktop.

## 4. Publico e contexto de uso

Usuarios principais:

- Prestadores de servico pequenos.
- Autonomos.
- Pequenas agencias.
- Usuarios que criam orcamentos durante atendimento, visita, WhatsApp ou deslocamento.

Contextos mobile comuns:

- Usuario com pouco tempo.
- Uso com uma mao.
- Tela pequena entre 360px e 430px.
- Teclado virtual ocupando parte da tela.
- Necessidade de montar proposta minima rapidamente.
- Necessidade de revisar e compartilhar proposta sem abrir desktop.

## 5. Principios de UX mobile

### 5.1 Uma tarefa principal por tela

Cada tela deve ter uma acao dominante. Exemplos:

- Dashboard: iniciar ou continuar proposta.
- Clientes: cadastrar ou selecionar cliente.
- Servicos: cadastrar ou selecionar servico.
- Proposta: avancar etapa.
- Revisao: salvar, gerar ou visualizar.

### 5.2 Acao primaria sempre acessivel

Fluxos longos devem ter barra fixa inferior no mobile com a proxima acao contextual.

Regras:

- A barra deve usar `position: fixed` ou portal no `document.body`.
- Deve respeitar `env(safe-area-inset-bottom)`.
- O conteudo da pagina deve ter padding inferior suficiente.
- Nao deve haver duas barras de acao concorrendo no rodape.

### 5.3 Campos opcionais progressivos

Campos opcionais nao devem ficar com o mesmo peso visual dos obrigatorios.

Padrao:

- Mostrar primeiro os campos obrigatorios.
- Agrupar opcionais em blocos expansivos.
- Usar labels como `Opcional`, `Adicionar detalhes`, `Melhorar proposta`.
- Permitir continuar sem preencher opcionais.

### 5.4 Toque confortavel

Todos os controles interativos mobile devem ter:

- Altura minima recomendada: 44px.
- Ideal para botoes principais: 48px.
- Espacamento minimo entre alvos: 8px.
- Icon buttons com area clicavel maior que o icone.

### 5.5 Feedback imediato

Toda acao deve dar retorno claro:

- Clique em botao: estado pressed/loading/disabled.
- Salvamento: `Salvando...` e confirmacao.
- Erro: mensagem proxima ao campo e resumo quando necessario.
- Operacoes longas: loading com texto claro.

### 5.6 Layout clean e operacional

O Emprely e um SaaS operacional. O mobile deve ser denso, mas calmo.

Regras:

- Evitar cards dentro de cards.
- Evitar hero grande em telas internas.
- Evitar textos explicativos longos.
- Usar titulos compactos.
- Priorizar leitura por blocos.
- Evitar decoracao sem funcao.

## 6. Breakpoints e viewports de referencia

O layout deve ser validado em:

- 360 x 800: Android pequeno.
- 390 x 844: iPhone padrao usado nos testes atuais.
- 430 x 932: celulares maiores.
- 768 x 1024: tablet vertical, quando aplicavel.

Breakpoint principal mobile:

- `max-width: 640px`.

Breakpoint compacto critico:

- `max-width: 390px`.

## 7. Arquitetura visual mobile

### 7.1 Topbar mobile

Deve conter:

- Botao de menu.
- Avatar/inicial da conta.
- Titulo da secao atual.
- Nome da conta em texto secundario.

Regras:

- Altura compacta e estavel.
- Nao deve ocupar muito do primeiro viewport.
- Nao deve ter CTA grande competindo com a acao principal da tela.
- Acoes especificas devem ficar no conteudo ou na barra inferior contextual.

### 7.2 Navegacao principal

Opcoes recomendadas:

1. Manter drawer atual, mas simplificado.
2. Evoluir para bottom navigation com 4 ou 5 destinos principais.

Destinos sugeridos:

- Inicio.
- Propostas.
- Clientes.
- Servicos.
- Conta ou Mais.

Regras:

- Bottom navigation deve ser apenas para destinos principais.
- Acoes como `Nova proposta` nao devem competir como aba fixa se ja houver CTA contextual.
- `Admin emails` e itens secundarios devem ficar em `Mais` ou configuracoes.

### 7.3 Barras fixas contextuais

Usar em:

- Fluxo de nova proposta.
- Formularios longos.
- Revisao e geracao.

Nao usar em:

- Telas simples com conteudo curto.
- Listagens com acao primaria ja visivel no topo.

Formato:

- Lado esquerdo: contexto curto da etapa.
- Lado direito: uma ou duas acoes.
- Maximo de 2 botoes.
- Botao primario sempre destacado.

## 8. Padroes de formulario mobile

### 8.1 Campos

Regras:

- Label sempre acima do campo.
- Placeholder apenas como exemplo, nunca como unico label.
- Marcar opcional explicitamente.
- Inputs com altura minima de 44px.
- Textareas devem ter altura inicial adequada e resize visual controlado.
- Erros devem aparecer logo abaixo do campo.

### 8.2 Teclado e input modes

Usar:

- `inputMode="numeric"` para quantidade, dias e codigos numericos.
- `inputMode="decimal"` para valores quando aplicavel.
- `type="email"` para e-mail.
- Mascara para telefone, CPF/CNPJ e moeda.

### 8.3 Reducao de digitacao

Aplicar:

- Defaults inteligentes.
- Selects quando houver opcoes salvas.
- Autopreenchimento de proposta a partir de cliente e servico.
- Titulo automatico da proposta.
- Template padrao da conta.
- Validade padrao.

### 8.4 Organizacao

Padrao de bloco:

- Titulo curto.
- Campos obrigatorios.
- Bloco `Detalhes opcionais`.
- CTA fixo ou no fim quando a tela for curta.

## 9. Fluxo mobile de nova proposta

### 9.1 Objetivo do fluxo

Permitir criar uma proposta minima em poucos minutos:

1. Selecionar ou cadastrar cliente.
2. Confirmar mensagem basica.
3. Adicionar servico ou item livre.
4. Escolher template.
5. Opcionalmente preencher detalhes comerciais.
6. Revisar, salvar, gerar e visualizar.

### 9.2 Stepper mobile

Manter:

- Resumo compacto no topo.
- `Etapa X de Y`.
- Nome da etapa.
- Progresso visual.
- `Ver etapas` expansivel.

Melhorias futuras:

- Permitir recolher automaticamente apos escolher etapa.
- Indicar campos obrigatorios pendentes.
- Exibir estado `Opcional` para detalhes comerciais.

### 9.3 Barra fixa inferior

Comportamento por etapa:

- Cliente: `Proximo`.
- Proposta: `Voltar` e `Proximo`.
- Itens: `Voltar` e `Proximo`.
- Template: `Voltar` e `Proximo`.
- Detalhes: `Voltar` e `Proximo`.
- Revisao: `Voltar` e `Salvar` ou `Gerar`.

Regras:

- O clique em `Proximo` deve validar apenas campos obrigatorios da etapa.
- O usuario deve conseguir pular campos opcionais.
- A barra nao deve cobrir campos nem mensagens de erro.

### 9.4 Etapa Cliente

Objetivo:

- Escolher cliente salvo ou cadastrar um novo sem sair do fluxo.

Requisitos:

- Mostrar cliente salvo como primeira opcao se houver clientes.
- Cadastro rapido deve pedir apenas nome e, opcionalmente, telefone/e-mail.
- Apos cadastrar cliente, continuar automaticamente no fluxo da proposta.

### 9.5 Etapa Proposta

Objetivo:

- Confirmar titulo e mensagem basica.

Campos:

- Titulo: obrigatorio.
- Introducao: opcional.
- Observacoes: opcional.

Melhoria:

- Introducao e observacoes devem poder ficar recolhidas.
- Mostrar sugestao gerada automaticamente quando vazia.

### 9.6 Etapa Itens

Objetivo:

- Adicionar ao menos um item.

Requisitos:

- Select de servico salvo.
- Botao de adicionar item livre.
- Cards de itens em vez de tabela.
- Cada item deve mostrar nome, quantidade, valor e total.
- Edicao detalhada deve ser expansiva para descricao.

### 9.7 Etapa Template

Objetivo:

- Escolher visual da proposta.

Requisitos:

- Cards compactos com nome e mini preview.
- Botao `Preview` por template.
- Preview em tela inteira no mobile com modos: inteiro, zoom e 100%.
- Botao `Usar este template` sempre acessivel.

### 9.8 Etapa Detalhes

Objetivo:

- Enriquecer a proposta, sem bloquear o fluxo.

Campos opcionais:

- Desconto.
- Condicoes de pagamento.
- O que esta incluso.
- O que nao esta incluso.
- Cronograma.
- Beneficios.

Requisitos:

- A etapa deve ser claramente marcada como opcional.
- Blocos opcionais devem ser expansivos.
- O usuario deve poder tocar em `Proximo` sem rolar.
- Cada bloco deve ter botao `Adicionar` e estado vazio limpo.

### 9.9 Etapa Revisao

Objetivo:

- Conferir a proposta antes de salvar/gerar.

Requisitos:

- Mostrar resumo: cliente, template, validade, total.
- Mostrar status: pronto, falta salvar, falta item, plano bloqueado.
- Cards de revisao devem ser escaneaveis.
- Acoes principais na barra fixa.
- Preview sempre acessivel.

## 10. Dashboard mobile

### 10.1 Objetivo

Ser uma central de proxima acao.

Prioridade visual:

1. CTA principal: `Nova proposta`.
2. Primeiros passos ou proximo passo pendente.
3. Propostas recentes.
4. Indicadores resumidos.

### 10.2 Primeiros passos

Fluxo esperado:

- Perfil da conta.
- Primeiro cliente.
- Primeiro servico.
- Primeira proposta.

Regras:

- Ao concluir um passo, direcionar para o proximo.
- Nao deixar o usuario preso na tela anterior.
- Mostrar progresso de forma compacta.

## 11. Clientes mobile

### 11.1 Listagem

Requisitos:

- Cards em vez de tabela.
- Busca no topo.
- CTA `Novo cliente`.
- Acoes secundarias em menu por item.

### 11.2 Cadastro

Campos prioritarios:

- Nome.
- Telefone.
- E-mail.

Campos opcionais recolhidos:

- Documento.
- Observacoes.
- Redes sociais.
- Endereco.

## 12. Servicos mobile

### 12.1 Listagem

Requisitos:

- Cards com nome, preco, categoria e status.
- Busca/filtro simples.
- CTA `Novo servico`.

### 12.2 Cadastro

Campos prioritarios:

- Nome.
- Preco.
- Unidade/tipo.

Campos opcionais:

- Categoria.
- Descricao.

## 13. Propostas mobile

### 13.1 Listagem

Requisitos:

- Cards em vez de tabela.
- Cada card deve mostrar cliente, status, total e data.
- Acoes principais: visualizar, editar, duplicar.
- Acoes destrutivas em menu secundario com confirmacao.

### 13.2 Estados

Status visual:

- Rascunho.
- Gerada.
- Enviada.
- Aceita.
- Recusada.
- Arquivada.

## 14. Modais e previews

### 14.1 Regra geral

No mobile, modais importantes devem ocupar tela inteira.

Requisitos:

- Botao fechar sempre visivel.
- Cabecalho compacto.
- Acoes no topo ou barra inferior, mas nao ambos competindo.
- Conteudo com scroll proprio.

### 14.2 Preview de proposta/template

Requisitos:

- Abrir com documento inteiro visivel.
- Modos: `Inteiro`, `Zoom`, `100%`.
- Permitir fechar facilmente.
- Evitar cortar laterais do documento.
- Nao depender de pinch zoom do navegador.

## 15. Feedback, loading e erros

### 15.1 Toasts

Regras:

- Mobile deve exibir no maximo um toast visivel por vez.
- Mensagens devem ser curtas.
- Toast nao deve cobrir barra fixa principal.

### 15.2 Loading

Regras:

- Botoes devem mostrar loading local.
- Listagens podem usar skeleton compacto.
- Operacoes longas precisam de mensagem de progresso.

### 15.3 Erros

Regras:

- Erro de campo fica abaixo do campo.
- Erro de etapa deve aparecer proximo ao topo da secao e manter foco no campo.
- Erros de API devem explicar proximo passo.

## 16. Acessibilidade mobile

Requisitos:

- Alvos de toque minimos de 44px para controles principais.
- Contraste adequado em botoes, badges e textos.
- Labels associados aos campos.
- Icon buttons com `aria-label`.
- Foco visivel.
- Modais com foco contido e fechamento por ESC no desktop.
- Conteudo nao deve depender apenas de cor.

## 17. Performance e estabilidade visual

Metas:

- INP bom: ate 200ms nas interacoes principais, quando medido.
- Evitar layout shift em barras, cards e imagens.
- Evitar animacoes pesadas no mobile.
- Menus e modais devem abrir com resposta imediata.
- Inputs nao devem travar durante digitacao.

## 18. Padroes CSS/componentes esperados

Criar ou consolidar classes/componentes para:

- `mobile-app-topbar`.
- `mobile-navigation-drawer` ou futura bottom nav.
- `mobile-action-dock`.
- `mobile-form-section`.
- `mobile-optional-section`.
- `mobile-card-list`.
- `mobile-card-actions`.
- `mobile-fullscreen-modal`.
- `mobile-preview-stage`.
- `mobile-empty-state`.

Regras:

- Evitar estilos ad hoc por tela quando houver padrao reutilizavel.
- Usar tokens existentes de cor, borda e sombra.
- Border radius preferencial: 8px.
- Evitar cards dentro de cards.

## 19. Plano de implantacao

### Fase 1 - Fundacao mobile

Escopo:

- Revisar topbar mobile.
- Padronizar espacamentos.
- Criar padrao de barra fixa contextual.
- Garantir safe-area.
- Criar classes de cards e secoes mobile.

Aceite:

- Nenhuma tela principal com scroll horizontal em 360px, 390px e 430px.
- Acoes principais mobile seguem o mesmo padrao.

### Fase 2 - Formularios

Escopo:

- Padronizar labels, altura de inputs e mensagens.
- Marcar opcionais.
- Recolher campos complementares.
- Melhorar teclado/inputMode.

Aceite:

- Cliente, servico, perfil e proposta seguem o mesmo padrao.
- Campos opcionais nao parecem obrigatorios.

### Fase 3 - Nova proposta

Escopo:

- Refinar stepper.
- Tornar detalhes comerciais progressivos.
- Melhorar etapa de itens.
- Melhorar revisao.
- Garantir preview sempre acessivel.

Aceite:

- Usuario cria proposta minima sem preencher opcionais.
- Fluxo completo passa em Playwright mobile.

### Fase 4 - Listagens

Escopo:

- Clientes em cards mobile.
- Servicos em cards mobile.
- Propostas em cards mobile.
- Acoes secundarias em menu compacto.

Aceite:

- Nenhuma tabela densa aparece como principal no mobile.

### Fase 5 - Modais, preview e feedback

Escopo:

- Modais full-screen mobile.
- Toasts compactos.
- Loading e erros padronizados.
- Preview com zoom validado.

Aceite:

- Modais nao cortam conteudo.
- Usuario consegue fechar qualquer modal facilmente.

### Fase 6 - QA e deploy

Escopo:

- Testes automatizados.
- Smoke manual.
- Deploy beta.
- Documentacao no rastreador.

Aceite:

- App publico sem tela branca.
- Fluxos principais validados.

## 20. Testes obrigatorios

### 20.1 Automatizados

Comandos:

- `pnpm.cmd --dir apps/web lint`
- `scripts/build-web-beta.ps1`

Playwright:

- Login/session mock.
- Dashboard mobile.
- Criar cliente.
- Criar servico.
- Criar proposta minima.
- Selecionar template.
- Pular detalhes opcionais.
- Revisar.
- Preview.
- Salvar rascunho.

Viewports:

- 360 x 800.
- 390 x 844.
- 430 x 932.

Checks:

- Sem scroll horizontal.
- Sem erro de console relevante.
- Botao principal visivel.
- Barra fixa dentro do viewport.
- Texto sem corte.
- Nenhum elemento sobreposto.

### 20.2 Manual

Checklist:

- Testar no Chrome Android real.
- Testar teclado aberto em formularios.
- Testar voltar/avancar entre etapas.
- Testar preview e zoom.
- Testar salvar com rede lenta, se possivel.

## 21. Criterios gerais de aceite

- Mobile deve permitir executar o fluxo principal sem depender de desktop.
- Criacao de proposta minima deve ser possivel sem preencher campos opcionais.
- Nenhum fluxo principal deve exigir rolagem ate o fim para encontrar a acao primaria.
- Campos opcionais devem estar claramente identificados.
- Listagens mobile devem usar cards escaneaveis.
- Modais mobile devem ocupar tela inteira quando o conteudo for complexo.
- App deve continuar responsivo e funcional no desktop.
- Build e lint devem passar.
- Deploy deve ser validado em `https://app.emprely.com.br/`.

## 22. Fora de escopo para a primeira implementacao

- Bottom navigation definitiva, se exigir mudanca grande de arquitetura.
- Analytics de comportamento.
- Teste A/B.
- Novo design system completo.
- Offline mode.
- App instalavel/PWA avancado.

## 23. Decisoes pendentes

1. Manter drawer mobile ou evoluir para bottom navigation?
2. Quais itens ficam em `Mais`?
3. Campos opcionais devem abrir recolhidos por padrao em todas as telas ou apenas na proposta?
4. A barra fixa inferior deve aparecer em todos os formularios ou apenas nos fluxos guiados?
5. O dashboard deve priorizar `Nova proposta` ou `Continuar ultimo rascunho` quando existir rascunho?

## 24. Decisoes de aplicacao completa

Para a primeira aplicacao completa da spec, as decisoes abaixo substituem as pendencias operacionais da secao 23:

1. A navegacao mobile usa bottom navigation para destinos principais e drawer para itens secundarios.
2. A bottom navigation contem `Inicio`, `Propostas`, `Clientes`, `Servicos` e `Mais`.
3. `Mais` abre o drawer com conta, suporte, admin emails, preferencia de tema e saida.
4. Campos opcionais devem abrir recolhidos no fluxo de proposta e receber tratamento visual menos dominante nos demais formularios.
5. Barra fixa inferior obrigatoria apenas em fluxos guiados e telas longas de proposta; nas telas CRUD simples, a acao primaria fica no topo com alvo de toque grande.
6. Dashboard prioriza `Nova proposta`; rascunhos e continuidade podem entrar como melhoria posterior sem bloquear esta entrega.

## 25. Escopo aplicado nesta rodada

- Consolidar tokens mobile de espacamento, toque, raio e safe area.
- Refinar bottom navigation para reduzir ambiguidade entre item ativo e foco.
- Reservar padding inferior consistente para navegacao fixa e docks.
- Melhorar formularios mobile com inputs maiores, labels mais legiveis e espacamentos previsiveis.
- Melhorar tabelas/listagens mobile como cards escaneaveis.
- Melhorar dialogs e modais em telas pequenas.
- Manter a proposta como fluxo guiado principal, com acoes fixas e opcionais recolhidos.

## 26. Criterios finais de aceite da aplicacao completa

- `pnpm --dir apps/web lint` deve passar.
- Build web beta deve passar.
- Testes mobile automatizados devem passar em 360px, 390px e 430px.
- Nao deve haver overflow horizontal no body/html.
- A barra inferior da proposta deve permanecer dentro do viewport.
- A navegacao inferior nao deve aparecer durante o fluxo guiado de proposta.
- O usuario deve conseguir criar uma proposta minima sem preencher detalhes opcionais.
