# Analise - Checkout com dados do pagador Asaas

## Contexto

O teste real de checkout encontrou falha na criacao da assinatura no Asaas quando o cliente remoto nao possuia CPF/CNPJ. O fluxo atual da API cria o customer com nome, e-mail e externalReference, mas nao recebe do app os dados fiscais e de contato necessarios para uma cobranca confiavel.

## Problema

- O contrato `CreateBillingCheckoutRequest` nao possui dados do pagador.
- O `AsaasProvedorPagamentos` nao envia `cpfCnpj`, telefone ou endereco ao criar o customer.
- O catalogo de billing bloqueia cartao de credito, mas o novo requisito pede escolha entre Pix e cartao.
- O app abre checkout diretamente pelo botao do metodo, sem formulario para CPF/CNPJ, tipo de pessoa e dados de contato.

## Decisoes

- O Emprely coletara dados do pagador antes de criar o checkout.
- O Emprely nao coletara numero, validade, CVV ou qualquer dado sensivel do cartao.
- Pix e cartao serao iniciados no Emprely, mas o pagamento continua hospedado no Asaas.
- A API validara os campos minimos antes de criar qualquer assinatura/cobranca.
- O provider Asaas enviara dados do pagador ao criar o customer e atualizara o customer existente antes de criar nova assinatura.

## Riscos

- Cartao recorrente via endpoint de assinatura do Asaas pode depender da experiencia hospedada disponibilizada pela invoice URL. Se o Asaas exigir checkout especifico para cartao em producao, a proxima evolucao deve trocar a criacao de assinatura direta pelo Asaas Checkout API.
- O cadastro de endereco no app e validado por obrigatoriedade/tamanho, sem consulta externa de CEP nesta entrega.

## Impacto tecnico

- Contratos publicos de billing.
- `BillingService` para validacao e normalizacao do pagador.
- `IProvedorPagamentos` e `AsaasProvedorPagamentos` para envio dos campos ao Asaas.
- Testes de integracao do billing para cobrir pagador obrigatorio e cartao hospedado.
