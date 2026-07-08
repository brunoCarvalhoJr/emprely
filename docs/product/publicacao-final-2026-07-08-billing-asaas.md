# Publicacao final - Billing Asaas

Data: 2026-07-08

## Repositorios publicados

- Emprely monorepo
  - Branch: `refat`
  - Commit de release: `09cc7e9d241293d35611332da24075d25ff6fe45`
  - Commit final de documentacao: `53edea0`
  - Remoto: `origin/refat`
- Landing page
  - Branch: `new`
  - Commit: `f6548f1`
  - Remoto: `origin/new`

## Publicacao executada

- API Emprely publicada no Lightsail.
- Web app publicado em S3/CloudFront.
- Landing publicada em S3/CloudFront.

## Smokes finais

- `https://api.emprely.com.br/health/live`: 200.
- `https://api.emprely.com.br/health/ready`: 200.
- `POST https://api.emprely.com.br/api/billing/public/payment-links`: 204.
- `GET https://api.emprely.com.br/api/billing/public/payment-links/token-invalido`: 400.
- `https://app.emprely.com.br/billing/regularizar`: 200 com bundle atualizado.
- `https://emprely.com.br`: 200 com copy de Pix/cartao/Asaas confirmada.

## Observacao

Secrets Asaas e Lightsail nao foram versionados. O deploy usou os arquivos privados locais de ambiente e chave.
