# Analise - Refatoracao SaaS com ui-ux-pro-max

## Contexto

O SaaS Emprely concentra o frontend em React/Vite no arquivo `apps/web/src/App.tsx`,
com estilos em `apps/web/src/styles.css`. A experiencia autenticada possui seis
areas principais: Dashboard, Clientes, Servicos/Pacotes, Propostas, Conta e
Personalizacao.

O usuario pediu uma refatoracao visual profissional, clean, amigavel e facil de
usar, usando a skill global `ui-ux-pro-max`. Tambem pediu auditoria por pagina
via subagentes antes da implementacao.

## Sintese das auditorias

### Dashboard

- O dashboard exibe dados zerados durante loading/erro, sem distinguir estado
  real de carregamento.
- Algumas acoes nao correspondem exatamente ao texto, como "Meus servicos"
  abrindo criacao.
- A tabela de propostas recentes perde contexto no mobile quando o cabecalho e
  ocultado.
- O estado vazio de propostas recentes e pouco orientado.
- A pagina tem visual mais promocional que operacional.

### Clientes

- A tabela mobile perde rotulos das colunas.
- Alvos de toque de acoes, WhatsApp e paginacao estao abaixo de 44px.
- Loading e erro sao pouco acionaveis.
- WhatsApp desabilitado precisa de label acessivel correto.
- A visualizacao do cliente deve expor contato por WhatsApp.

### Servicos

- A tabela mobile perde rotulos das colunas.
- Loading e erro precisam de skeleton/retry.
- Campo de preco deve parecer moeda, nao numero generico.
- Busca precisa de limpar e empty state mais util.
- Empty state inicial deve orientar o cadastro de servicos reutilizaveis.

### Propostas

- Exportacao/compartilhamento esta fragmentada entre listagem e editor.
- Modais precisam de melhor foco/teclado e fechamento consistente.
- Z-index precisa de escala previsivel.
- Editor e listagem ainda dependem de scroll horizontal em mobile.
- Campos financeiros e validade precisam de prefixo/sufixo visual.

### Conta

- Campo "E-mail de acesso" esta ambiguo com `emailContato`.
- Plano e seguranca estao no mesmo card, prejudicando leitura.
- Feedback de erro/sucesso deve ser anunciado por leitores de tela.
- Upload de logo precisa de erro mais proximo da area de upload.
- Campos somente leitura devem parecer bloqueados.

### Personalizacao

- Preview deveria ser mais central e acessivel.
- Escolha de template por select reduz confianca visual.
- Cores de templates precisam de feedback visual e texto mais claro.
- Botao restaurar template precisa de microcopy menos ambigua.
- Modal/miniaturas precisam de melhor responsividade e toque.

## Regras de UX da skill aplicadas

- Alvos de toque devem ter pelo menos 44x44px.
- Estados de loading, erro, vazio e sucesso devem ser claros e proximos do
  contexto.
- Modais e menus devem respeitar foco, teclado e escala de z-index previsivel.
- Tabelas precisam manter contexto no mobile.
- Interface SaaS operacional deve priorizar leitura, consistencia, hierarquia e
  baixa ornamentacao.
- Formularios precisam de labels, `aria-invalid`, `aria-describedby`,
  autocomplete/inputmode quando aplicavel e feedback acessivel.

## Decisoes de escopo

- A refatoracao sera aplicada apenas no `apps/web`.
- Nao alterar contratos de API ou regras de negocio.
- Manter a arquitetura atual em `App.tsx` e `styles.css` para reduzir risco.
- Priorizar melhorias transversais que beneficiem todas as paginas.
- Evitar reescrever templates de proposta neste ciclo; apenas melhorar
  selecao, preview e responsividade onde houver baixo risco.

## Riscos

- O arquivo `App.tsx` e grande, entao mudancas muito amplas aumentam risco de
  regressao.
- Ha muitas alteracoes pre-existentes no workspace; nao devem ser revertidas.
- Checkpoint do workspace inteiro falhou porque arquivos `.vs` da API estavam
  bloqueados; foi criado checkpoint scoped em `apps/web`.

## Impactos esperados

- Melhor leitura no mobile por meio de tabelas com rotulos por celula.
- Acoes mais confortaveis para toque.
- Feedback acessivel e mais profissional em loading/erro/sucesso.
- Dashboard mais honesto durante carregamento e falha.
- Visual mais clean por ajustes de shell, cards, tabelas e botoes.
