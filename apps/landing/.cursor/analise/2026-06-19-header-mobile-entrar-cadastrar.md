# Analise Landing - Header mobile com Entrar e Cadastrar

## Contexto

- Tarefa solicitada: adicionar os botoes `Entrar` e `Cadastrar` na barra superior mobile da landing e remover essas acoes de dentro do menu sanduiche.
- Objetivo da mudanca: deixar acesso e cadastro visiveis sem depender de abrir o menu.
- Landing alvo: V1 externa em `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp`, referenciada por `apps/landing/package.json`.
- Secao impactada: hero/header.

## Fontes consultadas

- `apps/landing/AGENTS.md`: confirma que a landing V1 atual e externa ao monorepo.
- `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\AGENTS.md`.
- `.cursor/rules/emprely-project.mdc` da landing externa.
- `docs/prd-landing-page.md` da landing externa.
- Codigo analisado: `src/components/sections/hero-section.tsx` e `src/content/landing-content.ts`.

## Decisao

- A barra superior deve exibir `Entrar` apontando para `https://app.emprely.com.br`.
- A barra superior deve exibir `Cadastrar` apontando para `https://app.emprely.com.br/?auth=cadastro`.
- O drawer mobile deve manter apenas os links de navegacao/contato.
- No desktop, a acao de cadastro tambem passa a usar o rotulo `Cadastrar` para manter consistencia.

## Impacto

- Produto/conversao: reduz friccao no mobile para login e cadastro.
- UI: exige botoes compactos para nao estourar em telas pequenas.
- SEO/performance: sem impacto estrutural relevante.
- Acessibilidade: botoes continuam como links acessiveis, com foco visivel.
