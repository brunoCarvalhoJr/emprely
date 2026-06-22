# Analise - Achados Playwright tema claro/escuro

## Contexto

A bateria Playwright em tema claro e escuro encontrou cinco pontos acionaveis:

- cards de template ilegiveis no tema escuro;
- texto `Proximo` com encoding quebrado na doca mobile;
- botao `Salvar rascunho` apertado na doca mobile;
- identificacao de conta/e-mail truncada na sidebar desktop;
- script QA full fragil para temas e seletores atuais.

## Decisao

Corrigir os problemas visuais diretamente no app web e atualizar o script operacional em `D:\Emprely\Testes\scripts` para aceitar tema, emitir log incremental e melhorar navegacao mobile.

## Escopo

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/spec/2026-06-21-achados-temas-layout-qa.md`
- `D:\Emprely\Testes\scripts\run-qa-full-battery.mjs`

## Aceite

- Cards de template ficam legiveis no tema escuro em desktop e mobile.
- Doca mobile mostra `Proximo` corretamente, com acento quando suportado.
- Na revisao mobile, a acao de rascunho fica legivel sem cortar.
- O menu da conta expoe nome/e-mail completos.
- Script QA full aceita `--theme light|dark`, registra progresso por etapa e melhora navegacao mobile para suporte/menu.
