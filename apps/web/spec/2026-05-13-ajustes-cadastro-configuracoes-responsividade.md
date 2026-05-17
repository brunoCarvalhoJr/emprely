# Spec web - ajustes de cadastro, configuracoes e responsividade

## Requisitos

- Campo "Telefone" obrigatorio no fluxo "Testar 7 dias".
- Campos de configuracao preenchidos com dados iniciais da conta.
- E-mail de configuracao em modo somente leitura.
- Layout de configuracoes mais compacto na coluna direita.
- Dropdown no bloco inferior do menu com item "Configuracoes".
- Header autenticado sem workspace central e sem marca duplicada.
- Ausencia de scroll horizontal em desktop, desktop estreito e mobile.

## Criterios de aceite

- Usuario consegue criar teste informando nome, e-mail, telefone, senha e empresa.
- Apos entrar, Configuracoes mostra empresa, e-mail e telefone preenchidos.
- O e-mail nao pode ser alterado pelo input de configuracoes.
- Configuracoes fica visualmente compacta e responsiva.
- O menu principal mostra Dashboard, Clientes, Servicos/Pacotes e Propostas; Configuracoes fica no dropdown da empresa.
- A barra superior mostra somente o botao "Sair" na extrema direita.
- Clicar fora do menu da empresa fecha o dropdown/dropup.
- A seta do botao da empresa indica abertura para cima.
- O usuario alterna entre tema claro e escuro pelo mesmo menu.
- O tema escuro nao deve exibir cards brancos com textos quase invisiveis.
- Dashboard, propostas, preview, tabelas, formularios e alertas devem manter contraste adequado no tema escuro.
- Ao editar ou preencher um campo, a superficie deve mudar de forma leve sem inverter para branco/preto destoante.
- Na etapa "Itens e servicos", o seletor e os botoes "Adicionar" e "Livre" ficam alinhados em desktop.
- Lint, build e E2E web passam.
