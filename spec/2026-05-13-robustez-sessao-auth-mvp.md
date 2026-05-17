# Spec - Robustez sessao auth MVP

## Visao geral

Fechar comportamento minimo de sessao para beta: persistir expiração, limpar estado ao sair e derrubar sessão automaticamente quando o backend responder `401` em chamada autenticada.

## Escopo

Inclui:

- Persistir sessao web com `accessToken`, `expiresAtUtc`, usuario e conta.
- Descartar sessao vencida no carregamento.
- Programar encerramento local quando `expiresAtUtc` chegar.
- Emitir evento interno quando chamada autenticada receber `401`.
- Limpar cache, selecoes e formularios no logout.
- Testar `/api/me` sem token.

Fora do escopo:

- Refresh token.
- SSO.
- Recuperacao de senha.
- Billing.
- Prints, imagens e layout final.

## Fluxo ponta a ponta

1. Usuario faz login ou cadastro.
2. Web salva sessao completa em `localStorage`.
3. Web agenda expiração conforme `expiresAtUtc`.
4. Se a sessão expirar, web volta para login e exibe mensagem.
5. Se API retornar `401` em endpoint autenticado, web encerra sessão.
6. Logout manual limpa estado e cache sem mensagem de erro.

## Requisitos

- Login invalido nao deve exibir mensagem de sessão expirada.
- `403` comercial nao deve encerrar sessão.
- Sessao expirada no storage deve ser removida antes de renderizar area autenticada.
- Token legado deve continuar tentando `/api/me`, para nao quebrar usuario que ja estava logado antes da mudança.

## Regras de negocio

- Sessao invalida exige novo login.
- Dados carregados da conta nao devem permanecer depois de logout.

## Impactos por projeto

- API: teste de endpoint protegido.
- Web: `api.ts`, `App.tsx`, E2E.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: README/runbook.

## Criterios de aceite

- `pnpm validate:beta` passa.
- `GET /api/me` sem token retorna `401`.
- Web mostra "Sessao expirada. Entre novamente." quando sessão salva esta vencida.
- Web limpa localStorage e volta ao login quando chamada autenticada recebe `401`.
- Logout manual remove storage e estado.

## Estrategia de implementacao

- Criar helpers de sessão no `App.tsx`.
- Criar `ApiErro` e evento `emprely:sessao-invalida` no cliente HTTP.
- Atualizar E2E para cobrir sessão vencida.
- Atualizar docs.

## Testes

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `pnpm --dir apps/web test:e2e`
- `dotnet test apps/api/Emprely.sln`
- `pnpm validate:beta`
