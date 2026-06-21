# Spec: onboarding inicial com tour spotlight

## Objetivo

Substituir a abertura automatica do modal grande por um tour automatico com overlay escuro e spotlight, garantindo uma primeira orientacao clara no login inicial e para usuarios que ainda nao receberam as instrucoes. O tour deve guiar primeiro a configuracao da conta e depois a criacao do primeiro orcamento completo.

## Escopo

- App web autenticado.
- Estado de onboarding existente em `/api/onboarding`.
- Tour inicial do dashboard usando React Joyride.
- Ajuste responsivo do modal de guia inicial.

## Comportamento esperado

1. Ao carregar o app autenticado, se `onboarding.tour.status` for `NaoIniciado` ou `EmAndamento`, o app deve navegar para o dashboard e iniciar o tour.
2. Ao iniciar pela primeira vez, o app deve registrar evento `TourExibido`.
3. O tour deve escurecer a tela e destacar somente o alvo da etapa.
4. O tour deve navegar automaticamente para `Configuracoes` para explicar dados da conta e logomarca.
5. O tour deve navegar automaticamente para `Personalizacao` para explicar template, cores e formato de envio.
6. O tour deve voltar ao dashboard para explicar cliente, servico e nova proposta.
7. O usuario pode pular ou concluir o tour.
8. Ao pular, registrar `TourPulou`.
9. Ao concluir, registrar `TourConcluiu`.
10. O modal de guia inicial deve continuar disponivel manualmente, mas nao deve cortar em mobile.

## Passos do tour

- Painel inicial.
- Dados da conta.
- Logomarca.
- Template padrao.
- Cores e formato de envio.
- Cliente.
- Servico.
- Gerar primeiro orcamento.

## Fora de escopo

- Criar biblioteca propria de onboarding.
- Alterar endpoints de backend.
- Alterar fluxo de cadastro/login.
- Criar tours contextuais persistentes por tela alem do fluxo inicial.

## Validacao tecnica

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
