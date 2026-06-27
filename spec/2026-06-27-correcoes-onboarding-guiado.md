# Spec - Correcoes do onboarding guiado

## Visao geral

Corrigir as lacunas de comportamento do onboarding guiado para aproximar a
implementacao atual da spec de 2026-06-19, sem ampliar o escopo para novos
modulos.

## Escopo

Inclui:

- Abrir a modal de onboarding automaticamente quando a API retornar
  `deveAbrirAutomaticamente`.
- Mostrar lembrete apos pulo quando a API retornar `deveLembrarAposPular`.
- Impedir que o tour automatico substitua ou sobreponha a modal.
- Melhorar a modal para mostrar etapas de wizard, progresso e status.
- Deixar claro que `Lembrar depois` adia todo o onboarding.
- Permitir limpar `propostaRascunhoId` salvo.

Fora do escopo:

- Reescrever todo o fluxo de proposta.
- Criar componentes novos para cada formulario de wizard.
- Alterar banco ou criar migration.
- Alterar regras de trial/plano.

## Fluxo ponta a ponta

1. Usuario autenticado carrega o dashboard.
2. Webapp consulta `/api/onboarding`.
3. Se `deveAbrirAutomaticamente=true`, abre a modal do guia inicial em tela
   cheia.
4. Se o usuario escolher `Lembrar depois`, a API registra `Pulou` e o texto
   deixa claro que todo o onboarding sera adiado.
5. Em novo carregamento da sessao, se `deveLembrarAposPular=true`, o webapp
   mostra a modal novamente uma vez.
6. Usuario pode iniciar conta, iniciar primeira proposta ou abrir o tour.
7. Tour automatico so inicia quando a modal nao esta aberta.

## Requisitos

- Abertura automatica deve acontecer no maximo uma vez por chave de estado em
  uma sessao do app.
- Lembrete apos pulo deve acontecer no maximo uma vez por chave de estado em
  uma sessao do app.
- O tour deve continuar sendo pulavel e persistir pulo/conclusao.
- A modal deve mostrar etapas das jornadas com status visual.
- O PATCH de onboarding deve conseguir limpar `propostaRascunhoId`.

## Regras de negocio

- Pular significa adiar todo o onboarding, nao apenas a aba atual.
- Conclusoes derivadas por dados reais continuam prevalecendo.
- O onboarding segue sem bloquear uso do sistema.

## Impactos por projeto

- API: contrato de update e entidade de onboarding.
- Web: `App.tsx` e tipos de onboarding.
- Mobile: modal deve continuar responsiva.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: sem impacto.

## Criterios de aceite

- Conta nova abre a modal do guia inicial automaticamente.
- Usuario que pulou recebe lembrete automatico no proximo carregamento.
- Tour automatico nao aparece por cima da modal.
- Modal comunica etapas de conta e primeira proposta.
- `Lembrar depois` informa que adia todo o onboarding.
- API aceita limpar `propostaRascunhoId`.
- Lint web e testes da API passam.

## Estrategia de implementacao

- Adicionar flag opcional `LimparPropostaRascunhoId` no contrato API.
- Ajustar entidade para limpar rascunho quando solicitado.
- Usar refs no frontend para controlar abertura automatica por sessao.
- Melhorar a estrutura visual da modal com etapas e progresso.
- Atualizar tipos TypeScript.

## Testes

- `pnpm --dir apps/web lint`
- `dotnet test apps/api/Emprely.sln`
- Quando possivel, validar manualmente login novo, pulo, lembrete e tour.
