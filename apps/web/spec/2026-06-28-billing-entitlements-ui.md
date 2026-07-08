# Spec - billing entitlements UI

## Escopo

Ajustar as permissoes locais do app web para respeitar entitlements de billing quando a resposta `/api/billing/status` estiver disponivel.

## Regras

- `canExportPropostaConta` deve aceitar status de billing opcional.
- Se `billingStatus.entitlements.canExportProposta` estiver disponivel, esse valor prevalece sobre `conta.plano`.
- Watermark deve respeitar `billingStatus.entitlements.canRemoveWatermark` quando disponivel.
- O fallback antigo por conta permanece para estados sem billing carregado.

## Aceite

- Build web passa.
- Nenhum fluxo sem billing carregado quebra.
