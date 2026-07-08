# Obsidian update - Billing sem duplicidade na tela de plano

Data: 2026-07-08

## Entrega

- Tela `Plano e pagamento` revisada para mostrar plano atual, validade, proxima cobranca e status de pagamento sem cortar texto.
- Estados tecnicos de billing passam a aparecer com label legivel, como `Aguardando Pagamento`.
- CTA principal alterado de `Ir para o checkout Asaas` para `Realizar Pagamento`.
- Links de cobranca alterados para `Abrir Comprovante`.
- Quando existe cobranca aberta, o app nao exibe formulario para novo pagamento e orienta o usuario a aguardar confirmacao do Asaas ou abrir o comprovante.
- Quando o plano/ciclo selecionado ja esta ativo, o app nao permite pagar novamente o mesmo ciclo.
- Formulario de pagador simplificado para exigir apenas tipo de pessoa, nome/razao social e CPF/CNPJ.

## API

- `BillingPagadorRequest` e `PagadorPagamentoRequest` agora aceitam e-mail, telefone e endereco como opcionais.
- Validacao obrigatoria ficou restrita a tipo de pessoa, nome/razao social e CPF/CNPJ valido.
- Foi adicionado teste de integracao para checkout com pagador minimo.

## Decisao sobre pagamento publico

Conta vencida ou inadimplente deve continuar podendo entrar no app e acessar billing. Uma pagina publica sem login deve ser criada somente como V2 por link assinado e expiravel, sem busca aberta por e-mail/CPF.

## Validacao

- `dotnet test apps/api/Emprely.sln`: aprovado, 112 testes.
- `pnpm lint:web`: aprovado.
- `pnpm web:build:beta`: aprovado.
- `pnpm test:e2e:web`: aprovado, 6 testes.
- Deploy API Lightsail: concluido e container healthy.
- Deploy web S3/CloudFront: concluido, invalidacao criada.
- Smoke producao:
  - `https://api.emprely.com.br/health/live`: 200
  - `https://api.emprely.com.br/health/ready`: 200
  - `https://app.emprely.com.br`: 200 com bundle atualizado.
