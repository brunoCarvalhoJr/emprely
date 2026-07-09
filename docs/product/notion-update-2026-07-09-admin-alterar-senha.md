# Notion update - Admin altera a propria senha

Data: 2026-07-09

## Decisao

O painel `/admin` agora possui fluxo autenticado para o administrador logado trocar a propria senha sem depender de script, banco ou arquivo secreto.

## Implementado

- API: `POST /api/admin/auth/password`.
- Request: `senhaAtual`, `novaSenha`, `confirmarNovaSenha`.
- Regras: exige JWT admin, valida admin ativo, valida senha atual, exige nova senha com pelo menos 8 caracteres e confirmacao igual.
- Auditoria: registra `AdminAlterarSenhaPropria` no alvo `AdminUsuario` sem gravar senha.
- Web: area "Seguranca da conta" dentro do `/admin`, visivel para `SuperAdmin` e `Suporte`.
- SDD: analise e spec criadas em `apps/api` e `apps/web`.

## Validacao

- `dotnet test apps/api/Emprely.sln`: passou.
- `pnpm lint:web`: passou.
- `pnpm web:build:beta`: passou.
- Deploy API Lightsail: concluido, container healthy.
- Deploy web S3/CloudFront: concluido com invalidacao criada.
- Smoke publico:
  - `https://api.emprely.com.br/health/live`: 200.
  - `https://api.emprely.com.br/health/ready`: 200.
  - `https://app.emprely.com.br/admin`: 200.
  - `POST /api/admin/auth/password` sem token: 401.

## Observacao operacional

A senha temporaria local usada no reset anterior nao autenticou mais no smoke autenticado. Nenhuma senha real foi registrada na documentacao.
