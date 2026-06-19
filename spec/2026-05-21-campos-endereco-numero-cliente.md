# Spec - Campos opcionais de endereco e numero no cliente

## Comportamento esperado

- O cadastro completo de cliente deve exibir `Endereco` e `Numero`.
- Os dois campos sao opcionais.
- Ao salvar ou editar um cliente, os valores preenchidos devem ser persistidos.
- Clientes ja cadastrados continuam validos com os campos vazios.
- A listagem continua compacta; o endereco pode aparecer em detalhe/apoio, mas nao deve piorar a largura da grid.

## Validacao

- `dotnet test apps/api/Emprely.sln --artifacts-path .codex/dotnet-artifacts/clientes-endereco-numero`
- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
