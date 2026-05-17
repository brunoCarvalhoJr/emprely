# Analise Web - Refatoracao Login Prototipo Emprely

## Arquivos Afetados

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`

## Comportamento Atual

A tela publica possui um card central simples com bloco visual no topo e formulario abaixo. O usuario solicitou um layout mais fiel ao print, com painel lateral azul no desktop e versao mobile empilhada.

## Implementacao Planejada

- Ajustar `AuthContent` para separar `auth-brand-panel` e `auth-form-panel`.
- Usar a logo Emprely no painel de marca.
- Criar divisoria organica branca via pseudo-elementos CSS.
- Usar classes dedicadas para formulario, tabs, botoes e textos auxiliares.
- Validar desktop e mobile com Playwright/headless.

## Validacoes

- Lint.
- Build.
- Checagem DOM/CSS em desktop e mobile.
