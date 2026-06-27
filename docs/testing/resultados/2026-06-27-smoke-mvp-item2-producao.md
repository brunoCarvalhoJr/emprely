# Smoke MVP item 2 - producao

Data/hora: 2026-06-27 00:16 -03:00

Ambiente: `https://app.emprely.com.br`

API: `https://api.emprely.com.br`

Ferramentas: MCP `chrome-devtools`, API real, painel admin de teste.

Usuario: usuario comum de teste `teste.codex.20260620@emprely.com.br` e admin de teste `admin.codex.20260620@emprely.com.br` (senhas nao registradas neste relatorio).

## Objetivo

Rodar smoke MVP completo do item 2: cadastro, confirmacao de e-mail, recuperacao de senha, perfil da conta, cliente, servico, proposta, PDF/imagem, WhatsApp, suporte, painel admin e mobile autenticado.

## Resultado geral

Smoke aprovado apos correcao e deploy do bloqueio de exportacao em conta trial ativa por dias gratis.

## Pre-condicao aplicada

A conta comum de teste estava com trial expirado no inicio do smoke. Pelo painel/API admin, foi concedida uma janela curta de dias gratis para a conta de teste, com motivo `Smoke MVP 20260627031007: liberar geracao da conta de teste`.

Antes da correcao, a API ja retornava `statusComercial: TrialAtivo`, mas o frontend rebaixava localmente para expirado por `trialEndsAt`. Isso bloqueava PDF/WhatsApp no app.

## Passes

- `GET https://app.emprely.com.br`: HTTP 200.
- `GET https://api.emprely.com.br/health/live`: HTTP 200.
- `GET https://api.emprely.com.br/health/ready`: HTTP 200, `Ready`.
- Admin login: HTTP 200.
- Admin `me`: HTTP 200.
- Login usuario comum confirmado: HTTP 200.
- Perfil da conta: HTTP 200.
- Cliente criado: `Cliente Smoke MVP 0627031007`, HTTP 201.
- Servico criado: `Servico Smoke MVP 0627031007`, HTTP 201.
- Proposta criada: `Proposta Smoke MVP 0627031007`, HTTP 201.
- Proposta gerada: HTTP 200, status `Gerada`.
- Proposta marcada como enviada: HTTP 200, status `Enviada`.
- Suporte autenticado: solicitacao criada, HTTP 200, status `Aberta`.
- Recuperacao de senha: solicitacao enviada, HTTP 204.
- Cadastro nova conta: solicitacao criada e aguardando confirmacao, HTTP 200.
- Admin usuarios: listagem e metricas carregaram.
- Admin emails: historico carregou e mostrou eventos recentes de `ConfirmacaoEmail`, `RecuperacaoSenha` e `SuporteRecebido`.
- Mobile autenticado: dashboard, navegacao inferior e drawer com Perfil/Suporte carregaram em 390x844.

## Falha encontrada e corrigida

### PDF/WhatsApp bloqueados para conta ativa por dias gratis

Sintoma:

- Proposta `#0127`, status `Gerada`, renderizava no modal.
- Menu de acoes mostrava `PDF`, `WhatsApp` e `Enviar` desabilitados.
- Modal mostrava botoes `Gere a proposta antes de baixar` e `Gere a proposta antes de enviar pelo WhatsApp`, mesmo com status `Gerada`.
- Banner mostrava `expirado em 26/06/2026, 23:25`, apesar da API retornar `TrialAtivo`.

Causa:

- O frontend recalculava `TrialExpirado` usando `trialEndsAt`, ignorando o `statusComercial` efetivo retornado pela API.

Correcao aplicada:

- `apps/web/src/App.tsx` agora respeita `conta.statusComercial` como fonte de verdade quando a API retorna `TrialAtivo`, `TrialExpirado` ou `FundadorAtivo`.
- Banner de conta ativa por concessao operacional mostra `ativo por dias gratis`.

Deploy:

- Build beta: `pnpm web:build:beta`.
- Asset publicado: `assets/index-Cw6Ui_Wl.js`.
- Deploy S3/CloudFront: bucket `emprely-app-web`, distribuicao `E1NWXIL7S19BU1`.
- Invalidacao: `IDVCEACGY0UW4S5U8S4D2SHMCW`.

Revalidacao apos deploy:

- Produção passou a servir `assets/index-Cw6Ui_Wl.js`.
- Banner passou a mostrar `ativo por dias gratis`.
- Menu da proposta `#0127` passou a mostrar `PDF`, `WhatsApp` e `Enviar` habilitados.
- Modal da proposta passou a mostrar `Baixar proposta em PDF` e `Enviar proposta pelo WhatsApp` habilitados.
- Modal de WhatsApp mostrou opcoes `Mensagem inicial + anexo`, `Proposta completa em texto`, `Download PDF` e `Download imagem`.
- Acoes `Download PDF` e `Download imagem` foram acionadas.

## Limitacoes

- A confirmacao de e-mail foi validada ate envio/registro do evento no historico admin. O link de confirmacao em si nao foi aberto porque o painel admin mascara destinatario e nao expõe token/link.
- O comando `pnpm test:e2e:web` retornou exit code 1 e gerou um log grande com saida binaria em `.artifacts/smoke-mvp-20260627-000615/pnpm-test-e2e-web.log`; por isso a validacao decisiva foi feita por API real + MCP em producao.
- O guia inicial ainda reabre em contas com perfil pendente, comportamento ja relacionado ao item 1/onboarding, nao bloqueante para este smoke.

## Evidencias

- `.artifacts/smoke-mvp-20260627-000615/health.txt`
- `.artifacts/smoke-mvp-20260627-000615/api-smoke-result-2.json`
- `.artifacts/smoke-mvp-20260627-000615/api-generated-proposal.json`
- `.artifacts/smoke-mvp-20260627-000615/desktop-dashboard-smoke.png`
- `.artifacts/smoke-mvp-20260627-000615/admin-dashboard-smoke.png`
- `.artifacts/smoke-mvp-20260627-000615/mobile-drawer-smoke.png`
- `.artifacts/smoke-mvp-20260627-000615/proposal-generated-buttons-disabled.png`
- `.artifacts/smoke-mvp-20260627-000615/proposal-share-modal-after-fix.png`
- `.artifacts/smoke-mvp-20260627-000615/published-assets-after-fix.txt`
