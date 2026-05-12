# Spec API - Perfil Conta Marca

## Visao geral

Adicionar endpoints autenticados para consultar e atualizar o perfil profissional e a marca da conta atual.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/account/profile` | Bearer JWT | Retorna perfil profissional e marca da conta atual. |
| PUT | `/api/account/profile` | Bearer JWT | Cria ou atualiza perfil profissional e marca da conta atual. |

## Contratos

### Request

```json
{
  "nomeComercial": "Emprely",
  "emailContato": "contato@emprely.dev",
  "telefoneContato": "+55 11 99999-9999",
  "siteUrl": "https://emprely.com",
  "instagram": "@emprely",
  "documento": "00.000.000/0001-00",
  "corPrimaria": "#2563EB",
  "corSecundaria": "#14B8A6",
  "logoUrl": "https://emprely.com/logo.png"
}
```

### Response

```json
{
  "id": "guid-ou-null",
  "contaId": "guid",
  "nomeComercial": "Emprely",
  "emailContato": "contato@emprely.dev",
  "telefoneContato": "+55 11 99999-9999",
  "siteUrl": "https://emprely.com",
  "instagram": "@emprely",
  "documento": "00.000.000/0001-00",
  "corPrimaria": "#2563EB",
  "corSecundaria": "#14B8A6",
  "logoUrl": "https://emprely.com/logo.png",
  "updatedAt": "2026-05-12T00:00:00Z"
}
```

## Regras de negocio

- O perfil sempre pertence a conta autenticada pelo token.
- `GET` retorna dados padrao mesmo quando a conta ainda nao tem perfil persistido.
- `PUT` cria o perfil quando nao existir.
- `PUT` atualiza o perfil quando ja existir.

## Validacoes

- `nomeComercial`: obrigatorio, maximo 160 caracteres.
- `emailContato`: opcional, email valido, maximo 256 caracteres.
- `telefoneContato`: opcional, maximo 40 caracteres.
- `siteUrl`: opcional, maximo 300 caracteres.
- `instagram`: opcional, maximo 80 caracteres.
- `documento`: opcional, maximo 40 caracteres.
- `corPrimaria`: obrigatoria, formato `#RRGGBB`.
- `corSecundaria`: obrigatoria, formato `#RRGGBB`.
- `logoUrl`: opcional, maximo 500 caracteres.

## Dados e persistencia

- Criar tabela `perfis_conta`.
- Chave primaria `id`.
- `conta_id` unico e FK para `contas`.
- Sem alteracao em JWT nesta entrega.

## Erros esperados

- `401` sem token valido.
- `404` se a conta do token nao existir.
- `400` para request invalido.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `dotnet ef database update`
- `POST /api/auth/login`
- `GET /api/account/profile`
- `PUT /api/account/profile`
- `GET /api/account/profile` confirmando dados atualizados.
