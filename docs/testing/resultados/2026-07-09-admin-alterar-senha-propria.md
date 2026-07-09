# Resultado de teste - Admin altera a propria senha

Data: 2026-07-09

## Escopo

Validar endpoint e UI para troca da propria senha administrativa no `/admin`.

## Testes locais

- `dotnet test apps/api/Emprely.sln`: 118 testes passaram.
- Teste novo `AdminAuth_DeveAlterarPropriaSenhaComSenhaAtual` cobre:
  - senha atual incorreta retorna `400`;
  - senha atual correta retorna `204`;
  - senha antiga deixa de autenticar;
  - senha nova autentica.
- `pnpm lint:web`: passou.
- `pnpm web:build:beta`: passou.

## Deploy

- API publicada no Lightsail com container `Healthy`.
- Web publicado em S3 `emprely-app-web`.
- Invalidation CloudFront criada para `E1NWXIL7S19BU1`.

## Smokes producao

- `GET https://api.emprely.com.br/health/live`: 200.
- `GET https://api.emprely.com.br/health/ready`: 200.
- `GET https://app.emprely.com.br/admin`: 200.
- `POST https://api.emprely.com.br/api/admin/auth/password` sem token: 401.

## Limitacao

Nao foi feita troca real da senha do admin de producao. A senha temporaria local do reset anterior nao autenticou no smoke autenticado, entao a validacao mutacional ficou coberta pelo teste de integracao.
