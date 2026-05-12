# Spec API - Cadastro Usuario CORS HTTPS Local

## Visao geral

Corrigir o fluxo local de cadastro para evitar redirect HTTPS em chamadas CORS feitas pelo web Vite em `http://localhost:5173` contra a API em `http://localhost:5262`.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| OPTIONS | `/api/auth/register` | Publica | Preflight CORS do cadastro local. |
| POST | `/api/auth/register` | Publica | Cadastro de usuario e conta. |

## Contratos

### Request

```json
{
  "nome": "Bruno Carvalho",
  "email": "bruno.novo@emprely.dev",
  "senha": "Senha123",
  "nomeConta": "Emprely"
}
```

### Response

```json
{
  "accessToken": "jwt",
  "expiresAt": "2026-05-12T00:00:00Z",
  "usuario": {
    "id": "guid",
    "nome": "Bruno Carvalho",
    "email": "bruno.novo@emprely.dev"
  },
  "conta": {
    "id": "guid",
    "nome": "Emprely"
  }
}
```

## Regras de negocio

- Nenhuma regra de cadastro muda.
- Email ja cadastrado continua sendo erro esperado do endpoint.

## Validacoes

- `OPTIONS` local deve responder sem redirect.
- `POST` local deve receber cabecalho CORS para `http://localhost:5173`.
- Redirect HTTPS deve continuar habilitado fora de `Development`.

## Dados e persistencia

- Sem nova migration.
- Sem alteracao de schema.

## Erros esperados

- Preflight CORS nao deve retornar `307`.
- Browser nao deve mostrar `Failed to fetch` por redirect de preflight.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- API local com profile `https` respondendo `OPTIONS http://localhost:5262/api/auth/register` com `204`.
- `POST http://localhost:5262/api/auth/register` com `Origin: http://localhost:5173` cadastrando usuario com email unico.
