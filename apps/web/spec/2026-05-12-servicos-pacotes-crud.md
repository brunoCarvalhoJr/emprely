# Spec Web - Serviços e Pacotes CRUD

## Visão geral

Adicionar no web autenticado uma área de serviços e pacotes para criar, editar, listar e arquivar itens do catálogo da conta atual.

## Escopo

Inclui:

- Tipos TypeScript para serviço.
- Funções API para listar, criar, atualizar e arquivar.
- Estado de tela `Servicos` no app logado.
- Formulário de serviço/pacote.
- Lista de itens ativos.
- Ação de editar.
- Ação de arquivar.
- Unidades: `Único`, `Mensal`, `Semanal`, `Diário`, `Por hora` e `Por item`.

Fora do escopo:

- Composição de pacotes com vários serviços.
- Busca, filtros e paginação.
- Vínculo com propostas.
- Cálculo de subtotal/total da proposta.

## Critérios de aceite

- Usuário logado consegue abrir a área de serviços.
- Usuário logado consegue cadastrar serviço ou pacote.
- Item aparece na lista.
- Usuário consegue editar item.
- Usuário consegue arquivar item.
- Item arquivado sai da listagem ativa.
- Usuário consegue cadastrar serviço com unidade semanal.
- Usuário consegue cadastrar serviço com unidade diária.
- Campo de preço permite digitar valores como `1500` e `1500,50` sem apagar ou
  travar a edição, formatando como moeda ao sair do campo.
- Campos monetários reutilizados em propostas exibem um número editável simples
  ao receber foco, como `1500,00`, evitando edição dentro de `R$ 1.500,00`.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.

## Testes

- Lint do web.
- Build do web.
- Smoke test manual via API e web local.
