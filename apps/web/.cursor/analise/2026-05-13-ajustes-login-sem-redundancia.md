# Analise Web - Ajustes Login Sem Redundancia

## Arquivos Afetados

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`

## Mudancas Planejadas

- Substituir `auth-fluid-ribbons`, `auth-orcamento-preview` e `auth-proof-strip` por um painel de marca simples.
- Usar `emprelyFaviconSrc` em destaque no painel visual.
- Trocar chip `Emprely Orcamentos` por `Acesso seguro`.
- Ajustar textos para serem curtos e de login.
- Aplicar `height: 100dvh` e `overflow: hidden` no layout publico.
- Aplicar `overflow-y: auto` no painel do formulario.

## Validacoes

- Lint.
- Build.
- E2E.
- Screenshot desktop/mobile e checagem de scroll.
