# Roteiros de testes

Este documento transforma a arquitetura de testes em rotina executavel. Use-o
para decidir o que rodar em desenvolvimento, PR, nightly, pre-release, producao
e pos-incidente.

## Comandos atuais

| Comando | O que valida | Uso recomendado |
|---|---|---|
| `pnpm lint:web` | ESLint do webapp | PR com alteracao web |
| `pnpm build:web` | TypeScript + build Vite | PR com alteracao web |
| `pnpm test:e2e:web` | Playwright smoke do MVP | PR/release com fluxo web afetado |
| `pnpm build:api` | build da solution .NET | PR com alteracao API |
| `pnpm test:api` | unitarios + integracao API | PR com alteracao API |
| `pnpm validate` | lint/build web + build/test API | gate local geral |
| `pnpm validate:beta` | gate mais completo com E2E e Docker config | pre-release beta |
| `pnpm validate:mvp` | beta + deploy/lightsail config | prontidao MVP |
| `pnpm landing:check` | validacao da landing externa | PR de landing |
| `pnpm landing:build` | build da landing externa | pre-release landing |

## Rotina por janela

| Janela | Suite minima | Bloqueia? | Criterio de aceite |
|---|---|---|---|
| Commit local | testes da area alterada | nao, mas recomendado | feedback rapido antes do PR |
| PR API | `pnpm build:api`, `pnpm test:api` | sim | build verde e sem teste quebrado |
| PR web | `pnpm lint:web`, `pnpm build:web` | sim | lint/build verdes |
| PR fluxo critico web | PR web + `pnpm test:e2e:web` | sim | smoke Playwright verde |
| Merge em main | `pnpm validate` | sim | gate geral verde |
| Nightly | `pnpm validate:beta` + matriz futura | bloqueia release seguinte | falhas triadas ate o proximo release |
| Pre-release beta | `pnpm validate:mvp` + smoke real manual | sim | sem falhas criticas/altas abertas |
| Producao | canary/flags + health + logs | sim para rollout total | metricas saudaveis no periodo de observacao |
| Pos-incidente | regressao automatizada + monitoramento | sim para encerrar incidente | causa coberta por teste ou alerta |

## Smoke MVP atual

O smoke minimo do Emprely precisa confirmar:

- Login/sessao valida ou remocao de sessao invalida.
- Dashboard inicial renderizado.
- Cadastro de cliente.
- Cadastro de servico.
- Criacao de proposta.
- Geracao de proposta.
- Acao de WhatsApp visivel apos geracao.
- Configuracoes/perfil sem expor telas indevidas.
- Cadastro com confirmacao de email.
- Recuperacao de senha pelo fluxo interno.

Hoje esses pontos ficam principalmente em `apps/web/e2e/mvp-fluxo.spec.ts`.

## Sanity por tipo de mudanca

| Mudanca | Sanity minimo |
|---|---|
| Auth/sessao | login, 401, expiracao local, reset/confirmacao se afetados |
| Clientes | criar, listar, editar quando houver, validacoes principais |
| Servicos | criar, listar, preco/unidade/categoria |
| Propostas | criar rascunho, adicionar item, gerar, revisar total |
| Template/preview/PDF | preview visual, download/print quando aplicavel, responsivo |
| Mobile/responsivo | viewport 360px, tablet, desktop, navegacao touch/teclado |
| Admin | permissao, listagem, acao critica, auditoria/log quando houver |
| Email | template, link, copy pt-BR, fallback de provider |
| Deploy/env | health, CORS, URL publica, secrets ausentes no repo |

## Regressao pre-release

Antes de um beta publico ou release relevante:

1. Rodar `pnpm validate:mvp`.
2. Abrir webapp local ou staging e fazer smoke manual no fluxo de proposta.
3. Validar `GET /health/live` e `GET /health/ready` da API alvo.
4. Conferir envio real ou sandbox dos emails alterados.
5. Conferir upload/download de logomarca quando a release tocar storage.
6. Conferir dominio, CORS e `VITE_API_BASE_URL`.
7. Conferir se rollback de artefato ou feature flag esta claro.
8. Registrar falhas como bloqueante, nao bloqueante ou backlog.

## Matriz futura de compatibilidade

Enquanto o MVP for web responsivo, a matriz recomendada e:

| Nivel | Alvos |
|---|---|
| PR smoke | Chromium desktop |
| Nightly | Chromium desktop, Firefox desktop, WebKit desktop, viewport mobile Chromium |
| Pre-release | Chrome desktop, Edge desktop, Safari/WebKit, Android real ou em nuvem, iOS real ou em nuvem quando houver app/PWA relevante |
| Manual focalizado | dispositivos usados pelo time e por beta testers |

Nao adicione todos os alvos ao gate de PR sem medir duracao e flakiness.

## Acessibilidade

Checklist minimo para qualquer tela nova ou alterada:

- Controles com nome acessivel por label ou role.
- Navegacao por teclado sem foco preso ou perdido.
- Modal fecha por ESC e devolve foco.
- Mensagens de erro associadas ao campo.
- Contraste suficiente nos estados principais.
- Texto nao sobrepoe nem corta em 360px.

Automacao recomendada para evolucao: axe-core integrado ao Playwright nas paginas
criticas. Validacao humana continua necessaria.

## Seguranca e dados

Mudancas nestas areas exigem revisao extra:

- Auth, JWT, reset de senha, confirmacao de email.
- Multi-conta, papel, admin e trial.
- Upload/download de arquivos e logos.
- Rate limit, suporte publico e formularios anonimos.
- Logs, emails, dados pessoais, tokens e secrets.

Checklist minimo:

- Nenhum secret versionado.
- Nenhum dado sensivel em log.
- Erros de API nao vazam detalhe interno.
- Endpoints restritos validam usuario/conta/papel.
- CORS e cookies/tokens seguem o ambiente correto.

## Manutencao de flakiness

Um teste e flaky quando falha de forma intermitente sem mudanca de produto.
Tratamento:

1. Reproduzir localmente com trace/log.
2. Identificar se o problema e dado compartilhado, espera ruim, seletor fragil ou
   dependencia externa.
3. Corrigir a causa antes de aumentar retry.
4. Se retry for necessario, manter curto e registrar motivo.
5. Teste flaky em fluxo critico deve bloquear release ate triagem.

## Evidencias

Para falha de teste ou aceite manual, registre:

- comando executado;
- ambiente/URL;
- branch/commit quando disponivel;
- print, trace Playwright ou log;
- massa de teste usada;
- resultado esperado e resultado real;
- decisao: corrigir agora, aceitar risco ou jogar para backlog.
