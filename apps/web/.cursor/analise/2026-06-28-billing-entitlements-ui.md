# Analise - billing entitlements UI

## Contexto

O app web usava `conta.plano === "Fundador"` como atalho para liberar exportacao e remover watermark. Com billing recorrente, esse atalho pode liberar a UI mesmo depois de assinatura suspensa ou reembolsada.

## Risco

Mesmo com backend bloqueando a autoridade real de geracao/exportacao, a UI pode exibir estado incorreto e permitir acoes locais em propostas ja carregadas.

## Decisao

Quando o status de billing estiver disponivel, a UI deve usar `billingStatus.entitlements` como fonte para exportacao e watermark. O fallback por `ContaAtualResponse` continua apenas para telas sem status de billing carregado.
