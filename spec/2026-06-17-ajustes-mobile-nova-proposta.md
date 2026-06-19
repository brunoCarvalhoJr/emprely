# Spec - Ajustes mobile do fluxo de nova proposta

## Visao geral

Melhorar a usabilidade mobile do cadastro de nova proposta, transformando o editor em um assistente focado por etapa.

## Escopo

Inclui:

- Trocar stepper horizontal mobile por resumo compacto com progresso.
- Criar lista vertical expansivel de etapas no mobile.
- Remover a barra inferior recolhivel no mobile.
- Manter acoes de salvar e preview acessiveis como secundarias.
- Ajustar espacamento e cards do formulario para reduzir poluicao visual.

Fora do escopo:

- Alteracoes de API.
- Alteracoes de templates/PDF.
- Alteracoes de regras de permissao/plano.

## Requisitos

- Desktop deve preservar a experiencia atual.
- Mobile deve exibir uma acao primaria clara por etapa.
- Etapas bloqueadas devem continuar desabilitadas.
- A revisao deve continuar permitindo visualizar, salvar rascunho e gerar proposta.

## Criterios de aceite

- Mobile nao mostra mais botao `Recolher` no rodape da proposta.
- Mobile mostra `Etapa X de Y`, nome da etapa e progresso.
- `Ver etapas` expande/recolhe a lista vertical de etapas.
- A barra de acoes gerais nao compete com `Proximo`.
- Build e lint passam.

## Testes

- `pnpm.cmd --dir apps/web lint`
- `scripts/build-web-beta.ps1`
- Teste visual/automatizado em viewport 390px.

