# Spec - Ajustes Login Sem Redundancia

## Escopo

Corrigir a tela publica de login/cadastro.

## Requisitos

- Usar o favicon/simbolo real da Emprely como elemento visual principal.
- Nao repetir a logo no topo e no corpo.
- Evitar repeticao de `Orcamentos`.
- Remover o preview de proposta visual.
- Evitar scroll da pagina publica.
- Permitir scroll apenas dentro do painel de formulario quando a altura for insuficiente.
- Refinar copy e tamanhos de texto.
- Preservar Cadastro/Login, campos, validacoes e mutations.

## Aceite

- Pagina publica sem scroll em desktop e mobile padrao.
- Sem preview de proposta.
- Uma unica marca/simbolo principal.
- Campo e botao continuam acessiveis por labels usados no E2E.
- `pnpm --dir apps/web lint`, `build` e `test:e2e` passam.
