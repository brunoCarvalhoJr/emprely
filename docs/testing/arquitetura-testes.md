# Arquitetura de testes do Emprely

Este documento define a estrategia oficial de testes do Emprely para o MVP e a
evolucao para SaaS multiplataforma. A regra principal e simples: testar mais cedo
na camada mais barata possivel e subir para E2E, mobile real, carga ou seguranca
quando o risco justificar.

## Stack atual

| Superficie | Stack atual | Suite atual | Comando |
|---|---|---|---|
| API | .NET 9, ASP.NET Core, Clean Architecture, EF Core | xUnit unitario e integracao | `pnpm test:api` |
| Web app | React 19, Vite, TypeScript, Tailwind | Playwright E2E | `pnpm test:e2e:web` |
| Landing | Projeto externo referenciado pelo monorepo | check/build | `pnpm landing:check`, `pnpm landing:build` |
| Mobile | Placeholder Expo futuro | ainda nao implementado | ainda nao ha gate |
| Deploy beta | S3/CloudFront, Lightsail, Neon, SES | validacoes de build/env/runtime | `pnpm validate:beta`, `pnpm validate:mvp` |

## Principios

- **Risco primeiro:** priorize probabilidade, impacto e dificuldade de deteccao.
- **Piramide pratica:** muito unitario, integracao suficiente, pouco E2E critico.
- **Contrato explicito:** mudancas de shape API/web precisam de teste na camada
  de contrato, integracao ou E2E mockado.
- **Estado isolado:** cada teste deve criar sua propria massa e nao depender de
  execucao anterior.
- **Mocks seletivos:** mockar API externa ou instavel; preservar alguns fluxos
  representativos contra a stack real.
- **Evidencia em falha:** E2E deve manter trace/screenshot/log util para triagem.
- **Sem secrets:** testes nunca devem exigir credenciais reais versionadas.
- **SDD sempre:** toda feature deve declarar a estrategia de teste na spec.

## Camadas oficiais

| Camada | Objetivo | Onde fica | Quando usar | Gate atual |
|---|---|---|---|---|
| Unitario de dominio | Regras puras, validacoes, calculos, estados | `apps/api/tests/Emprely.UnitTests` | toda regra de negocio nova | `pnpm test:api` |
| Integracao API | Controller, DI, EF, auth, serializacao e persistencia juntos | `apps/api/tests/Emprely.IntegrationTests` | endpoint, fluxo ou contrato HTTP | `pnpm test:api` |
| E2E web smoke | Jornada critica do usuario no navegador | `apps/web/e2e` | fluxo MVP, sessao, CRUD, proposta | `pnpm test:e2e:web` |
| Build/lint | Evitar regressao estrutural | scripts raiz e apps | todo PR | `pnpm validate` |
| Deploy/runtime | Validar env, Docker, beta e health | `scripts/`, `infra/`, runbooks | pre-release e deploy | `pnpm validate:beta`, `pnpm validate:mvp` |
| Acessibilidade | Teclado, labels, foco, contraste e semantica | futuro Playwright/axe/manual | mudanca de UI critica | recomendado |
| Performance | Web Vitals e budgets de API/web | futuro CI/RUM | fluxos de alto trafego | recomendado |
| Seguranca | ASVS/MASVS, SAST, DAST, secrets, headers | futuro CI + checklist | auth, dados, upload, admin | recomendado |
| Mobile/offline | Rede, permissao, touch, viewport, sync | futuro app/mobile | quando mobile sair do placeholder | futuro |

## Fluxos criticos do MVP

| Fluxo | Risco principal | Cobertura minima |
|---|---|---|
| Cadastro, confirmacao de email e login | bloqueio de acesso, sessao invalida | integracao API, E2E web smoke |
| Reset/troca de senha | falha de recuperacao, token invalido | unitario de regras, integracao API, E2E focalizado |
| Sessao expirada/401 | usuario preso ou dado obsoleto | E2E web com storage/API mockada |
| Trial, bloqueio e plano fundador | acesso indevido ou bloqueio errado | unitario dominio, integracao API, E2E quando impactar UI |
| Clientes | perda de dados comerciais | unitario dominio, integracao API, E2E smoke |
| Servicos/pacotes | precificacao incorreta | unitario dominio, integracao API, E2E smoke |
| Propostas | fluxo central de valor do produto | unitario dominio, integracao API, E2E critico |
| Gerar/enviar proposta | falha no momento de entrega ao cliente | integracao API, E2E web, smoke pre-release |
| Personalizacao/logomarca | marca errada, arquivo indisponivel | integracao API/storage, E2E focalizado |
| Emails transacionais | usuario nao confirma ou nao recupera conta | unitario template, integracao provider fake/SES sandbox |
| Suporte publico | lead perdido, spam, abuso | integracao API, rate limit, smoke web |
| Admin usuarios/planos/emails | permissao indevida, impacto operacional | integracao autorizacao, E2E restrito |

## Matriz de risco

Use esta escala nas analises SDD:

| Campo | Escala | Como interpretar |
|---|---:|---|
| Probabilidade | 1 a 5 | chance de quebrar pela mudanca |
| Impacto | 1 a 5 | dano para usuario, receita, dados ou operacao |
| Detectabilidade | 1 a 5 | 5 significa dificil perceber antes de producao |
| Exposicao | multiplicacao | `Probabilidade x Impacto x Detectabilidade` |

| Exposicao | Acao minima |
|---:|---|
| 1 a 12 | unitario ou checklist manual pode bastar |
| 13 a 30 | unitario + integracao ou E2E focalizado |
| 31 a 60 | cobertura em varias camadas + smoke obrigatorio |
| acima de 60 | pre-release hardening, rollback e observabilidade obrigatorios |

## Padrao para novas specs

Toda spec deve preencher a secao `Testes` com:

```txt
- Risco: baixo/medio/alto + motivo.
- Unitarios: regras cobertas ou justificativa para nao criar.
- Integracao API: endpoints/contratos cobertos ou justificativa.
- E2E web/mobile: jornada coberta ou justificativa.
- Acessibilidade/responsividade: quando houver UI.
- Seguranca/dados: quando houver auth, permissao, upload, admin ou dado sensivel.
- Validacao final: comandos reais a executar.
```

## Proximas evolucoes recomendadas

1. Adicionar teste de componente/unitario web com Vitest quando houver logica de
   UI complexa fora do backend.
2. Separar Playwright em perfis: smoke PR, regressao nightly e matriz expandida.
3. Adicionar axe-core no Playwright para paginas criticas.
4. Adicionar contrato de API quando o front e a API passarem a evoluir de forma
   mais independente.
5. Adicionar smoke contra `https://app.emprely.com.br` antes de rollout beta.
6. Adicionar observabilidade por release para erro, latencia, health, emails e
   funil de proposta.

## Referencias internas

- [Roteiros de testes](roteiros-testes.md)
- [Testes da API](../../apps/api/tests/README.md)
- [E2E web](../../apps/web/e2e/README.md)
- [Runbook beta](../product/beta-mvp-runbook.md)
- [Deploy beta/staging](../product/beta-staging-deploy.md)
