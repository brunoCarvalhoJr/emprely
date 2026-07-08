# Spec - UI de checkout com dados do pagador

## Objetivo

Criar no app uma experiencia de contratacao em que o usuario seleciona mensal/anual, Pix/cartao, informa CPF/CNPJ e dados de contato/endereco, e e redirecionado para o checkout hospedado do Asaas.

## Campos

- Tipo de pessoa: pessoa fisica ou pessoa juridica.
- Nome/razao social.
- CPF/CNPJ.
- E-mail de cobranca.
- Telefone.
- CEP.
- Endereco.
- Numero.
- Complemento opcional.
- Bairro.
- Cidade.
- UF.

## Regras de interface

- O formulario deve bloquear envio quando houver campo obrigatorio invalido.
- O botao final deve ficar desabilitado durante checkout/cancelamento ou quando o metodo selecionado estiver inativo.
- Cartao deve aparecer como metodo hospedado no Asaas, sem campos de numero/CVV no Emprely.
- O texto da tela deve deixar claro que acesso so libera apos webhook/reconciliacao confirmar pagamento.

## Testes obrigatorios

- `pnpm lint:web`
- `pnpm web:build:beta`

## Deploy 2026-07-08

- `pnpm web:build:beta`
- `scripts/deploy-web-s3.ps1 -BucketName emprely-app-web -DistributionId E1NWXIL7S19BU1`
- Invalidation criada: `ICZHXD5QP88J1DH0O5TF7CADRT`.
- Validado em producao:
  - `https://app.emprely.com.br`: HTTP 200.
  - `https://app.emprely.com.br/billing/sucesso`: HTTP 200.
  - `https://app.emprely.com.br/billing/cancelado`: HTTP 200.
  - `https://app.emprely.com.br/billing/expirado`: HTTP 200.
