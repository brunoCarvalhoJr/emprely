# Spec - Mascara de telefone fixo e celular

## Escopo

Atualizar a mascara e a validacao dos campos de telefone do sistema.

## Requisitos

- Telefones com DDD e 8 digitos devem aparecer como `(XX) XXXX-XXXX`.
- Telefones com DDD e 9 digitos devem aparecer como `(XX) XXXXX-XXXX`.
- O campo deve continuar aceitando apenas numeros digitados pelo usuario.
- A validacao deve aceitar 10 ou 11 digitos nacionais.
- A normalizacao com prefixo `55` deve continuar funcionando.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
