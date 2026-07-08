# Notion update - Billing publico por link assinado

Data: 2026-07-08

Registrar no rastreador:

- V2 implementada: regularizacao publica do Plano Fundador por link assinado.
- Web:
  - `/billing/regularizar` solicita link seguro por e-mail.
  - `/billing/pagar/:token` abre tela publica de pagamento.
- API:
  - `POST /api/billing/public/payment-links`
  - `GET /api/billing/public/payment-links/{token}`
  - `POST /api/billing/public/payment-links/{token}/checkouts`
- Pedido de link nao revela se e-mail existe.
- Token usa Data Protection, expira em 24 horas e valida usuario/membro/conta ativos.
- Checkout publico reutiliza as regras de duplicidade do billing autenticado.
- Rate limit especifico para `/api/billing/public`.
- Validado e publicado em producao em 2026-07-08.
