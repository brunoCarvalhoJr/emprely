# Spec Landing - Header mobile com Entrar e Cadastrar

## Origem

- Analise relacionada: `apps/landing/.cursor/analise/2026-06-19-header-mobile-entrar-cadastrar.md`
- Data: 2026-06-19
- Solicitante: usuario

## Objetivo

- Resultado esperado: `Entrar` e `Cadastrar` aparecem na barra superior mobile da landing.
- Problema que resolve: o usuario nao precisa abrir o menu sanduiche para acessar login ou cadastro.
- Area impactada: header/hero da landing V1 externa.

## Escopo

### Incluido

- Adicionar botoes compactos `Entrar` e `Cadastrar` na topbar mobile.
- Remover `Entrar` e CTA de cadastro do menu sanduiche.
- Manter links de navegacao dentro do menu sanduiche.
- Usar `Cadastrar` no CTA de cadastro da navegacao desktop.

### Fora do escopo

- Redesenhar a landing.
- Alterar oferta, preco, hero, SEO, analytics ou fluxo do app.
- Mudar destinos dos links reais.

## Requisitos

- `Entrar` aponta para `APP_LINKS.home`.
- `Cadastrar` aponta para `APP_LINKS.signup`.
- Os botoes devem caber em mobile sem sobrepor logo ou icone de menu.
- O menu mobile deve fechar ao clicar nos links de navegacao.
- O visual deve preservar a identidade Emprely e estados de foco.

## Criterios de aceite

- Em mobile, os dois botoes aparecem no header antes de abrir o menu.
- Ao abrir o menu sanduiche, `Entrar` e `Cadastrar` nao aparecem dentro do drawer.
- Em desktop, a navegacao continua com `Entrar` e CTA de cadastro.
- `npm run check` e `npm run build:static` executam sem erro ou ficam registrados se falharem por ambiente.
