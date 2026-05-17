# Spec API - Validacao de telefone WhatsApp do cliente

## Visao geral

Validar telefone de cliente para reduzir falhas no compartilhamento por WhatsApp.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/customers` | Bearer JWT | Cria cliente validando telefone opcional. |
| PUT | `/api/customers/{id}` | Bearer JWT | Atualiza cliente validando telefone opcional. |

## Contratos

### Request

```json
{
  "nome": "Cliente",
  "telefone": "(11) 99999-9999"
}
```

### Response

```json
{
  "id": "uuid",
  "telefone": "(11) 99999-9999"
}
```

## Regras de negocio

- Telefone vazio ou nulo e aceito.
- Telefone nacional precisa ter 10 ou 11 digitos.
- Telefone com prefixo `55` precisa ter 12 ou 13 digitos.
- Formatos visuais sao aceitos, desde que os digitos sejam validos.

## Validacoes

- Telefone invalido retorna `ValidationProblem`.
- Dominio tambem protege a regra para chamadas internas.

## Dados e persistencia

- Sem nova coluna.
- O valor continua salvo normalizado por trim, preservando formatacao digitada.

## Erros esperados

- `400` para telefone invalido.
- `401` quando nao autenticado.
- `404` em update quando cliente nao existe na conta.

## Testes

- Unitarios:
  - Telefone nacional valido.
  - Telefone com `55` valido.
  - Telefone vazio valido.
  - Telefone invalido rejeitado.
- Integracao:
  - `dotnet build apps/api/Emprely.sln`
  - `dotnet test apps/api/Emprely.sln --no-build`
