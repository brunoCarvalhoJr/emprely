# Analise - Mascara de reais nos campos de valor

## Componente afetado

`src/App.tsx`.

## Contexto tecnico

Os campos monetarios sao controlados pelo React Hook Form e validados com Zod como `number`. A mascara precisa alterar apenas a apresentacao do input, mantendo o valor interno numerico.

## Decisao

Usar `Controller` para ligar `CampoMoedaReal` aos campos numericos sem passar strings mascaradas para o schema.
O desconto deve reutilizar exatamente o mesmo componente do campo Valor.
