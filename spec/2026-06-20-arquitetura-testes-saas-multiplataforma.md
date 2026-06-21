# Spec - Arquitetura de testes SaaS multiplataforma

## Visao geral

Criar uma arquitetura de testes completa para o Emprely, baseada em camadas,
risco e rotinas operacionais. A entrega deve organizar a documentacao existente,
explicar como manter as suites atuais e definir os proximos roteiros de teste
para web, API, mobile futuro, seguranca, acessibilidade, performance e
producao.

## Escopo

Inclui:

- Guia central de arquitetura de testes em `docs/testing/`.
- Roteiros operacionais por janela: PR, merge, nightly, pre-release, producao e
  pos-incidente.
- Matriz de cobertura por fluxo critico do Emprely.
- Orientacao de manutencao para testes unitarios e de integracao da API.
- Orientacao de manutencao para Playwright E2E web.
- Correcao do wrapper `scripts/run-web-e2e.mjs` para nao retornar sucesso quando
  o Playwright reportar falha.
- Atualizacao do README raiz com link para a estrategia.

Fora do escopo:

- Instalar novas ferramentas.
- Reescrever testes existentes.
- Criar pipeline CI real.
- Definir fornecedores pagos de device farm, observabilidade ou seguranca.
- Alterar codigo funcional da API, web, landing ou mobile.

## Fluxo ponta a ponta

1. Desenvolvedor recebe US, bug ou decisao.
2. A analise SDD define risco, impacto e cobertura esperada.
3. A spec SDD lista testes obrigatorios por camada.
4. Implementacao adiciona ou ajusta testes na camada mais barata suficiente.
5. PR roda lint, build, unitarios, integracao leve e smoke E2E quando aplicavel.
6. Nightly amplia regressao, compatibilidade, acessibilidade e performance.
7. Pre-release roda hardening, migracao, smoke real e rollback rehearsal.
8. Producao usa canary/flags, observabilidade e rollback preparado.
9. Incidente gera regressao automatizada e ajuste de monitoramento.

## Requisitos

- R01: A documentacao deve refletir os comandos reais do monorepo.
- R02: A estrategia deve priorizar testes por risco, nao por volume bruto.
- R03: A arquitetura deve separar unitario, integracao, contrato, E2E, visual,
  acessibilidade, seguranca, performance, carga, mobile/offline e observabilidade.
- R04: Os roteiros devem declarar frequencia, comando, gate e criterio de aceite.
- R05: As suites atuais de API e web devem ter README proprio com padroes de
  manutencao.
- R06: A documentacao deve evitar obrigar ferramentas ainda nao instaladas.
- R07: A entrega deve preservar a arquitetura modular do monorepo.
- R08: A entrega deve manter secrets fora do repositorio.
- R09: O wrapper E2E deve retornar erro se a saida do Playwright indicar teste
  marcado como `x`, `failed` ou resumo com falha.

## Regras de negocio

- Login, sessao, cadastro, confirmacao de email, reset de senha, trial,
  clientes, servicos, propostas, geracao/envio, personalizacao e suporte publico
  sao fluxos criticos do MVP.
- Autorizacao, dados de conta, logs, emails e arquivos/logos sao areas sensiveis.
- Qualquer mudanca em contrato API/web deve atualizar pelo menos integracao ou
  E2E mockado correspondente.
- Mudancas visuais em fluxo critico devem considerar responsividade mobile.

## Impactos por projeto

- API: documentar xUnit unitario/integracao, massa de teste, isolamento e limites
  do provider InMemory.
- Web: documentar Playwright, mocks de API, locators acessiveis, traces e matriz
  futura de browser/mobile.
- Mobile: registrar estrategia futura com Expo/React Native, Appium/Detox como
  candidatos e foco em permissao/rede/sync quando houver app.
- Landing: smoke de build e navegacao publica, sem mover landing existente.
- Packages: unitarios quando houver regra compartilhada.
- Infra: gates e rotinas CI/CD.

## Criterios de aceite

- A arquitetura de testes esta documentada em `docs/testing/arquitetura-testes.md`.
- Os roteiros operacionais estao documentados em `docs/testing/roteiros-testes.md`.
- `apps/api/tests/README.md` explica como manter unitarios e integracao.
- `apps/web/e2e/README.md` explica como manter os E2E Playwright.
- `scripts/run-web-e2e.mjs` nao mascara falha Playwright como sucesso.
- O README raiz aponta para os novos documentos.
- Nenhuma alteracao funcional e feita no produto.

## Estrategia de implementacao

- Criar documentos novos em Markdown com linguagem operacional.
- Reutilizar comandos existentes do `package.json`.
- Manter recomendacoes futuras separadas de gates obrigatorios atuais.
- Usar tabelas compactas para cobertura, rotina e criterios.
- Ajustar o detector de saida do wrapper E2E para registrar falha antes de
  finalizar com sucesso por contagem de testes `ok`.

## Testes

- Validacao documental por leitura dos arquivos criados.
- `git diff --check` para detectar problemas de whitespace.
- `pnpm test:api` para confirmar suites .NET.
- `pnpm test:e2e:web` para confirmar que o wrapper nao mascara falhas.
