# Analise - Admin emails no painel administrativo

## Contexto

Os endpoints `api/admin/emails` existem, mas validam apenas `X-Emprely-Admin-Key`. Para mover a UI para o painel `/admin`, o backend precisa aceitar tambem o token administrativo emitido pelo login admin.

## Decisao tecnica

- Manter a chave operacional como caminho compativel.
- Quando houver usuario autenticado com token administrativo, validar o contexto admin e exigir perfil `SuperAdmin`.
- Registrar auditoria no reenvio solicitado pelo painel.

## Criterios

- Chamadas com chave antiga continuam funcionando.
- Chamadas com token admin `SuperAdmin` passam.
- Chamadas sem chave e sem token continuam bloqueadas.
