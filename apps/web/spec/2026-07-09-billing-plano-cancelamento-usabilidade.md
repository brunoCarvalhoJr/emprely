# Spec - Plano e cancelamento de renovacao

## Objetivo

Melhorar a usabilidade da tela `Plano e pagamento`, removendo CTA duplicado de comprovante e deixando claro que `Cancelar renovacao` cancela apenas a proxima renovacao, sem cortar o acesso do periodo atual.

## Regras

1. O botao `Cancelar renovacao` aparece somente quando existe assinatura ativa e `cancelAtPeriodEnd` ainda e falso.
2. Quando `cancelAtPeriodEnd` for verdadeiro, a tela nao mostra o botao de cancelar e exibe:
   `A renovacao foi cancelada. Para voltar depois do periodo atual, inicie um novo plano.`
3. O aviso de cancelamento deve informar que o acesso segue ate a validade atual quando houver data disponivel.
4. Pagamento aberto (`AguardandoPagamento`, `EmAnalise` ou `Vencido`) bloqueia novo formulario de pagamento.
5. Plano/ciclo vigente bloqueia novo pagamento do mesmo ciclo.
6. A cobranca aberta deve ter no maximo um CTA destacado `Abrir Comprovante`.
7. `Cobranca atual` deve exibir os dados da cobranca sem duplicar o CTA principal.
8. Historico pode manter links discretos `Abrir Comprovante`.
9. O layout deve se organizar em blocos escaneaveis:
   - resumo do plano;
   - cobranca atual;
   - pagamento.
10. A tela deve funcionar em desktop e mobile sem cortar labels/status.

## Criterios de pronto

- `pnpm lint:web` passa.
- `pnpm web:build:beta` passa.
- Tela de plano nao renderiza dois botoes destacados `Abrir Comprovante` para a mesma cobranca atual.
- Mensagem de cancelamento usa `novo plano`.
