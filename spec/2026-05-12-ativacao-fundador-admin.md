# Spec - Ativacao Fundador Admin

## Visao geral

Fechar a brecha de autoativacao do Plano Fundador antes do beta, mantendo uma operacao manual interna enquanto billing real fica fora do MVP.

## Escopo

Inclui:

- Bloquear `POST /api/account/activate-founder` para usuarios comuns.
- Criar `POST /api/admin/accounts/{contaId}/activate-founder`.
- Exigir header `X-Emprely-Admin-Key`.
- Atualizar web para nao chamar autoativacao.
- Atualizar runbook e README.

Fora do escopo:

- Painel administrativo completo.
- Billing/checkout.
- Permissoes multiusuario avancadas.
- Prints, imagens e ajustes visuais.

## Fluxo ponta a ponta

1. Conta nasce Trial.
2. Usuario usa o MVP ate limite comercial do trial.
3. Operador decide ativar Fundador.
4. Operador chama endpoint admin com chave administrativa.
5. Conta passa para Fundador e a resposta confirma plano/status.

## Requisitos

- Rota antiga de autoativacao deve retornar 403.
- Rota admin deve retornar 401 sem header.
- Rota admin deve retornar 403 com chave incorreta.
- Rota admin deve retornar 503 se a chave administrativa nao estiver configurada.
- Rota admin deve retornar 404 para conta inexistente.
- Rota admin deve ativar Plano Fundador de forma idempotente.

## Regras de negocio

- Usuario autenticado nao pode ativar o proprio plano.
- Plano Fundador continua removendo bloqueio comercial.
- Chave administrativa deve ter ao menos 32 caracteres.

## Impactos por projeto

- API: controller admin, options e testes de integracao.
- Web: remover mutacao de autoativacao.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: documentar variavel `AdminOperacoes__OperationsKey`.

## Criterios de aceite

- `pnpm validate:beta` passa.
- Teste de integracao cobre autoativacao bloqueada.
- Teste de integracao cobre admin sem chave e com chave valida.
- Web nao mostra botao que chame autoativacao.
- Docs indicam como ativar Fundador manualmente por operacao admin.

## Estrategia de implementacao

- Criar `AdminOperacoesOptions`.
- Criar `AdminAccountsController`.
- Ajustar `AccountController`.
- Remover `activatePlanoFundador` do cliente web e seus usos.
- Atualizar docs.

## Testes

- `pnpm lint:web`
- `pnpm build:web`
- `pnpm test:e2e:web`
- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln`
- `pnpm validate:beta`
