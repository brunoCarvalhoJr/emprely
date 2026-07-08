# Obsidian update - Billing publico por link assinado

Data: 2026-07-08

## Entrega

- Implementada a V2 de regularizacao publica do Plano Fundador.
- Nova rota publica `GET /billing/regularizar` no web para solicitar link seguro por e-mail.
- Nova rota publica `GET /billing/pagar/:token` no web para abrir pagamento por token assinado.
- Novos endpoints publicos da API:
  - `POST /api/billing/public/payment-links`
  - `GET /api/billing/public/payment-links/{token}`
  - `POST /api/billing/public/payment-links/{token}/checkouts`
- O pedido de link retorna sempre sucesso quando o e-mail tem formato valido, sem revelar se a conta existe.
- Token assinado usa Data Protection persistido no banco e expira em 24 horas.
- Checkout publico usa as mesmas regras do billing autenticado para evitar duplicidade.
- Cartao e Pix continuam no checkout hospedado do Asaas.

## Segurança

- Nao foi criada busca publica por CPF/CNPJ ou e-mail.
- O link so e enviado ao e-mail da conta.
- Token invalido/expirado retorna erro.
- Rate limit especifico adicionado para `/api/billing/public`.

## Validacao

- `dotnet test apps/api/Emprely.sln`: aprovado, 117 testes.
- `pnpm lint:web`: aprovado.
- `pnpm web:build:beta`: aprovado.
- `pnpm test:e2e:web`: aprovado, 6 testes.
- Deploy API Lightsail concluido com container healthy.
- Deploy web S3/CloudFront concluido com invalidacao criada.
- Smokes:
  - `https://api.emprely.com.br/health/live`: 200
  - `https://api.emprely.com.br/health/ready`: 200
  - `POST /api/billing/public/payment-links`: 204
  - `GET /api/billing/public/payment-links/token-invalido`: 400
  - `https://app.emprely.com.br/billing/regularizar`: 200
