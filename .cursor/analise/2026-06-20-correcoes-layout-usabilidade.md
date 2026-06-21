# Analise - correcoes de layout e usabilidade

## Contexto

O relatorio `docs/testing/resultados/2026-06-20-relatorio-layout-usabilidade.md` apontou riscos de usabilidade principalmente no mobile: bottom nav cobrindo acoes de formulario, dashboard com excesso de prioridade visual, ambiguidade no drawer e alvos de toque menores que 44px.

## Escopo desta correcao

- Corrigir espaco inferior mobile para a bottom nav nao cobrir acoes.
- Melhorar rotulos do drawer mobile para separar criacao de navegacao.
- Aumentar area clicavel de controles pequenos recorrentes.
- Escurecer textos de acento usados como labels informativos.
- Compactar formularios mobile sem reduzir alvos de toque.
- Adicionar title na conta da sidebar para nome/e-mail truncados.

## Fora de escopo

- Redesenhar toda a tela de personalizacao em abas.
- Refatorar arquitetura de `App.tsx`.
- Criar nova bateria visual completa antes de validar build/lint.
