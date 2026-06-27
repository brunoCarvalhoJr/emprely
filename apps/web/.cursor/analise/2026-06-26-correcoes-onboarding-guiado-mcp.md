# Analise - correcoes do onboarding guiado validado por MCP

## Contexto

Validacao manual assistida pelo MCP `chrome-devtools` em `https://app.emprely.com.br`
com usuario comum de teste autenticado identificou falhas no guia inicial.

O estado observado na conta de teste foi:

- `configuracaoConta.status = NaoIniciado`
- `primeiraProposta.status = Concluido`
- `tour.status = EmAndamento`, depois `Concluido`
- `deveAbrirAutomaticamente = true`

## Objetivo

Corrigir a experiencia do tour guiado para que o usuario consiga iniciar,
voltar, concluir ou pular o guia sem perder passos nem ficar preso em modal
reaberta automaticamente na mesma sessao.

## Projetos impactados

- Web: `apps/web`
- API: sem alteracao
- Mobile: sem alteracao
- Landing: sem alteracao
- Packages: sem alteracao
- Infra: sem alteracao

## Fluxo atual

1. A modal `Conheca a Emprely antes de comecar` abre corretamente.
2. Ao clicar em `Ver tour guiado`, o Joyride pode iniciar no passo 7/11,
   diretamente na tela `Perfil da conta`.
3. Clicar em `Voltar` nesse passo fecha o tour em vez de navegar para o passo
   anterior.
4. Ao clicar em `Concluir`, o backend marca o tour como concluido, mas a modal
   abre novamente porque a configuracao da conta segue pendente e
   `deveAbrirAutomaticamente` permanece verdadeiro.

## Fluxo proposto

1. `Ver tour guiado` sempre inicia no passo 1, no Dashboard, com o mapa dos
   menus.
2. A navegacao `Proximo` e `Voltar` deve mover o indice do Joyride de forma
   controlada, inclusive entre views diferentes.
3. `Concluir` e `Pular` devem encerrar o Joyride e bloquear a reabertura
   automatica da modal na mesma sessao.
4. A modal ainda pode abrir em sessoes futuras quando a configuracao da conta
   continuar pendente.

## Regras de negocio

- Concluir o tour nao deve marcar a configuracao da conta como concluida.
- O tour concluido/pulado deve apenas evitar incomodo repetido na mesma sessao.
- A abertura automatica da modal continua respeitando os flags retornados pela
  API.

## Impactos tecnicos

- Ajustar refs de sessao para lembrar quando a modal foi dispensada apos
  iniciar/concluir/pular tour.
- Evitar que `tour.status = EmAndamento` retome no meio quando o usuario aciona
  explicitamente `Ver tour guiado`.
- Ajustar callback do React Joyride para tratar `prev` sem encerrar no limite
  de view.

## Riscos

- O Joyride pode emitir eventos em ordem diferente dependendo da troca de view.
  Mitigacao: calcular proximo indice explicitamente e manter `stepIndex`
  controlado.
- Bloquear reabertura automatico demais poderia esconder onboarding em nova
  sessao. Mitigacao: o bloqueio fica em `useRef`, valido apenas na sessao atual
  do app.

## Duvidas

- Sem duvidas pendentes para esta correcao. A demanda e correção direta dos
  achados da validacao MCP.
