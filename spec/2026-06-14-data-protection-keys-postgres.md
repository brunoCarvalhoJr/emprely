# Spec - Persistencia de Data Protection keys no Postgres

## Visao geral

Persistir as Data Protection keys da API no PostgreSQL/Neon para proteger a validade dos links de confirmacao de email, reset de senha e alteracao de email apos restart, cold start, troca de instancia ou redeploy.

## Escopo

Inclui:

- Configurar Data Protection para usar EF Core.
- Usar o `EmprelyDbContext` como storage de keys.
- Criar tabela `data_protection_keys` via migration EF Core.
- Manter application name estavel como `Emprely`.
- Atualizar docs de deploy/checklist.
- Atualizar Notion e Obsidian.

Fora do escopo:

- Migrar keys para S3, Parameter Store ou Secrets Manager.
- Criar rotacao manual customizada de chaves.
- Alterar lifetime dos tokens.
- Alterar fluxos de confirmacao/reset no frontend.

## Fluxo ponta a ponta

1. Usuario solicita cadastro, reset de senha ou alteracao de email.
2. ASP.NET Identity gera token usando Data Protection.
3. Data Protection cria/le keys em `data_protection_keys`.
4. API envia link por email.
5. Depois de restart/deploy, API recupera a mesma key ring do banco.
6. Usuario clica no link e o token continua validavel dentro do prazo.

## Requisitos

- R01: `EmprelyDbContext` deve implementar storage EF Core de Data Protection keys.
- R02: A tabela de keys deve ser versionada por migration.
- R03: A API deve registrar Data Protection com `PersistKeysToDbContext<EmprelyDbContext>()`.
- R04: O application name deve ser fixo e estavel entre deploys do mesmo ambiente.
- R05: O beta real deve aplicar a migration antes de validar links reais.
- R06: Nenhum secret deve ser versionado.

## Regras de negocio

- Links enviados por email nao devem quebrar por restart/deploy enquanto estiverem dentro do prazo de validade.
- O banco Neon Free e a fonte duravel inicial para as keys no MVP.
- Cada ambiente deve usar banco proprio para evitar compartilhar key ring por acidente.

## Impactos por projeto

- API: package, DbContext, registro de servico e migration.
- Web: sem impacto direto.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: migrations precisam rodar no Neon antes da liberacao beta.

## Criterios de aceite

- CA01: Build da API passa.
- CA02: Testes da API passam.
- CA03: Migration cria `data_protection_keys`.
- CA04: Busca textual confirma `PersistKeysToDbContext<EmprelyDbContext>()`.
- CA05: Docs e rastreadores registram que Data Protection keys foram persistidas no banco.

## Estrategia de implementacao

1. Adicionar package `Microsoft.AspNetCore.DataProtection.EntityFrameworkCore`.
2. Implementar `IDataProtectionKeyContext` no DbContext.
3. Registrar Data Protection na camada de infraestrutura.
4. Gerar migration EF Core.
5. Atualizar docs/rastreadores.
6. Rodar build/testes.

## Testes

- `dotnet build apps/api/Emprely.sln --no-restore`
- `dotnet test apps/api/Emprely.sln --no-restore`
- `rg -n "PersistKeysToDbContext|data_protection_keys|DataProtectionKeys" apps/api/src docs spec`
