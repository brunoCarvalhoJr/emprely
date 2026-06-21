# Spec - Mascara inteligente de CPF/CNPJ no cliente

## Escopo

Atualizar o campo de documento no cadastro e edicao de clientes.

## Requisitos

- O campo deve ser exibido como `CPF/CNPJ`.
- O campo deve iniciar formatando como CPF: `000.000.000-00`.
- Ao passar de 11 digitos, deve formatar como CNPJ: `00.000.000/0000-00`.
- A digitacao deve aceitar apenas numeros, mantendo pontuacao gerada pela mascara.
- O formulario deve aceitar vazio, CPF com 11 digitos ou CNPJ com 14 digitos.
- A listagem e detalhe de cliente devem exibir o mesmo rotulo `CPF/CNPJ`.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
