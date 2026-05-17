# Spec API - Hardening beta API

## Visao geral

Adicionar protecoes basicas de runtime na API.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| * | `/*` | Conforme rota | Recebe headers de seguranca |
| POST | `/api/auth/register` | Publica | Rate limit Auth |
| POST | `/api/auth/login` | Publica | Rate limit Auth |
| POST | `/api/admin/accounts/{contaId}/activate-founder` | Header admin | Rate limit Admin |

## Contratos

### Request

Sem mudanca.

### Response

Headers esperados:

```txt
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
```

Rate limit excedido: `429 Too Many Requests`.

## Regras de negocio

- Nao bloquear uso normal.
- Proteger endpoints sensiveis.

## Validacoes

- Configurar limites positivos.
- Usar defaults quando valores nao forem informados.

## Dados e persistencia

- Sem alteracao.

## Erros esperados

- `429` quando limite excedido.

## Testes

- Integracao: `/health/live` inclui headers.
