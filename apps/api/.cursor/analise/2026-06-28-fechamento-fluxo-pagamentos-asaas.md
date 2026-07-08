# Analise - fechamento fluxo pagamentos Asaas

## Contexto

A revisao final do billing apontou falhas restantes em reativacao local, criacao de checkout dentro de transacao local, plano anual, escopo de sync, vencimento de cancelamento agendado, Pix recorrente, cartao, reembolso parcial e processamento de webhook.

## Decisoes

- Cliente nao pode reativar assinatura localmente; reativacao deve ser sempre novo checkout quando a recorrencia remota foi cancelada ou o periodo acabou.
- Checkout deve evitar chamada remota Asaas dentro de transacao local longa. A API deve persistir a tentativa local primeiro, chamar Asaas fora da transacao e vincular IDs depois.
- Plano Fundador passa a expor ciclos mensal e anual. Pix permanece ativo como cobranca recorrente hospedada no Asaas; cartao continua inativo ate tokenizacao segura.
- Periodo de acesso deve respeitar o ciclo contratado: mensal soma 1 mes, anual soma 1 ano.
- Sync admin por conta deve processar apenas eventos dessa conta ou eventos que possam ser resolvidos para essa conta, sem puxar eventos globais de outras contas.
- Cancelamento agendado vencido deve virar Cancelada, nao Inadimplente.
- Reembolso admin deve aceitar valor opcional, validar limite e registrar valor reembolsado.
- Webhook deve persistir e responder 200; processamento inline pode continuar como melhor esforco nesta V1, mas sem falhar a resposta.

## Duvidas assumidas

- O ciclo anual do Fundador sera preco anual fixo com desconto, sem cupom nesta etapa.
- Pix Automatico bancario fica fora do escopo; a recorrencia Pix desta etapa e por assinaturas/cobrancas recorrentes hospedadas no Asaas.
- Cartao de credito permanece visivel e bloqueado no app ate implementar tokenizacao.
