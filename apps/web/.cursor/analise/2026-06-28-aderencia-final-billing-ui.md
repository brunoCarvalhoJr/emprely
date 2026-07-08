# Analise Web - aderencia final billing UI

## Problema

A tela de plano atual permite iniciar checkout e cancelar renovacao, mas nao exibe todos os dados operacionais exigidos pela spec mestre: pagamento atual, pendencia com link, historico dos ultimos 12 meses e mensagens por estado.

## Decisao de UX

Manter uma tela densa e operacional dentro do app, sem visual de landing. A experiencia deve priorizar leitura rapida do estado atual e a proxima acao segura.

## Aceite

- Exibir plano, assinatura, pagamento atual, ciclo, valor, metodo, periodo e proxima cobranca.
- Exibir link para pagar quando existir cobranca pendente.
- Exibir historico dos ultimos 12 meses.
- Cartao deve aparecer desabilitado quando vier como metodo inativo.
- Cancelamento deve continuar disponivel apenas quando a assinatura permitir.
