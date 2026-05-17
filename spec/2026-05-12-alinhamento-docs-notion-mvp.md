# Spec - Alinhamento docs, Notion e MVP

## Objetivo

Corrigir desalinhamentos entre Notion, documentacao local e estado atual do monorepo Emprely, sem implementar nova funcionalidade de produto.

## Escopo

Inclui:

- Atualizar README da API com os endpoints atuais.
- Ajustar README do web para evitar duplicidade na stack.
- Atualizar copy do dashboard web sobre o fluxo ja implementado.
- Atualizar `.gitignore` para ignorar `.vs/`.
- Atualizar `.gitignore` para permitir `.env.example` em subpastas.
- Remover instrucao local Azure/Copilot conflitante.
- Atualizar Notion para refletir React/Vite e nucleo funcional em andamento.

Fora do escopo:

- Criar endpoints novos.
- Alterar schema/migrations.
- Alterar regras de proposta, cliente ou servico.
- Migrar landing para o monorepo.
- Implementar exportacao PDF, WhatsApp ou billing.

## Criterios de aceite

- Docs locais nao contradizem a decisao React/Vite.
- API README lista endpoints implementados ate agora.
- Dashboard web nao fala que o vinculo cliente-proposta ainda e futuro.
- `.vs/` deixa de aparecer como item a versionar.
- `apps/web/.env.example` deixa de ser ignorado.
- Instrucao Azure conflitante nao permanece no repo.
- Notion reflete que o frontend SaaS atual e React/Vite e que o nucleo funcional ja iniciou.
- Validacoes reais continuam passando.

## Validacao

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `git status --short`
