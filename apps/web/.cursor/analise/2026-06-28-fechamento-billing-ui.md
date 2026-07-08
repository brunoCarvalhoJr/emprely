# Analise - fechamento billing UI

## Contexto

O backend passa a expor ciclos mensal e anual e remove reativacao local. A tela de Plano precisa permitir escolher o ciclo correto antes do checkout e manter metodos inativos sem acao.

## Decisoes

- Usar controle segmentado mensal/anual na tela de Plano.
- Enviar `ciclo` no checkout.
- Exibir preco e periodicidade conforme ciclo selecionado.
- Ajustar texto para Pix recorrente por cobranca hospedada Asaas, nao Pix Automatico.
- Remover helper de API de reativacao.

## Fora do escopo

- Tokenizacao de cartao.
- Pix Automatico bancario.
