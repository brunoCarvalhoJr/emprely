# Release - Billing Asaas e pagamento publico

Data: 2026-07-08

## Escopo publicado

- Billing Asaas completo para Plano Fundador com Pix e cartao no checkout hospedado.
- Recorrencia e assinatura Asaas integradas ao fluxo de pagamento.
- Webhook Asaas, reconciliacao, estados de pagamento, estados de assinatura, cancelamento e reembolso.
- Tela autenticada `Plano e pagamento` com status legivel, validade, proxima cobranca, comprovante e bloqueio visual contra duplicidade.
- Formulario de pagador reduzido para campos minimos: tipo de pessoa, nome/razao social e CPF/CNPJ.
- Pagamento publico por link assinado:
  - `/billing/regularizar`
  - `/billing/pagar/:token`
  - endpoints `POST/GET/POST /api/billing/public/payment-links`.
- Scripts e documentacao para segredos Asaas em Lightsail sem versionar secrets.

## Validacao consolidada

- `dotnet test apps/api/Emprely.sln`: aprovado.
- `pnpm lint:web`: aprovado.
- `pnpm web:build:beta`: aprovado.
- `pnpm test:e2e:web`: aprovado.
- Smokes de producao:
  - API live: 200
  - API ready: 200
  - app web: 200
  - pedido publico de link: 204
  - token publico invalido: 400

## Deploy

- API publicada no Lightsail com container healthy.
- Web publicado em S3/CloudFront com invalidacao criada.

## Observacao de seguranca

O fluxo publico nao faz busca aberta por CPF/CNPJ ou e-mail. A solicitacao de link responde de forma generica e o pagamento depende de token assinado, expiravel e enviado ao e-mail da conta.
