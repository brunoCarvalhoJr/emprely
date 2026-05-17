# Spec - Shell fixo, footer e acoes rapidas no menu

## Objetivo

Corrigir a estrutura visual do SaaS para que sidebar e topbar fiquem fixas, melhorar o footer e aproximar as acoes de criacao dos menus correspondentes.

## Requisitos

- Sidebar e topbar nao rolam com o conteudo autenticado.
- Conteudo central deve ser a unica area rolavel no app autenticado.
- Footer deve exibir logo Emprely, direitos centralizados e dois botoes icon-only com tooltip para WhatsApp e e-mail.
- Menu deve remover "Nova proposta" como item proprio.
- Menus Clientes, Servicos/Pacotes e Propostas devem exibir `+` pequeno com tooltip e acao de criacao.

## Aceite

- Clicar no texto do menu navega para a listagem.
- Clicar no `+` cria nova entidade/proposta.
- Layout segue responsivo e sem sobreposicao.
- `pnpm lint:web`, `pnpm build:web` e e2e continuam passando.
