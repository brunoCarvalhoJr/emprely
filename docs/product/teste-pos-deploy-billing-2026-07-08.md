# Teste pos-deploy billing - 2026-07-08

## Escopo

Rodada de testes apos deploy do checkout com dados do pagador, Pix/cartao hospedado Asaas, API Lightsail, webapp S3/CloudFront e landing publica.

## Validacoes executadas

- `dotnet test apps/api/Emprely.sln`
  - 50 testes unitarios passaram.
  - 61 testes de integracao passaram.
- `pnpm lint:web`
  - Passou.
- `pnpm web:build:beta`
  - Passou.
- `pnpm test:e2e:web`
  - 6 testes Playwright passaram.
- `pnpm validate:lightsail`
  - Passou.
- `pnpm validate:deploy`
  - Passou.
- `pnpm landing:check`
  - Passou.
- `pnpm landing:build`
  - Passou.
- `pnpm landing:deploy:prod`
  - Publicou landing e criou invalidation `I1NNBB0S3OHVX7MWPWIU3XL8U2`.

## Smokes publicos

- `https://api.emprely.com.br/health/live`: HTTP 200.
- `https://api.emprely.com.br/health/ready`: HTTP 200.
- `https://app.emprely.com.br`: HTTP 200.
- `https://app.emprely.com.br/billing/sucesso`: HTTP 200.
- `https://app.emprely.com.br/billing/cancelado`: HTTP 200.
- `https://app.emprely.com.br/billing/expirado`: HTTP 200.
- `https://app.emprely.com.br/suporte`: HTTP 200.
- `https://www.emprely.com.br`: HTTP 200.
- `https://emprely.com.br`: HTTP 200.
- `https://www.emprely.com.br/privacidade`: HTTP 200.

## Testes autenticados sem cobranca real

- Login com usuario de teste privado: OK.
- `GET /api/billing/plans`: retornou 2 planos/ciclos.
- `GET /api/billing/status`: retornou status da conta.
- `POST /api/billing/checkouts` sem `pagador`: retornou HTTP 400, como esperado.

## Logs e browser

- Container API em Lightsail: `healthy`.
- Busca em logs recentes nao encontrou excecao critica, fatal, HTTP 500 ou erro Asaas.
- Aviso observado: `Failed to determine the https port for redirect.`. Nao bloqueou health/API publica; deve ser tratado como ajuste de ruido de log se incomodar.
- Smoke Playwright em producao para app, retorno billing e suporte: HTTP 200 e sem erro de console/pageerror.

## Problema encontrado e corrigido

- A landing ainda dizia que o Plano Fundador era ativado apenas por Pix e que cartao ficava para etapa futura.
- Correcoes feitas no projeto externo da landing:
  - `src/content/landing-content.ts`
  - `src/components/landing-page.tsx`
  - `src/components/sections/lead-form.tsx`
- Foram criadas analise/spec SDD na landing:
  - `.cursor/analise/2026-07-08-checkout-cartao-hospedado-copy.md`
  - `spec/2026-07-08-checkout-cartao-hospedado-copy.md`
- Landing validada e publicada.
- HTML publico de `www.emprely.com.br` contem `Pix ou cartão` e nao contem a frase antiga de cartao futuro.

## Restricao ainda pendente

- O usuario AWS de deploy nao tem `cloudfront:GetInvalidation`; as invalidations sao criadas, mas o CLI nao consegue aguardar/consultar conclusao.
- Teste real de pagamento Pix/cartao nao foi executado para evitar gerar cobranca real sem confirmacao explicita.

## Proximo teste manual recomendado

Entrar no app com uma conta de teste, preencher dados reais/controlados do pagador, criar checkout Pix e cartao, pagar/simular pagamento conforme ambiente escolhido, e confirmar webhook/reconciliacao liberando o Plano Fundador.
