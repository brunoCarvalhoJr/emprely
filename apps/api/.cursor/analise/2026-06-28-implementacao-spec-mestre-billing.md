# Analise - Implementacao da spec mestre de billing

## Contexto

A spec mestre `spec/2026-06-28-billing-spec-mestre-emprely.md` fechou o comportamento esperado para billing do Emprely. A API ja possui uma implementacao Asaas local, mas ainda ha divergencias com a spec:

- catalogo com precos antigos;
- webhook processando dentro do request;
- mapeamento generico de `REFUND`;
- ativacao administrativa legada fora de billing;
- ausencia de concessao manual auditada;
- sync por conta sem assinatura remota;
- risco de inadimplencia antes dos 3 dias;
- contratos/admin ainda incompletos para historico e credito manual.

## Escopo desta implementacao

- Ajustar precos oficiais.
- Tornar webhook apenas persistente no request e processado por worker.
- Separar reembolso parcial e integral.
- Transformar ativacao admin legada em credito manual auditado.
- Adicionar credito manual por Super Admin no billing admin.
- Respeitar tolerancia de inadimplencia de 3 dias.
- Melhorar sync por conta para eventos por assinatura remota.
- Atualizar testes e documentacao operacional afetada.

## Fora do escopo

- Cartao de credito ativo.
- Pix Automatico bancario.
- Microservico de billing.
- Proration.
- Nota fiscal.
