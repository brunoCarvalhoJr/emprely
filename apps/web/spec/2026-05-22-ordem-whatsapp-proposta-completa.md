# Spec Web - Ordem da proposta completa no WhatsApp

## Visao geral

Na mensagem `Proposta completa em texto`, os valores finais devem aparecer somente no fechamento da proposta.

## Regras

- A mensagem deve iniciar com saudacao, titulo da proposta e identificacao de quem enviou.
- Depois devem aparecer mensagem inicial, dados da proposta, itens e listas comerciais.
- `Condicoes de pagamento` deve ficar perto do fechamento.
- `Subtotal`, `Desconto` e `Total final` devem aparecer no final da mensagem.
- `Total final` deve ser a ultima linha da proposta completa.

## Criterios de aceite

- O valor final da proposta nao aparece antes do escopo/listas/observacoes.
- O desconto, quando existir, aparece no resumo financeiro final.
- A opcao de mensagem curta com anexo continua inalterada.
- `pnpm --dir apps/web lint` e `pnpm --dir apps/web build` devem passar.
