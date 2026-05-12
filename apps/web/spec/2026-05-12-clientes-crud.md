# Spec Web - Clientes CRUD

## Visao geral

Adicionar no web autenticado uma area de clientes para criar, editar, listar e arquivar clientes da conta atual.

## Escopo

Inclui:

- Tipos TypeScript para cliente.
- Funcoes API para listar, criar, atualizar e arquivar.
- Estado de tela `Clientes` no app logado.
- Formulario de cliente.
- Lista de clientes ativos.
- Acao de editar.
- Acao de arquivar.

Fora do escopo:

- Busca, filtros e paginacao.
- Importacao CSV.
- Vinculo com propostas.
- Cliente pessoa fisica/juridica formal.

## Criterios de aceite

- Usuario logado consegue abrir a area de clientes.
- Usuario logado consegue cadastrar cliente.
- Cliente aparece na lista.
- Usuario consegue editar cliente.
- Usuario consegue arquivar cliente.
- Cliente arquivado sai da listagem ativa.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.

## Testes

- Lint do web.
- Build do web.
- Smoke test manual via API e web local.
