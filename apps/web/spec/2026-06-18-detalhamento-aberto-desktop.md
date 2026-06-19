# Spec - Detalhamento aberto no desktop

## Visao geral

A etapa 5 da nova proposta deve apresentar os blocos de detalhamento comercial abertos por padrao no desktop para reduzir cliques e deixar os campos importantes visiveis.

## Escopo

- Abrir por padrao o bloco "Desconto e pagamento" em desktop.
- Abrir por padrao o bloco "Escopo, cronograma e beneficios" em desktop.
- Manter ambos fechados por padrao no mobile.
- Preservar a acao manual de abrir/fechar.

## Fora do escopo

- Reorganizar os campos da etapa.
- Alterar validacoes, textos ou modelo de dados.
- Alterar comportamento de outras etapas.

## Criterios de aceite

- Em viewport desktop, a etapa 5 mostra os dois blocos abertos ao entrar.
- Em viewport mobile, a etapa 5 continua compacta com blocos fechados.
- O usuario consegue fechar e abrir cada bloco normalmente.
- Lint e build do web passam.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `npm.cmd run build` em `apps/web`
