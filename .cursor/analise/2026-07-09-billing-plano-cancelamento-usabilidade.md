# Analise - tela Plano e cancelamento de renovacao

Data: 2026-07-09

## Contexto

A tela `Plano e pagamento` mostra plano atual, pagamento em andamento e acao de cancelamento da renovacao do Plano Fundador. A revisao visual identificou dois problemas de usabilidade:

- o mesmo pagamento aberto aparece com dois botoes destacados `Abrir Comprovante`;
- a mensagem de renovacao cancelada fala em `novo checkout`, mas a linguagem correta para o usuario e iniciar um novo plano.

## Estado atual

- `POST /api/billing/cancel` ja cancela a recorrencia remota no Asaas, marca a assinatura local como `CancelamentoAgendado`, mantem acesso ate `PeriodoAtualFim` e envia e-mail.
- A UI esconde o formulario quando existe pagamento aberto ou quando o ciclo selecionado ja esta ativo.
- O card de pagamento em andamento e o card de cobranca atual podem renderizar CTAs iguais para a mesma `invoiceUrl`.

## Decisao

Manter o comportamento de backend. A mudanca deve ser apenas de UI/documentacao:

- separar melhor resumo do plano, cobranca atual e pagamento;
- manter apenas um CTA principal `Abrir Comprovante` para cobranca aberta;
- deixar o cancelamento descrito como cancelamento da proxima renovacao, com acesso mantido ate a validade atual.

## Fora do escopo

- Alterar regras de billing, webhook, Asaas, banco ou e-mails.
- Criar novo endpoint.
- Alterar checkout publico.
