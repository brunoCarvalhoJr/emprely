# Spec API - Campos opcionais de endereco e numero no cliente

## Visao geral

Adicionar endereco e numero ao cadastro de cliente como dados opcionais persistidos.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/customers` | JWT | Lista clientes ativos com endereco e numero. |
| GET | `/api/customers/{id}` | JWT | Retorna cliente com endereco e numero. |
| POST | `/api/customers` | JWT | Cria cliente aceitando endereco e numero opcionais. |
| PUT | `/api/customers/{id}` | JWT | Atualiza cliente aceitando endereco e numero opcionais. |

## Contratos

### Request

```json
{
  "nome": "Maria Cliente",
  "email": "maria@cliente.com",
  "telefone": "(11) 99999-9999",
  "documento": "123.456.789-00",
  "endereco": "Rua das Flores",
  "numero": "123",
  "observacoes": "Cliente recorrente"
}
```

### Response

```json
{
  "id": "0197...",
  "nome": "Maria Cliente",
  "email": "maria@cliente.com",
  "telefone": "(11) 99999-9999",
  "documento": "123.456.789-00",
  "endereco": "Rua das Flores",
  "numero": "123",
  "observacoes": "Cliente recorrente",
  "status": "Ativo",
  "createdAt": "2026-05-21T00:00:00Z",
  "updatedAt": null
}
```

## Regras de negocio

- `Endereco` e `Numero` sao opcionais.
- Strings vazias devem ser normalizadas para `null`.
- Os campos pertencem ao cliente da conta autenticada.

## Validacoes

- `Endereco`: maximo de 200 caracteres.
- `Numero`: maximo de 30 caracteres.

## Dados e persistencia

- Adicionar colunas nullable `Endereco` e `Numero` na tabela `clientes`.

## Erros esperados

- `400` para payload invalido por tamanho maximo.
- `404` quando o cliente nao pertence a conta autenticada ou esta arquivado.

## Testes

- Unitarios: normalizacao dos campos em `Cliente`.
- Integracao: criacao de cliente retorna endereco e numero.
