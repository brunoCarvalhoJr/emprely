# Spec Web - Quantidade inteira nos itens da proposta

## Visao geral

O campo `Qtd` dos itens da proposta deve aceitar apenas numeros inteiros positivos.

## Regras

- Valor minimo: `1`.
- Decimais como `1,5` ou `1.5` devem ser rejeitados.
- Letras, sinal negativo, ponto, virgula e notacao exponencial devem ser bloqueados no input.
- A validacao do formulario deve impedir avancar/salvar quando a quantidade nao for inteira.

## Criterios de aceite

- O input exibe step inteiro.
- O usuario nao consegue digitar ou colar decimal no campo.
- O schema exibe mensagem clara quando o valor nao for inteiro.
