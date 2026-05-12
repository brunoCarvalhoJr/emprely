# Spec Web - Servicos Pacotes CRUD

## Visao geral

Adicionar no web autenticado uma area de servicos e pacotes para criar, editar, listar e arquivar itens do catalogo da conta atual.

## Escopo

Inclui:

- Tipos TypeScript para servico.
- Funcoes API para listar, criar, atualizar e arquivar.
- Estado de tela `Servicos` no app logado.
- Formulario de servico/pacote.
- Lista de itens ativos.
- Acao de editar.
- Acao de arquivar.

Fora do escopo:

- Composicao de pacotes com varios servicos.
- Busca, filtros e paginacao.
- Vinculo com propostas.
- Calculo de subtotal/total da proposta.

## Criterios de aceite

- Usuario logado consegue abrir a area de servicos.
- Usuario logado consegue cadastrar servico ou pacote.
- Item aparece na lista.
- Usuario consegue editar item.
- Usuario consegue arquivar item.
- Item arquivado sai da listagem ativa.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.

## Testes

- Lint do web.
- Build do web.
- Smoke test manual via API e web local.
