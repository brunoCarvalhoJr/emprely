# Analise - Mascara de reais nos campos de valor

## Ideia

Aplicar mascara monetaria em reais nos campos editaveis de valor do sistema.

## Contexto

Os campos de preco do servico, valor unitario dos itens da proposta e desconto da proposta usam inputs numericos simples. O pedido e exibir valores no formato brasileiro com prefixo `R$`, como `R$ 200,00`, `R$ 10,15` e `R$ 1,00`.

## Decisao

- Criar um campo reutilizavel `CampoMoedaReal`.
- Exibir valores com `Intl.NumberFormat` em BRL.
- Converter o texto mascarado de volta para numero antes de salvar no React Hook Form.
- Aplicar a mascara em:
  - preco do servico;
  - valor unitario de item da proposta;
  - desconto da proposta.
- Garantir que o desconto use exatamente o mesmo componente e a mesma mascara
  do campo Valor, pois ambos representam valores em reais.

## Duvidas

Nao ha duvidas bloqueantes. Campos de quantidade e validade continuam numericos simples porque nao sao valores monetarios.
