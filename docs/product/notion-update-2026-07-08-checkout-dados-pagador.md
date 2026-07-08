# Notion update - Checkout com dados do pagador

## Decisao

O fluxo de billing do Emprely passa a coletar dados do pagador no app antes de criar o checkout Asaas.

## O que mudou

- Tela `Plano` agora possui formulario de pagador.
- Usuario escolhe ciclo mensal/anual e metodo Pix ou cartao.
- Cartao continua hospedado no Asaas; o Emprely nao coleta numero, validade ou CVV.
- API valida CPF/CNPJ, e-mail, telefone, CEP, endereco, numero, bairro, cidade e UF.
- Provider Asaas envia esses dados ao criar/atualizar customer antes da assinatura.

## Criterios validados

- `dotnet test apps/api/Emprely.sln`
- `pnpm lint:web`
- `pnpm web:build:beta`

## Proximo passo recomendado

Fazer teste real em sandbox/producao controlada criando checkout Pix e cartao com dados de pagador validos, confirmando webhook e liberacao de plano.

## Deploy concluido

- API publicada no Lightsail em 2026-07-08.
- Webapp publicado no bucket `emprely-app-web` e invalidation criada no CloudFront `E1NWXIL7S19BU1`.
- Health checks publicos da API retornaram HTTP 200.
- `https://app.emprely.com.br` e rotas `/billing/sucesso`, `/billing/cancelado`, `/billing/expirado` retornaram HTTP 200.
- Ainda falta teste real controlado de checkout Pix/cartao com webhook.
