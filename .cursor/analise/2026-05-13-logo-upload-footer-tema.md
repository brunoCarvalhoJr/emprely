# Analise - Ajustes frontend e logo da conta

## Contexto

A tarefa cruza web e API: layout do rodape, asset de marca para tema escuro, upload de logomarca de conta e texto de WhatsApp.

## Decisao principal

Nao salvar imagem como `data URL` no banco. A melhor abordagem para o MVP e processar no servidor, salvar arquivo WebP otimizado e persistir apenas a referencia em `PerfilConta.LogoUrl`.

## Apps impactados

- `apps/web`
- `apps/api`

## Aceite

- SDD especificado nos apps afetados.
- Frontend e API validam com comandos reais.
