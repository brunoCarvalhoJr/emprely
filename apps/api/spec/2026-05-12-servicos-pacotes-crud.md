# Spec API - Servicos Pacotes CRUD

## Visao geral

Adicionar catalogo de servicos e pacotes da conta autenticada. Esse catalogo sera usado depois para montar propostas.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/services` | Bearer JWT | Lista servicos e pacotes ativos da conta atual. |
| GET | `/api/services/{id}` | Bearer JWT | Retorna um item do catalogo da conta atual. |
| POST | `/api/services` | Bearer JWT | Cria servico ou pacote na conta atual. |
| PUT | `/api/services/{id}` | Bearer JWT | Atualiza item do catalogo da conta atual. |
| DELETE | `/api/services/{id}` | Bearer JWT | Arquiva item do catalogo da conta atual. |

## Contratos

### Request

```json
{
  "nome": "Gestao mensal de Instagram",
  "descricao": "Planejamento, criacao e agendamento de conteudos.",
  "categoria": "Social Media",
  "preco": 1200.00,
  "unidade": "Mensal",
  "tipo": "Pacote"
}
```

### Response

```json
{
  "id": "guid",
  "nome": "Gestao mensal de Instagram",
  "descricao": "Planejamento, criacao e agendamento de conteudos.",
  "categoria": "Social Media",
  "preco": 1200.00,
  "unidade": "Mensal",
  "tipo": "Pacote",
  "status": "Ativo",
  "createdAt": "2026-05-12T00:00:00Z",
  "updatedAt": "2026-05-12T00:00:00Z"
}
```

## Regras de negocio

- Item e criado sempre para a conta do token.
- `tipo` aceita `Servico` ou `Pacote`.
- `unidade` aceita `Unico`, `Mensal`, `PorHora` ou `PorItem`.
- `preco` deve ser maior ou igual a zero.
- Listagem retorna somente status `Ativo`.
- Delete muda status para `Arquivado` e retorna `204`.

## Validacoes

- `nome`: obrigatorio, maximo 160 caracteres.
- `descricao`: opcional, maximo 1000 caracteres.
- `categoria`: opcional, maximo 80 caracteres.
- `preco`: obrigatorio, range `0` a `9999999999`.
- `unidade`: obrigatoria.
- `tipo`: obrigatorio.

## Dados e persistencia

- Criar tabela `servicos`.
- Colunas: `id`, `conta_id`, dados do item, `status`, `created_at`, `updated_at`.
- Indices: `conta_id`, `conta_id + nome`.

## Erros esperados

- `401` sem token valido.
- `400` request invalido.
- `404` item inexistente ou de outra conta.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `dotnet ef database update`
- Fluxo manual: login, create, list, get, update, delete, list.
