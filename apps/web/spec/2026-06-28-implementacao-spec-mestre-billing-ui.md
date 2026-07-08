# Spec - UI de billing conforme spec mestre

## Visao geral

Alinhar a UI do app ao comportamento definido na spec mestre.

## Requisitos

- Mostrar planos retornados pela API.
- Pix deve ser o unico metodo ativo.
- Cartao deve aparecer como futuro/inativo, sem iniciar checkout.
- Pagamento pendente deve manter link para pagar.
- Estados de assinatura devem ter mensagens claras.
- Cancelamento deve ser apresentado como cancelamento da renovacao.

## Testes

- Lint/build do web devem passar.
- A tela nao deve conter promessa de cartao ativo.
- A tela deve aceitar precos vindos do catalogo da API.
