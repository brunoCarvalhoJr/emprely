# Spec - Mascara inteligente de CPF/CNPJ no cliente

## Arquivo

`src/App.tsx`

## Comportamento esperado

- O cadastro de cliente mostra `CPF/CNPJ` no lugar de `Documento`.
- `12345678901` vira `123.456.789-01`.
- `12345678000190` vira `12.345.678/0001-90`.
- Ao digitar o 12o digito, a mascara muda de CPF para CNPJ.
- O payload continua usando o campo `documento`.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
