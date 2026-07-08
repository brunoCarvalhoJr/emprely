# Spec - Checkout com dados do pagador Asaas

## Objetivo

Permitir que a conta escolha plano, ciclo e metodo de pagamento no Emprely, informe dados do pagador CPF/CNPJ e seja redirecionada para pagar no ambiente hospedado do Asaas.

## Contrato

`POST /api/billing/checkouts` deve aceitar:

- `planoCodigo`
- `metodoPagamento`: `Pix` ou `CartaoCredito`
- `ciclo`: `Mensal` ou `Anual`
- `pagador`
  - `tipoPessoa`: `Fisica` ou `Juridica`
  - `nome`
  - `cpfCnpj`
  - `email`
  - `telefone`
  - `cep`
  - `endereco`
  - `numero`
  - `complemento`
  - `bairro`
  - `cidade`
  - `uf`

## Regras

- A API deve resolver `contaId` e `usuarioId` pelo contexto autenticado.
- `pagador` e obrigatorio para criar novo checkout.
- `cpfCnpj` deve conter 11 ou 14 digitos apos normalizacao.
- `tipoPessoa=Fisica` exige 11 digitos; `tipoPessoa=Juridica` exige 14 digitos.
- `email` deve ter formato basico valido.
- `telefone` deve conter 10 ou 11 digitos nacionais.
- `cep` deve conter 8 digitos.
- `uf` deve conter 2 letras.
- Cartao de credito deve ser metodo ativo, mas sem captura de dados de cartao na API.
- A criacao do customer Asaas deve enviar dados fiscais/de contato do pagador.
- Se a assinatura ja tiver `ProviderCustomerId`, o provider deve atualizar o customer antes de criar a assinatura.

## Fora de escopo

- Capturar ou armazenar dados de cartao no Emprely.
- Consulta automatica de CEP.
- Migrar o fluxo para Asaas Checkout API.

## Testes obrigatorios

- Criar checkout sem pagador deve falhar.
- Criar checkout anual deve enviar ciclo, valor anual e dados normalizados do pagador.
- Criar checkout com cartao deve ser permitido e enviado ao provider como metodo hospedado.
- Suite `dotnet test apps/api/Emprely.sln` deve passar.

## Deploy 2026-07-08

- `pnpm lightsail:asaas:prod`
- `pnpm lightsail:env:validate`
- `pnpm lightsail:api:build`
- `scripts/deploy-lightsail-api-image.ps1`
- Validado em producao:
  - `https://api.emprely.com.br/health/live`: HTTP 200.
  - `https://api.emprely.com.br/health/ready`: HTTP 200.
