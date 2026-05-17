# Spec API - Robustez sessao auth MVP

## Visao geral

Garantir regressao automatizada para endpoints protegidos sem token.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/me` | Bearer | Retorna usuario atual quando autenticado |

## Contratos

### Request

Sem header `Authorization`.

### Response

```json
{}
```

Status esperado: `401`.

## Regras de negocio

- Usuario sem sessao valida nao acessa dados da conta.

## Validacoes

- Ausencia de token deve retornar `401`.

## Dados e persistencia

- Nenhuma alteracao.

## Erros esperados

- `401 Unauthorized`.

## Testes

- Integracao: `GET /api/me` sem token.
