# Analise Web - Clientes CRUD

## Contexto

O usuario logado ja consegue configurar perfil profissional e marca. O proximo passo e cadastrar clientes para usar em propostas.

## Objetivo da tela/fluxo

Adicionar uma area de clientes no app logado com listagem, criacao, edicao e arquivamento.

## Rotas impactadas

- App de pagina unica em `/`.

## Componentes impactados

- `App.tsx`
- `lib/api.ts`
- `types/customer.ts`

## Formularios e validacao

- Campos:
  - Nome
  - Email
  - Telefone
  - Documento
  - Observacoes
- Regras:
  - Nome obrigatorio.
  - Email opcional, mas deve ser valido quando preenchido.
  - Demais campos opcionais com limite de tamanho.
- Mensagens:
  - Feedback ao salvar.
  - Erro de API.

## Dados e chamadas de API

- Queries:
  - `GET /api/customers`
- Mutations:
  - `POST /api/customers`
  - `PUT /api/customers/{id}`
  - `DELETE /api/customers/{id}`
- Estados de loading/erro/vazio:
  - Loading ao carregar clientes.
  - Estado vazio incentivando cadastro.
  - Estado de edicao quando usuario seleciona um cliente.

## Responsividade e acessibilidade

- Layout em duas colunas no desktop e coluna unica no mobile.
- Labels visiveis.
- Botoes com icones e texto claro.

## Duvidas

- Teremos busca/filtro agora? Decisao atual: nao, listagem simples.
- Delete remove ou arquiva? Decisao atual: arquiva.
