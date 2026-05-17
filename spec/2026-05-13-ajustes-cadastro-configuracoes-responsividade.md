# Spec - ajustes de cadastro, configuracoes e responsividade

## Escopo

Aplicar ajustes no cadastro publico, configuracoes da conta, menu lateral, barra superior e responsividade geral do app web, com alteracoes de contrato/API quando necessario.

## Requisitos funcionais

- O fluxo "Testar 7 dias" deve exigir telefone.
- O payload de registro deve enviar `telefone`.
- Ao criar uma conta, o perfil deve nascer preenchido com:
  - nome comercial igual ao nome da empresa;
  - e-mail de contato igual ao e-mail profissional cadastrado;
  - telefone de contato igual ao telefone informado.
- Em configuracoes, o e-mail deve aparecer preenchido e nao pode ser editado.
- O nome da empresa e telefone cadastrados devem aparecer preenchidos em configuracoes.
- A coluna direita de configuracoes deve ser compacta para reduzir scroll vertical:
  - plano, status e trial em grade compacta;
  - nova senha e confirmar nova senha na mesma linha em desktop;
  - senha atual em linha propria.
- O menu lateral deve mover "Configuracoes" para dentro de um dropdown no bloco inferior da empresa.
- A barra superior autenticada deve remover o bloco "Workspace comercial" e a assinatura de marca duplicada, mantendo apenas "Sair" na extrema direita.
- O dropdown/dropup da conta deve fechar quando o usuario clicar fora do menu.
- A seta do botao da conta deve indicar que o menu abre para cima.
- O menu da conta deve oferecer alternancia entre tema claro e tema escuro.
- No tema escuro, dashboard, cards, metricas, formularios, preview de proposta, tabelas, dropdowns e alertas nao devem manter fundos brancos com textos claros.
- O tema escuro deve usar superficies escuras consistentes, contraste adequado e estados de hover/foco visiveis.
- Campos focados, editados ou com autofill devem ter apenas diferenca sutil de superficie, respeitando tema claro e escuro.
- Na criacao de proposta, o seletor de servico e os botoes "Adicionar" e "Livre" devem ficar alinhados na mesma linha/base em desktop.

## Requisitos responsivos

- Nao deve haver scroll horizontal em desktop, desktop estreito ou mobile.
- Tabelas/listas que precisarem de largura devem rolar dentro do proprio bloco, sem gerar overflow da pagina.
- O menu lateral deve se adaptar em telas menores sem comprimir a area principal.
- A tela de cadastro continua cabendo no desktop sem scroll vertical indesejado.

## Validacao

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `pnpm --dir apps/web test:e2e`
- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln`
- QA visual em desktop e mobile com Playwright.
