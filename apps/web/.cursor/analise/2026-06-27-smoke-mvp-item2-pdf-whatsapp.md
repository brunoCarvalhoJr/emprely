# Analise - smoke MVP item 2: PDF, imagem e WhatsApp

Data: 2026-06-27

## Contexto

Durante o smoke MVP em producao com usuario de teste autenticado, a API permitiu criar cliente, servico, proposta, gerar proposta e marcar envio apos concessao de dias gratis na conta de teste pelo admin.

Na interface, porem, propostas com status `Gerada` e `Enviada` continuaram com as acoes de PDF e WhatsApp desabilitadas. O banner tambem mostrava trial expirado, embora o backend retornasse `statusComercial: TrialAtivo`.

## Causa provavel

O frontend recalculava o status comercial efetivo usando `trialEndsAt` localmente. Como dias gratis sao avaliados no backend, uma conta pode vir da API como `TrialAtivo` mesmo com `trialEndsAt` anterior.

## Decisao

Tratar `conta.statusComercial` retornado pela API como fonte de verdade para liberar exportacao e compartilhamento. Usar `trialEndsAt` apenas como fallback quando o status comercial nao for reconhecido.

## Aceite

- Conta `TrialAtivo` retornada pela API pode gerar, exportar PDF/imagem e abrir compartilhamento WhatsApp.
- Banner deixa de mostrar "expirado" para conta `TrialAtivo` com `trialEndsAt` antigo.
- Conta `TrialExpirado` continua bloqueando geracao/exportacao quando a API retornar esse status.
