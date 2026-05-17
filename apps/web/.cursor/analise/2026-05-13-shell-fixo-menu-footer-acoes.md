# Analise Web - Shell fixo e menu com acoes rapidas

## Arquivos afetados

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`

## Ajustes planejados

- Ajustar `navegacaoPrincipal` para remover o item separado de nova proposta.
- Incluir metadados de acao rapida nos itens Clientes, Servicos/Pacotes e Propostas.
- Renderizar a linha do menu com um botao de navegacao e um botao pequeno `+`.
- Refatorar `FooterAplicacao` para logo + copyright centralizado + botoes icon-only.
- Ajustar CSS do shell autenticado para scroll interno no conteudo.

## Validacao

- Lint, build e e2e do web.
- Verificacao de portas ao final para nao deixar dev server rodando.
