# Analise - ajustes de cadastro, configuracoes e responsividade

## Contexto

Demanda para corrigir friccoes no fluxo autenticado e no cadastro publico do Emprely Orcamentos. O cadastro de teste deve coletar telefone obrigatorio, os dados iniciais devem aparecer em configuracoes, o e-mail nao deve ser editavel, a tela de configuracoes deve ficar mais compacta e a navegacao deve remover redundancias no menu e na barra superior.

## Objetivos

- Exigir telefone no fluxo "Testar 7 dias".
- Criar o perfil da conta ja preenchido com nome da empresa, e-mail e telefone informados no cadastro.
- Mostrar os dados de cadastro na tela de configuracoes, mantendo o e-mail bloqueado para edicao.
- Reduzir altura da coluna direita de configuracoes para evitar scroll desnecessario.
- Remover scroll horizontal e melhorar comportamento responsivo em desktop estreito e mobile.
- Transformar o bloco inferior do menu em dropdown de conta e mover "Configuracoes" para dentro dele.
- Remover redundancia da barra superior autenticada, mantendo apenas o botao "Sair" na extrema direita.

## Decisoes

- O telefone passa a fazer parte do contrato de registro no web e na API.
- No backend, o registro cria `PerfilConta` com `NomeConta`, `Email` e `Telefone`.
- Na configuracao, o e-mail aparece como campo somente leitura para deixar claro que e o e-mail de acesso.
- A coluna direita de configuracoes passa a usar cards compactos e grids responsivos para plano, status, trial e campos de senha.
- O menu principal deixa de listar configuracoes; a acao fica no dropdown do bloco da empresa.
- A barra superior autenticada deixa de renderizar workspace central e assinatura de marca duplicada.

## Riscos

- Alterar o contrato de registro exige atualizar testes de API e E2E.
- O novo campo de telefone no cadastro pode aumentar altura do formulario; precisa validar ausencia de scroll em desktop.
- Dropdown do menu precisa funcionar por teclado e sem quebrar mobile.

## Complemento - menu da conta e tema

- O dropdown/dropup da conta deve fechar ao clicar fora dele para evitar menu preso na tela.
- Como o menu abre para cima no desktop, a seta deve comunicar dropup.
- O mesmo menu deve concentrar configuracoes e troca de tema claro/escuro, com estado visual claro e persistencia local no navegador.

## Complemento - refinamento do tema escuro

- Os prints mostram que o tema escuro ainda mistura shell escuro com cards claros e textos muito claros, gerando baixa legibilidade.
- A causa principal sao fundos e gradientes hardcoded em branco nas areas de dashboard, metricas, formularios de proposta, preview, tabelas e alertas.
- A correcao deve manter o visual SaaS premium, com superficies escuras consistentes, bordas discretas, textos legiveis e destaque suficiente nos CTAs.

## Complemento - campos editados e alinhamento de proposta

- Campos em edicao ou preenchidos pelo navegador nao devem virar branco puro no tema escuro nem preto pesado no tema claro; a diferenca visual deve ser sutil e coerente com o tema.
- O alinhamento da area "Adicionar do catalogo" deve manter select, botao "Adicionar" e botao "Livre" na mesma base visual em desktop, sem desalinhamento vertical.
