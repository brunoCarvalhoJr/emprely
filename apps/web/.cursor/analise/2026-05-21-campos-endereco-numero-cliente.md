# Analise - Campos opcionais de endereco e numero no cliente

## Componente afetado

`src/App.tsx` e `src/types/customer.ts`.

## Contexto tecnico

O formulario completo de cliente usa React Hook Form com Zod e envia payload tipado para a API. A listagem ja esta sensivel a largura, entao a alteracao deve evitar novas colunas principais.

## Decisao

Adicionar `Endereco` e `Numero` ao formulario, schema, valores padrao e payload. Exibir endereco completo como informacao secundaria do cliente quando existir, preservando a grid compacta.
