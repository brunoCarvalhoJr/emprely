# Analise - Reset de tour inicial e controle administrativo

## Contexto

O tour guiado do app Emprely e persistido em `onboarding_usuarios`, por usuario e conta. O frontend consulta `/api/onboarding` no login e inicia o tour automaticamente quando `tour.status` esta como `NaoIniciado` ou `EmAndamento`.

O problema relatado foi: ao logar, o tour nao apareceu, mesmo com expectativa de experiencia de primeiro login. A causa provavel e que usuarios ja tinham `StatusTour` como `Concluido` ou `Pulado` no banco, o que bloqueia a reabertura automatica.

## Estado atual

- `OnboardingUsuario` possui campos de tour:
  - `StatusTour`
  - `TourExibidoAt`
  - `TourPuladoAt`
  - `TourConcluidoAt`
- O frontend abre o tour automaticamente quando `onboarding.tour.status` esta `NaoIniciado` ou `EmAndamento`.
- O painel administrativo nao tinha acao para reabrir o tour de um usuario especifico.
- O reset global precisava ser feito diretamente no banco para todos os usuarios atuais.

## Decisao

Implementar reset administrativo por usuario, sem criar nova tabela nem alterar contrato de onboarding do usuario final.

O reset deve:

- alterar apenas o estado do tour;
- manter etapas de configuracao de conta e primeira proposta intactas;
- limpar os timestamps do tour;
- criar registro de onboarding quando o usuario ainda tem conta, mas nunca carregou `/api/onboarding`;
- exigir Super Admin e motivo administrativo;
- registrar auditoria.

## Fora de escopo

- Apagar usuarios, clientes, servicos, propostas ou contas.
- Resetar senha, email confirmado, plano, trial ou dados comerciais.
- Reabrir automaticamente o modal de primeiros passos se o tour estiver concluido por dados de conta/proposta; o foco aqui e o tour guiado visual.

## Riscos

- Usuarios sem conta nao possuem contexto suficiente para criar onboarding. Nesse caso, o endpoint valida usuario, registra auditoria e nao cria onboarding.
- O frontend ainda depende do cache local de sessao do browser; para teste limpo, o usuario deve recarregar a aplicacao apos reset.

## Aceite

- Dado um usuario com tour concluido, quando um Super Admin clicar em "Resetar tour", o proximo `/api/onboarding` deve retornar `tour.status = NaoIniciado`.
- Ao primeiro login/reload apos o reset, o tour deve iniciar automaticamente.
- A acao deve aparecer no painel administrativo no detalhe de usuario.
- A acao deve exigir motivo e gravar auditoria `TourUsuarioResetado`.
- O reset em banco deve ser executado para todos os usuarios existentes.
