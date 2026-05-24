# Analise - Mascara inteligente de CPF/CNPJ no cliente

## Componente afetado

`src/App.tsx`.

## Contexto tecnico

O formulario de cliente usa React Hook Form com Zod e envia `documento` para a API. A mudanca deve ficar no web app e preservar o contrato atual.

## Decisao

Criar helpers centralizados `formatCpfCnpjCampo`, `isCpfCnpjCampoValido` e `buildCpfCnpjInputProps` para o campo de cliente.
