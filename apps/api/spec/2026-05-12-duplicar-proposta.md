# Spec API - Duplicar proposta

## Visao geral

Permitir que o usuario duplique uma proposta ativa para acelerar criacao de novas propostas parecidas.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/proposals/{id}/duplicate` | Bearer JWT | Cria uma copia em rascunho da proposta informada. |

## Contratos

### Request

```json
{}
```

### Response

```json
{
  "id": "uuid-da-copia",
  "clienteId": "uuid-do-cliente",
  "clienteNome": "Cliente",
  "titulo": "Titulo original (copia)",
  "status": "Rascunho",
  "total": 1000,
  "itens": []
}
```

## Regras de negocio

- Apenas proposta da conta autenticada pode ser duplicada.
- Proposta arquivada retorna `404`.
- Copia nasce como `Rascunho`, independentemente do status original.
- Copia preserva cliente, introducao, observacoes, validade, itens, quantidades e valores.
- Copia nao altera a proposta original.

## Validacoes

- `id` precisa ser `Guid`.
- Se proposta nao existir na conta atual, retornar `404`.

## Dados e persistencia

- Sem alteracao de schema.
- Nova linha em `propostas`.
- Novas linhas em `proposta_itens`.

## Erros esperados

- `401` quando nao autenticado.
- `404` quando proposta nao existir, nao pertencer a conta ou estiver arquivada.

## Testes

- Unitarios:
  - Duplicar proposta cria rascunho com dados e itens copiados.
  - Duplicar proposta arquivada deve falhar.
- Integracao:
  - `dotnet build apps/api/Emprely.sln`
  - `dotnet test apps/api/Emprely.sln --no-build`
