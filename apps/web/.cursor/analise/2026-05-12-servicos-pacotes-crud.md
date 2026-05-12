# Analise Web - Servicos Pacotes CRUD

## Contexto

O app logado ja possui configuracao da conta e CRUD de clientes. O proximo passo e permitir que o usuario monte um catalogo de servicos e pacotes para reutilizar nas propostas.

## Objetivo da tela/fluxo

Adicionar uma area de servicos com listagem, criacao, edicao e arquivamento.

## Rotas impactadas

- App de pagina unica em `/`.

## Componentes impactados

- `App.tsx`
- `lib/api.ts`
- `types/service.ts`

## Formularios e validacao

- Campos:
  - Nome
  - Descricao
  - Categoria
  - Preco
  - Unidade
  - Tipo
- Regras:
  - Nome obrigatorio.
  - Preco maior ou igual a zero.
  - Unidade e tipo obrigatorios.
- Mensagens:
  - Feedback ao salvar.
  - Erro de API.

## Dados e chamadas de API

- Queries:
  - `GET /api/services`
- Mutations:
  - `POST /api/services`
  - `PUT /api/services/{id}`
  - `DELETE /api/services/{id}`
- Estados de loading/erro/vazio:
  - Loading ao carregar servicos.
  - Estado vazio incentivando cadastro.
  - Estado de edicao quando usuario seleciona item.

## Responsividade e acessibilidade

- Layout em duas colunas no desktop e coluna unica no mobile.
- Labels visiveis.
- Selects para tipo e unidade.

## Duvidas

- Pacote deve ter composicao de varios servicos agora? Decisao atual: nao, catalogo simples; composicao entra no fluxo de proposta.
