# Spec - correcoes Asaas billing

## Escopo

Corrigir os riscos encontrados na implementacao de pagamento Asaas sem alterar o modelo publico de produto.

## Regras

- Se existir assinatura local, o acesso pago depende do status da assinatura, nao apenas de `Conta.Plano`.
- Assinatura ativa ou com cancelamento agendado e periodo vigente bloqueia novo checkout.
- Pagamento aberto com mesma assinatura e mesmo metodo retorna a URL ja existente.
- Antes de criar nova assinatura remota para uma assinatura local sem acesso pago, cancelar a assinatura remota antiga quando houver `ProviderSubscriptionId`.
- Webhook `Processado` ou `Ignorado` permanece idempotente; webhook em `Erro` ou `Recebido` pode ser reprocessado.
- Webhook recorrente sem `externalReference` deve criar pagamento local pelo `ProviderSubscriptionId`.
- Reembolso automatico deve chamar refund remoto, cancelar recorrencia remota e suspender assinatura local.
- Reativacao local de assinatura cancelada, suspensa, reembolsada ou com cancelamento remoto pendente deve retornar conflito e orientar novo checkout.

## Aceite

- Build e testes da solucao API passam.
- Testes cobrem suspensao de acesso, checkout duplicado, webhook recorrente, retry de webhook e reembolso com cancelamento remoto.
