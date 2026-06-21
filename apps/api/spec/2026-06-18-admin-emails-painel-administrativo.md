# Spec - Admin emails no painel administrativo

## Escopo

Permitir que os endpoints de emails administrativos sejam usados pelo painel administrativo autenticado.

## Comportamento

- `GET /api/admin/emails` aceita:
  - chave `X-Emprely-Admin-Key`; ou
  - bearer token administrativo `SuperAdmin`.
- `POST /api/admin/emails/resend-confirmation` aceita os mesmos acessos.
- Quando usado por token, registrar auditoria da acao de reenvio.

## Validacao

- Build da API.
- Build do web.
