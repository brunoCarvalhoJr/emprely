# Spec API - Redes sociais opcionais no cliente

## Visao geral

Adicionar Instagram, Facebook e TikTok ao cadastro de cliente como dados opcionais persistidos.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/customers` | JWT | Lista clientes ativos com redes sociais. |
| GET | `/api/customers/{id}` | JWT | Retorna cliente com redes sociais. |
| POST | `/api/customers` | JWT | Cria cliente aceitando redes sociais opcionais. |
| PUT | `/api/customers/{id}` | JWT | Atualiza cliente aceitando redes sociais opcionais. |

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
  "instagram": "@mariacliente",
  "facebook": "facebook.com/mariacliente",
  "tiktok": "@mariacliente",
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
  "instagram": "@mariacliente",
  "facebook": "facebook.com/mariacliente",
  "tiktok": "@mariacliente",
  "observacoes": "Cliente recorrente",
  "status": "Ativo",
  "createdAt": "2026-05-21T00:00:00Z",
  "updatedAt": null
}
```

## Regras de negocio

- Redes sociais sao opcionais.
- Strings vazias devem ser normalizadas para `null`.
- Os campos pertencem ao cliente da conta autenticada.

## Validacoes

- `Instagram`: maximo de 160 caracteres.
- `Facebook`: maximo de 160 caracteres.
- `TikTok`: maximo de 160 caracteres.

## Dados e persistencia

- Adicionar colunas nullable `Instagram`, `Facebook` e `TikTok` na tabela `clientes`.

## Erros esperados

- `400` para payload invalido por tamanho maximo.
- `404` quando o cliente nao pertence a conta autenticada ou esta arquivado.

## Testes

- Unitarios: normalizacao dos campos em `Cliente`.
- Integracao: criacao de cliente retorna redes sociais.
