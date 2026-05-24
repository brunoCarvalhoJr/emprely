# Analise - Redes sociais opcionais no cliente

## Componente afetado

`src/App.tsx` e `src/types/customer.ts`.

## Contexto tecnico

O formulario completo de cliente usa React Hook Form com Zod e envia payload tipado para a API. A tela ja recebeu campos de endereco, entao as redes sociais devem entrar em uma linha compacta e escaneavel.

## Decisao

Adicionar `Instagram`, `Facebook` e `TikTok` ao formulario, schema, valores padrao, busca, detalhe e payload. Nao adicionar colunas na tabela principal.
