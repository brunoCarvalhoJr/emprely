# Spec Web - Refino de layout e legibilidade

## User Story

Como usuario do Emprely, quero uma tela de proposta mais organizada e legivel para criar orcamentos rapidamente sem perder a identidade visual da marca.

## Implementacao

- Usar layout de builder em duas colunas: formulario principal e preview lateral compacto.
- Separar formulario em secoes: cliente, conteudo, itens e fechamento.
- Melhorar contraste e spacing de cards, labels, textos auxiliares e botoes.
- Manter o preview visual, mas com peso menor durante criacao.

## Fora de escopo

- Alterar endpoints.
- Alterar regras de cadastro, geracao, envio ou impressao.
- Criar novas rotas.

## Validacao

- `pnpm lint:web`
- `pnpm build:web`
- `pnpm --dir apps/web test:e2e`
