# Spec - Billing sem duplicidade e pagador minimo

## Objetivo

Evitar duplicidade de pagamento perceptivel no fluxo de billing e permitir checkout Pix/cartao com apenas os dados realmente necessarios do pagador.

## Escopo

- API de criacao de checkout.
- Contratos de billing.
- Integracao Asaas existente.
- Teste automatizado do checkout com pagador minimo.

## Regras funcionais

1. Se existir pagamento aberto para a conta/plano/ciclo/metodo, a API deve devolver o checkout existente.
2. Se existir assinatura paga vigente no mesmo ciclo, a API deve bloquear novo checkout.
3. Para criar checkout, os campos obrigatorios do pagador sao:
   - `tipoPessoa`
   - `nome`
   - `cpfCnpj`
4. `cpfCnpj` deve ter 11 digitos para pessoa fisica e 14 digitos para pessoa juridica.
5. `email`, `telefone`, `cep`, `endereco`, `numero`, `complemento`, `bairro`, `cidade` e `uf` sao opcionais.
6. Campos opcionais devem ser validados apenas quando preenchidos.
7. O e-mail da conta continua sendo usado como fallback para o cliente Asaas quando o pagador nao informar e-mail.

## Fora do escopo desta entrega

- Pagamento publico sem login.
- Link assinado de recuperacao de billing.
- Mudanca de regras de entitlements.

## Evolucao recomendada

Criar uma pagina publica de pagamento apenas com token assinado gerado pelo backend, expiracao curta e vinculo explicito com a conta. O fluxo deve evitar busca aberta por e-mail/CPF.

## Criterios de aceite

- Checkout Pix/cartao pode ser iniciado com tipo de pessoa, nome e CPF/CNPJ.
- Checkout sem CPF/CNPJ valido continua bloqueado.
- Checkout duplicado no mesmo ciclo continua bloqueado ou reaproveitado conforme status.
- Testes da API passam.
