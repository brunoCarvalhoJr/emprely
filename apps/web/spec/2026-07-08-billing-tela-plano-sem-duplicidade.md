# Spec - Tela de plano sem duplicidade

## Objetivo

Melhorar a tela `Plano e pagamento` para que o usuario entenda plano atual, validade, cobranca atual e nao tente pagar o mesmo ciclo duas vezes.

## Regras de UI

1. Exibir status legiveis, por exemplo:
   - `AguardandoPagamento` -> `Aguardando Pagamento`
   - `CartaoCredito` -> `Cartao de credito`
2. O quadro superior deve mostrar:
   - plano atual
   - validade do plano atual
   - proxima cobranca
   - status de pagamento
3. O layout do status nao pode cortar palavras longas.
4. O botao principal deve ser `Realizar Pagamento`.
5. O link da cobranca atual e do historico deve ser `Abrir Comprovante`.
6. Se existir cobranca aberta (`AguardandoPagamento`, `EmAnalise` ou `Vencido`), nao exibir formulario de novo pagamento. Exibir estado de pagamento em andamento com link da cobranca quando disponivel.
7. Se o plano/ciclo selecionado ja estiver ativo e vigente, nao permitir novo pagamento do mesmo ciclo.
8. Se a cobranca falhou, permitir nova tentativa.
9. Campos obrigatorios do formulario:
   - tipo de pessoa
   - nome/razao social
   - CPF/CNPJ
10. Dados de cartao continuam sendo preenchidos somente no Asaas hospedado.

## Fora do escopo

- Pagina publica de pagamento sem login.
- Recuperacao de acesso por link assinado.

## Evolucao recomendada

Criar `/billing/pagar/:token` publico com token assinado, expiracao curta e validacao de conta no backend para usuarios que nao conseguem acessar a area autenticada.

## Criterios de pronto

- Tela nao permite visualmente pagar o mesmo ciclo com cobranca aberta ou plano ativo.
- Status aparecem legiveis.
- Formulario exige somente dados minimos.
- Build/lint do web passam.
