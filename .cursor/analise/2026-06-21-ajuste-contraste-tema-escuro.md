# Analise - Contraste e legibilidade no tema escuro

## Contexto

No app publicado em `app.emprely.com.br`, o tema escuro apresenta textos quase invisiveis em cards do dashboard mobile. O print anexado mostra principalmente:

- chamada "Crie sua primeira proposta profissional em minutos" com texto escuro sobre card escuro;
- titulo "Fluxo guiado para sua primeira proposta" no bloco "Primeiros passos" com contraste insuficiente;
- potencial repeticao do problema em outros pontos que usam utilitarios Tailwind `text-slate-*`.

## Auditoria visual

Foi executada varredura Playwright no ambiente real com usuario de teste, capturando telas mobile em tema claro e escuro para:

- dashboard;
- propostas;
- clientes;
- servicos;
- perfil/conta.

O problema confirmado esta ligado a classes de texto fixas para tema claro (`text-slate-950`, `text-slate-900`, `text-slate-800`, `text-slate-700`) usadas dentro de componentes que mudam o fundo no dark theme.

## Decisao

Corrigir a camada CSS do tema escuro para remapear utilitarios escuros de texto para tokens do design system:

- `text-slate-950`, `text-slate-900`, `text-slate-800` -> `var(--foreground)`;
- `text-slate-700` -> `var(--foreground)` quando usado em componentes interativos/botões;
- preservar cores semanticas especificas, como erro, sucesso, aviso e acento.

Essa abordagem corrige o dashboard e reduz risco de regressao em outras telas sem alterar contratos, dados ou estrutura de componentes.

