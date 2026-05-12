# Spec API - Clientes CRUD

## Visao geral

Adicionar CRUD de clientes para a conta autenticada. Os endpoints publicos usam rotas REST em ingles, enquanto nomes de dominio e codigo usam PortuguesIngles.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/customers` | Bearer JWT | Lista clientes ativos da conta atual. |
| GET | `/api/customers/{id}` | Bearer JWT | Retorna um cliente da conta atual. |
| POST | `/api/customers` | Bearer JWT | Cria cliente na conta atual. |
| PUT | `/api/customers/{id}` | Bearer JWT | Atualiza cliente da conta atual. |
| DELETE | `/api/customers/{id}` | Bearer JWT | Arquiva cliente da conta atual. |

## Contratos

### Request

```json
{
  "nome": "Maria Cliente",
  "email": "maria@cliente.com",
  "telefone": "+55 11 99999-9999",
  "documento": "123.456.789-00",
  "observacoes": "Cliente recorrente de social media."
}
```

### Response

```json
{
  "id": "guid",
  "nome": "Maria Cliente",
  "email": "maria@cliente.com",
  "telefone": "+55 11 99999-9999",
  "documento": "123.456.789-00",
  "observacoes": "Cliente recorrente de social media.",
  "status": "Ativo",
  "createdAt": "2026-05-12T00:00:00Z",
  "updatedAt": "2026-05-12T00:00:00Z"
}
```

## Regras de negocio

- Cliente e criado sempre para a conta do token.
- Listagem retorna somente clientes com status `Ativo`.
- Leitura por id retorna `404` quando o cliente nao existe na conta atual.
- Atualizacao nao muda a conta do cliente.
- Delete muda status para `Arquivado` e retorna `204`.

## Validacoes

- `nome`: obrigatorio, maximo 160 caracteres.
- `email`: opcional, email valido, maximo 256 caracteres.
- `telefone`: opcional, maximo 40 caracteres.
- `documento`: opcional, maximo 40 caracteres.
- `observacoes`: opcional, maximo 1000 caracteres.

## Dados e persistencia

- Criar tabela `clientes`.
- Colunas: `id`, `conta_id`, dados de contato, `status`, `created_at`, `updated_at`.
- Indices: `conta_id`, `conta_id + nome`.

## Erros esperados

- `401` sem token valido.
- `400` request invalido.
- `404` cliente inexistente ou de outra conta.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `dotnet ef database update`
- Fluxo manual: login, create, list, get, update, delete, list.
