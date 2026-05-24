# Analise - Mascara de telefone fixo e celular

## Componente afetado

`src/App.tsx`.

## Contexto tecnico

Os campos de telefone usam `buildTelefoneInputProps`, `formatTelefoneCampo`, `isTelefoneWhatsappValido` e `extrairDigitosTelefoneNacional`. A regra precisa ser alterada em um ponto central para afetar cadastro, clientes, cliente rapido e configuracoes.

## Decisao

Aceitar telefones nacionais com 10 ou 11 digitos e escolher a mascara conforme a quantidade de digitos apos o DDD.
