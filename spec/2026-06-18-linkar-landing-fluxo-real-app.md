# Spec: linkar landing ao fluxo real do app

## Origem

- Analise relacionada: `.cursor/analise/2026-06-18-linkar-landing-fluxo-real-app.md`
- Data: 2026-06-18
- Solicitante: usuario

## Objetivo

- Resultado esperado: a landing pode apontar diretamente para o cadastro real e para o suporte publico do app.
- Problema que resolve: CTAs da landing levavam para formulario interno, enquanto o app ja possui fluxo publicado.
- Area impactada: inicializacao publica do app.

## Escopo

### Incluido

- Reconhecer `?auth=cadastro` em `apps/web/src/App.tsx`.
- Preservar comportamento atual de login, confirmacao de email, alteracao de email e reset de senha.

### Fora do escopo

- Criar nova rota SPA.
- Alterar backend.
- Remover formulario publico do app.
- Mudar identidade visual ou UX do app autenticado.

## Requisitos funcionais

- `https://app.emprely.com.br/?auth=cadastro` deve abrir o painel publico na aba de cadastro/teste.
- `https://app.emprely.com.br/` deve continuar abrindo login por padrao.
- `auth=confirm-email`, `auth=reset-password` e `auth=confirm-change-email` devem manter prioridade.
- `/suporte` deve continuar renderizando `ContatoPublicoContent`.

## Arquivos previstos

- `apps/web/src/App.tsx`

## Criterios de aceite

- Build/lint do webapp passam.
- A mudanca e pequena, aditiva e preserva os fluxos existentes.
- A landing consegue usar URLs publicas reais do app.

## Plano

1. Atualizar `getAuthModeInicial()`.
2. Validar com typecheck/lint/build aplicavel.
3. Publicar webapp caso o build passe.
