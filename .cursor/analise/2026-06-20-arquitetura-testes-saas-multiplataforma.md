# Analise - Arquitetura de testes SaaS multiplataforma

## Contexto

Demanda criada a partir de pesquisa de melhores praticas para testes em SaaS
desktop/mobile. O Emprely ja possui testes unitarios e de integracao na API
.NET, alem de uma suite Playwright E2E para o webapp React/Vite. Ainda falta uma
orientacao central que conecte camadas, rotinas, risco, CI/CD, documentacao dos
roteiros e criterios de aceite para beta e pre-release.

## Objetivo

Transformar a estrategia de testes do Emprely em uma arquitetura documentada,
pratica e aplicavel ao monorepo atual, evitando a dependencia excessiva de E2E e
priorizando cobertura por risco.

## Projetos impactados

- API: documentacao das suites `Emprely.UnitTests` e `Emprely.IntegrationTests`.
- Web: documentacao da suite Playwright em `apps/web/e2e`.
- Mobile: diretriz para cobertura futura Expo/React Native.
- Landing: diretriz de smoke e build, sem alterar implementacao.
- Packages: diretriz de unitarios por pacote quando houver logica propria.
- Infra: orientacao de gates CI/CD, nightly, pre-release, canary e rollback.

## Fluxo atual

- `pnpm test:api` executa `dotnet test apps/api/Emprely.sln`.
- `pnpm test:e2e:web` executa o wrapper `scripts/run-web-e2e.mjs`.
- `pnpm validate` cobre lint/build web e build/test API.
- `pnpm validate:beta` adiciona E2E web e validacao Docker.
- Existem specs pontuais para corrigir wrapper E2E e logging de integracao.
- Nao existe uma documentacao central dos tipos de teste, rotinas, matriz de
  cobertura, criterios de manutencao e roteiros de regressao.
- Durante a validacao desta tarefa, `pnpm test:e2e:web` retornou exit code 0
  mesmo com um teste Playwright marcado como `x`, porque o wrapper considerava
  sucesso ao ver o ultimo indice `ok` igual ao total esperado.

## Fluxo proposto

1. Manter unitarios e integracao leve como feedback principal de PR.
2. Usar E2E como smoke critico do MVP, com poucos fluxos de negocio de alto
   risco.
3. Documentar matriz de risco e cobertura por fluxo: autenticacao, trial,
   clientes, servicos, propostas, personalizacao, emails e suporte publico.
4. Separar rotinas de PR, merge, nightly, pre-release, producao e pos-incidente.
5. Orientar expansao futura para acessibilidade, contrato de API, performance,
   seguranca, mobile real e observabilidade.

## Regras de negocio

- Fluxos que bloqueiam acesso, vazam dados, quebram criacao de proposta,
  comprometem cobranca/trial ou impactam comunicacao com cliente devem ter
  prioridade maxima.
- Uma falha E2E de fluxo critico deve bloquear release ate triagem.
- Testes unitarios devem cobrir regras de dominio antes de subir cobertura para
  integracao ou E2E.
- Testes E2E devem validar jornada real, nao detalhes internos de componente.

## Impactos tecnicos

- Criar documentacao central em `docs/testing/`.
- Criar READMEs proximos das suites existentes para reduzir ambiguidade.
- Atualizar README raiz para apontar para a nova estrategia de testes.
- Corrigir o wrapper E2E para nao mascarar falhas reais do Playwright.
- Nao alterar codigo de produto nesta rodada.

## Riscos

- A estrategia ficar abstrata demais e nao orientar PRs reais.
- Aumentar expectativa de ferramentas ainda nao instaladas no repo.
- Criar roteiros que dependam de ambientes externos sem explicar frequencia e
  criterio de execucao.
- Confundir smoke, sanity e regressao ampla.

## Duvidas

- Quais browsers/devices serao oficialmente suportados no primeiro beta publico?
- Havera app mobile nativo no MVP ou apenas web responsivo/PWA?
- Qual plataforma de CI sera adotada primeiro para nightly e pre-release?
- Quais metricas de producao serao usadas inicialmente: Sentry, OpenTelemetry,
  CloudWatch, outra ferramenta ou combinacao?
