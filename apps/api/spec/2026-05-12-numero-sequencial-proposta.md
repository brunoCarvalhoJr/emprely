# Spec API - Numero sequencial da proposta

## Visao geral

Adicionar um numero sequencial por conta para cada proposta criada.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/proposals` | Bearer JWT | Cria proposta com proximo numero da conta. |
| POST | `/api/proposals/{id}/duplicate` | Bearer JWT | Cria copia com novo numero da conta. |
| GET | `/api/proposals` | Bearer JWT | Lista propostas retornando `numero`. |
| GET | `/api/proposals/{id}` | Bearer JWT | Retorna proposta com `numero`. |

## Contratos

### Request

```json
{
  "clienteId": "uuid",
  "titulo": "Proposta",
  "itens": []
}
```

### Response

```json
{
  "id": "uuid",
  "numero": 1,
  "clienteId": "uuid",
  "clienteNome": "Cliente",
  "titulo": "Proposta",
  "status": "Rascunho"
}
```

## Regras de negocio

- Numero inicia em `1` por conta.
- Numero e calculado pelo maior numero da conta + 1.
- Propostas arquivadas continuam contando para evitar reaproveitamento.
- Editar proposta nao muda numero.
- Duplicar proposta recebe novo numero.

## Validacoes

- `Numero` deve ser maior que zero no dominio.
- Banco deve impedir duplicidade de `ContaId` + `Numero`.

## Dados e persistencia

- Adicionar `Numero` em `propostas`.
- Criar indice unico `IX_propostas_ContaId_Numero`.
- Popular dados existentes por ordem de `CreatedAt` e `Id`.

## Erros esperados

- `401` quando nao autenticado.
- `404` quando proposta nao existir na conta atual.
- `400` para validacoes existentes de proposta.

## Testes

- Unitarios:
  - Criar proposta armazena numero informado.
  - Numero menor que 1 e rejeitado.
  - Duplicar proposta preserva dados e usa novo numero.
- Integracao:
  - `dotnet build apps/api/Emprely.sln`
  - `dotnet test apps/api/Emprely.sln --no-build`
