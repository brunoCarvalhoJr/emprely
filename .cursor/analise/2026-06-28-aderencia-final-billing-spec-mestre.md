# Analise - aderencia final billing spec mestre

## Contexto

A spec mestre `spec/2026-06-28-billing-spec-mestre-emprely.md` define o fluxo completo de billing do Emprely. A revisao de aderencia encontrou lacunas restantes na implementacao atual.

## Lacunas confirmadas

- Reembolso parcial via admin nao permite multiplos parciais depois que o pagamento vira `ReembolsadoParcial`.
- Restauracao admin nao considera credito manual vigente em `DiasGratisConta`.
- Reconciliacao diaria com Asaas ainda nao consulta estado remoto; o worker atual apenas reprocessa eventos locais.
- Emails essenciais de billing ainda nao cobrem vencimento, bloqueio, cancelamento e reembolso.
- Tela de plano do app nao exibe pagamento atual, link de pendencia e historico dos ultimos 12 meses.
- Processamento de webhook nao tem reserva de evento em processamento nem retry controlado.

## Decisoes

- Manter billing no monolito modular.
- Corrigir o minimo necessario para cumprir a spec mestre, sem microservico e sem cartao ativo.
- Estender contratos publicos de billing para expor pagamento atual e historico ao app.
- Implementar reconciliacao diaria via `BackgroundService` usando novos metodos de consulta remota no provedor Asaas.
- Manter Pix hospedado/recorrente como unico metodo ativo.

## Aceite

- Fluxos de reembolso parcial/integral, restauracao, reconciliacao, webhook, emails e UI devem estar cobertos por testes ou validacao real.
- Comandos reais da API e web devem passar.
