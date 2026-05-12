# Spec API - Cadastro Usuario Validacao

## Visao geral

Corrigir a validacao dos requests de autenticacao para que o ASP.NET Core consiga cadastrar usuario sem erro 500 causado por metadados de validacao em local incorreto.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Publica | Cadastra usuario, cria conta e retorna token JWT. |
| POST | `/api/auth/login` | Publica | Autentica usuario existente e retorna token JWT. |

## Contratos

### Request cadastro

```json
{
  "nome": "Teste Codex",
  "email": "teste.codex@emprely.dev",
  "senha": "Senha123",
  "nomeConta": "Conta Teste Codex"
}
```

### Request login

```json
{
  "email": "teste.codex@emprely.dev",
  "senha": "Senha123"
}
```

### Response

```json
{
  "accessToken": "jwt",
  "expiresAt": "2026-05-12T00:00:00Z",
  "usuario": {
    "id": "guid",
    "nome": "Teste Codex",
    "email": "teste.codex@emprely.dev"
  },
  "conta": {
    "id": "guid",
    "nome": "Conta Teste Codex"
  }
}
```

## Regras de negocio

- Cadastro deve aceitar email ainda nao cadastrado.
- Cadastro deve rejeitar email ja cadastrado com resposta esperada do fluxo atual.
- Login deve continuar aceitando usuario cadastrado com senha correta.

## Validacoes

- `nome` obrigatorio e com limite de 160 caracteres.
- `email` obrigatorio, em formato valido, e com limite de 256 caracteres no cadastro.
- `senha` obrigatoria e com minimo de 8 caracteres no cadastro.
- `nomeConta` obrigatorio e com limite de 160 caracteres.

## Dados e persistencia

- Sem nova migration.
- Sem alteracao nas tabelas existentes.

## Erros esperados

- Request invalido deve retornar erro de validacao, nao erro 500.
- Email ja cadastrado deve retornar o erro ja definido no endpoint.

## Testes

- Unitarios:
  - `dotnet test apps/api/Emprely.sln --no-build`
- Integracao manual:
  - `POST /api/auth/register` com email unico.
  - `GET /api/me` com bearer token retornado pelo cadastro.
