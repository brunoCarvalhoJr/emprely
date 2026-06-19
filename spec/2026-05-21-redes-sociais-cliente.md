# Spec - Redes sociais opcionais no cliente

## Comportamento esperado

- O cadastro completo de cliente deve exibir `Instagram`, `Facebook` e `TikTok`.
- Os tres campos sao opcionais.
- Os valores preenchidos devem ser persistidos ao criar ou editar cliente.
- Clientes existentes continuam validos com os campos vazios.
- A listagem principal nao ganha novas colunas.
- A busca de clientes deve considerar os campos de redes sociais.

## Validacao

- `dotnet test apps/api/Emprely.sln --artifacts-path apps/api/artifacts/clientes-redes-sociais`
- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
