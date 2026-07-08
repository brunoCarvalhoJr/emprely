# Analise - Tela de plano com status claro e sem duplicidade

## Contexto

O usuario pagou um mes via Pix e a tela continuou apresentando formulario e CTA de checkout. Mesmo quando a API nao cria necessariamente uma cobranca duplicada, a interface gera inseguranca porque nao separa plano ativo, cobranca pendente e historico.

## Problemas de UX

- `Status atual` corta texto longo como `AguardandoPagamento`.
- Estados aparecem como enum tecnico, sem espaco.
- O botao principal diz `Ir para o checkout Asaas`, texto tecnico e pouco orientado ao usuario.
- A cobranca atual usa `Abrir checkout`, mas o usuario espera comprovante/link da cobranca.
- O formulario pede endereco completo, telefone e e-mail como obrigatorios, aumentando atrito.
- A tela nao mostra com destaque validade do plano atual e proxima cobranca.
- Nao ha indicacao clara de que uma cobranca em andamento deve ser aguardada/reaberta, em vez de iniciar outro pagamento.

## Decisoes

- Exibir um resumo superior com plano atual, validade, proxima cobranca e status de pagamento.
- Formatar enums de billing em portugues legivel.
- Quando houver cobranca aberta, ocultar o formulario de nova compra e exibir estado de pagamento em andamento com link `Abrir Comprovante`.
- Quando o plano/ciclo selecionado ja estiver ativo, ocultar pagamento duplicado e exibir validade.
- Reduzir formulario do pagador aos campos obrigatorios: tipo de pessoa, nome/razao social e CPF/CNPJ.
- Trocar CTA principal para `Realizar Pagamento`.

## Pagamento sem login

Conta vencida ou inadimplente deve continuar podendo acessar o app e a tela de billing autenticada. Caso seja necessario pagar sem login, a solucao correta e uma pagina publica por link assinado, nao uma busca aberta por e-mail.
