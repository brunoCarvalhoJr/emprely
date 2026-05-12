# Analise API - Servicos Pacotes CRUD

## Contexto

O MVP ja possui autenticacao, conta, perfil profissional e clientes. Para montar propostas, a conta precisa ter um catalogo reutilizavel de servicos e pacotes.

## Objetivo

Criar CRUD de servicos/pacotes por conta autenticada, usando rotas publicas REST em ingles e codigo interno com nomes PortuguesIngles.

## Endpoints impactados

- `GET /api/services`
- `GET /api/services/{id}`
- `POST /api/services`
- `PUT /api/services/{id}`
- `DELETE /api/services/{id}`

## Contratos impactados

- Requests:
  - `CreateServicoRequest`
  - `UpdateServicoRequest`
- Responses:
  - `ServicoResponse`

## Dominio impactado

- Entidades:
  - `Servico`
  - `Conta`
- Value objects:
  - Nenhum nesta entrega.
- Regras:
  - Servico sempre pertence a uma conta.
  - Request nao aceita `contaId`.
  - `Tipo` diferencia `Servico` e `Pacote`.
  - `Unidade` define como o preco deve ser entendido.
  - `DELETE` arquiva em vez de remover fisicamente.
  - Listagem retorna apenas itens ativos.

## Persistencia e integracoes

- Banco:
  - Nova tabela `servicos`.
  - FK obrigatoria para `contas`.
- S3/SES/SQS:
  - Nao impactado.
- Auth/Billing:
  - Endpoints exigem JWT.
  - Trial/plano pago nao impactado.

## Multi-tenancy

Todos os filtros usam `currentContaContext.ContaId`. Leitura, atualizacao e arquivamento buscam por `id + conta_id`.

## Riscos

- Ainda nao ha propostas vinculadas, entao arquivamento nao valida dependencias.
- Categorias sao texto livre por enquanto; taxonomia fixa pode ser criada depois.

## Duvidas

- Pacote deve ser entidade separada? Decisao atual: nao, usar `Tipo = Pacote` no mesmo catalogo para acelerar o MVP.
- Preco pode ser zero? Decisao atual: sim, para permitir item gratuito/bonificacao.
- Moeda entra agora? Decisao atual: nao, assumir BRL no MVP local.
