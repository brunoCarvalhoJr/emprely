# Spec Web - Shell fixo, footer e acoes no menu

## User Story

Como usuario do SaaS, quero que a navegacao fique fixa e que as acoes de criacao fiquem perto do menu correspondente para trabalhar mais rapido sem perder contexto.

## Implementacao

- `app-frame-auth` deve travar a altura em `100vh`.
- `app-content` deve ser a area com scroll vertical.
- Sidebar/topbar devem ficar fora do fluxo de rolagem do conteudo.
- `FooterAplicacao` deve usar logo Emprely e botoes de suporte com tooltip.
- Menu deve usar `+` em Clientes, Servicos/Pacotes e Propostas.

## Criterios

- Sem item separado "Nova proposta" no menu.
- `+` em Clientes abre novo cliente.
- `+` em Servicos/Pacotes abre novo servico.
- `+` em Propostas abre nova proposta.
- Validacoes web passam.
