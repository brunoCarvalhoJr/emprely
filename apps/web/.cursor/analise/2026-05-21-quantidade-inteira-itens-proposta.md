# Analise Web - Quantidade inteira nos itens da proposta

## Contexto

Na etapa de itens da proposta, o campo `Qtd` estava configurado como numerico decimal (`step="0.01"`) e o schema aceitava valores acima de `0.01`.

## Objetivo

Permitir somente numeros inteiros positivos no campo de quantidade dos itens.

## Escopo

- Ajustar o schema do formulario para rejeitar quantidade decimal.
- Ajustar o input `Qtd` para usar passo inteiro e bloquear caracteres de decimal/exponencial.
- Manter calculo de total usando a quantidade numerica ja validada.

## Riscos

- Navegadores podem permitir colar texto mesmo em `type="number"`; por isso o campo deve bloquear colagem com caracteres nao numericos e o schema continua sendo a protecao final.

## Duvidas

- Nenhuma bloqueante.
