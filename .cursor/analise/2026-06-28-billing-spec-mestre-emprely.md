# Analise - Spec mestre de Billing Emprely

## Contexto

O Emprely evoluiu de um MVP com trial de 7 dias e ativacao administrativa do Plano Fundador para uma implementacao local de billing com Asaas. A implementacao atual ja possui dominio de pagamentos, checkout, webhook, cancelamento, reembolso, entitlements, tela de plano no app e documentacao operacional.

Mesmo com varias correcoes aplicadas, as revisoes sucessivas continuaram encontrando falhas porque ainda nao existe uma especificacao mestre que defina, de ponta a ponta, o comportamento esperado de pagamento, assinatura, cancelamento, inadimplencia, reembolso, admin, webhook e reconciliacao.

Esta analise consolida o estado atual do codigo e define a direcao para criar uma spec unica antes de novas correcoes.

## Objetivo

Criar uma base analitica para a Spec Mestre de Billing do Emprely, cobrindo:

- compra do Plano Fundador;
- assinatura mensal e anual;
- Pix recorrente hospedado no Asaas;
- cartao de credito como metodo futuro;
- webhook e reconciliacao;
- liberacao e bloqueio de acesso;
- cancelamento pelo cliente/admin/provedor;
- reembolso parcial e integral;
- inadimplencia;
- painel administrativo;
- legado de ativacao manual;
- criterios de aceite e testes.

O objetivo pratico e parar as correcoes pontuais e passar a implementar somente o comportamento coberto por uma spec fechada.

## Projetos impactados

- API: `apps/api`
- Web: `apps/web`
- Landing: landing externa em `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp`
- Infra: variaveis Asaas, migrations, deploy API/web, webhook no painel Asaas
- Docs: `docs/product`, `docs/operations`, Notion e Obsidian
- Mobile: nao impactado nesta etapa
- Packages: nao impactado nesta etapa

## Estado atual do codigo

### API

Implementado localmente:

- `BillingController`
  - `GET /api/billing/plans`
  - `GET /api/billing/status`
  - `POST /api/billing/checkouts`
  - `POST /api/billing/cancel`
- `AsaasWebhooksController`
  - `POST /api/webhooks/asaas`
  - validacao por header `asaas-access-token`
- `AdminBillingController`
  - consulta de billing por conta;
  - sync local;
  - suspensao;
  - restauracao;
  - reembolso.
- `BillingService`
  - criacao de checkout;
  - cancelamento;
  - reembolso;
  - restauracao admin;
  - registro/processamento de webhook;
  - sync local por conta.
- `BillingEntitlementsService`
  - centraliza acesso pago/trial/dias gratis.
- `BillingCatalogo`
  - Plano Fundador mensal e anual;
  - Pix ativo;
  - cartao desabilitado ate tokenizacao.

### Dominio

Implementado localmente:

- `AssinaturaConta`
- `PagamentoConta`
- `EventoWebhookPagamento`
- `HistoricoAssinaturaConta`
- `BillingContaLock`
- enums de metodo, provedor, ciclo, status de pagamento, status de assinatura e processamento de webhook.

### Infraestrutura

Implementado localmente:

- `IProvedorPagamentos`
- `AsaasProvedorPagamentos`
- `AsaasOptions`
- HttpClient Asaas registrado em DI
- migrations:
  - `AsaasBillingCompleto`
  - `BillingContaLocks`
  - `BillingCicloPlanoReembolsoParcial`
- exemplos de variaveis de ambiente com `Asaas__ApiKey`, `Asaas__WebhookToken` e URLs de retorno.

### Web

Implementado localmente:

- tipos de billing em `apps/web/src/types/billing.ts`;
- chamadas API de planos/status/checkout/cancelamento;
- tela `Plano` dentro de `App.tsx`;
- seletor mensal/anual;
- Pix ativo;
- cartao exibido como inativo;
- retorno de checkout:
  - `/billing/sucesso`
  - `/billing/cancelado`
  - `/billing/expirado`

### Testes

Existem testes de integracao cobrindo parte dos fluxos:

- entitlements com assinatura suspensa;
- reuso de pagamento aberto;
- bloqueio de novo checkout com assinatura ativa;
- webhook recorrente sem `externalReference`;
- retry de webhook com erro;
- reembolso integral;
- cancelamento sem pagamento vigente;
- restauracao admin invalida;
- webhook atrasado que nao rebaixa pagamento recebido;
- filtro de reembolso para ignorar pagamento pendente;
- cartao bloqueado;
- checkout anual;
- reativacao local bloqueada;
- sync sem processar outra conta;
- cancelamento agendado vencido;
- reembolso parcial sem suspender.

Validacoes executadas:

- `dotnet test apps/api/Emprely.sln`: passou com 95 testes.
- `pnpm lint:web`: passou.
- `pnpm build:web`: passou.

## Fluxo atual implementado

### Compra

1. Usuario acessa tela `Plano`.
2. Escolhe ciclo mensal ou anual.
3. Escolhe Pix.
4. API cria/usa assinatura local.
5. API cria pagamento local.
6. API chama Asaas para criar assinatura recorrente.
7. API salva IDs do provider e URL de cobranca.
8. Web redireciona usuario para checkout/cobranca hospedada.

### Liberacao

1. Asaas envia webhook.
2. API registra evento bruto.
3. API processa evento.
4. Pagamento vira `Confirmado` ou `Recebido`.
5. Assinatura vira `Ativa`.
6. Conta passa para Plano Fundador.
7. Entitlements liberam exportacao, compartilhamento e remocao de marca d'agua.

### Cancelamento

1. Usuario solicita cancelar renovacao.
2. API exige assinatura com acesso pago vigente.
3. API cancela recorrencia remota no Asaas quando ha `ProviderSubscriptionId`.
4. Assinatura local fica como `CancelamentoAgendado`.
5. Acesso continua ate `PeriodoAtualFim`.
6. Sync marca como `Cancelada` quando o periodo vence.

### Reembolso

1. Admin solicita reembolso no endpoint de billing admin.
2. API seleciona ultimo pagamento confirmado/recebido.
3. API chama reembolso no Asaas.
4. Reembolso parcial registra valor e mantem acesso.
5. Reembolso integral cancela recorrencia e suspende assinatura.

### Webhook

1. Endpoint valida token.
2. Evento e salvo com payload bruto.
3. Evento e processado na propria requisicao.
4. Evento processado grava `ContaId`, `PagamentoContaId`, `AssinaturaContaId`.
5. Evento com erro pode ser reprocessado.

## Fluxo desejado para a spec mestre

### Compra facil

- Trial sem cartao.
- CTA claro no app e landing.
- Plano Fundador mensal.
- Plano Fundador anual com economia.
- Pix ativo como cobranca recorrente hospedada do Asaas.
- Cartao apresentado somente quando tokenizacao segura estiver pronta.
- Retorno do checkout nao libera acesso por si so.
- Tela informa que a liberacao depende da confirmacao de pagamento.

### Fonte da verdade

- Asaas e a fonte da verdade financeira.
- Emprely mantem uma projecao interna para controle de acesso.
- Webhook e reconciliacao atualizam a projecao interna.
- Entitlements nunca devem depender somente de redirect do checkout.

### Webhook robusto

- Persistir evento bruto.
- Responder 200 rapidamente apos persistir.
- Processar em background/job.
- Ser idempotente.
- Tolerar eventos fora de ordem.
- Nao rebaixar pagamento terminal.
- Diferenciar reembolso parcial e integral.

### Reconciliacao

- Job ou endpoint operacional deve consultar Asaas para corrigir divergencias.
- Sync por conta deve achar eventos por conta, pagamento e assinatura.
- Eventos sem conta resolvida devem continuar pendentes/erro para tratamento.

### Admin

- Admin pode suspender conta/assinatura por motivo operacional.
- Admin pode restaurar apenas se houver pagamento vigente ou credito manual auditado.
- Admin pode reembolsar parcial/integral.
- Admin nao deve ativar Fundador fora do billing sem gerar um registro de credito/manual billing.

## Regras de negocio consolidadas

### Planos

- Plano inicial: `Fundador`.
- Ciclos suportados:
  - `Mensal`
  - `Anual`
- Precos atuais:
  - Mensal: R$19,99
  - Anual: R$180,00
- Metodo ativo agora:
  - Pix
- Metodo futuro:
  - Cartao de credito recorrente tokenizado.

### Pix

- Pix atual e cobranca recorrente hospedada do Asaas.
- Nao deve ser chamado de Pix Automatico bancario.
- Pix libera acesso quando pagamento for confirmado/recebido conforme evento aceito na spec.

### Cartao

- Cartao nao deve ser ativado ate haver tokenizacao segura.
- Emprely nao deve coletar nem armazenar numero de cartao, CVV ou dados sensiveis.
- Quando implementado, deve ter spec propria de risco, tokenizacao e eventos.

### Acesso

- Trial ativo libera uso basico conforme regra atual.
- Assinatura paga libera acesso pago somente se:
  - status da assinatura permitir acesso;
  - periodo pago estiver vigente;
  - pagamento confirmado/recebido existir ou credito manual auditado existir.
- Assinatura suspensa, reembolsada integralmente, cancelada ou inadimplente nao remove acesso historico, mas bloqueia recursos pagos conforme entitlements.

### Cancelamento

- Cancelamento pelo cliente significa cancelar renovacao.
- Usuario mantem acesso ate o fim do periodo pago.
- Ao fim do periodo, assinatura vira `Cancelada`.
- Cancelamento imediato so deve ocorrer em suspensao admin, reembolso integral ou evento remoto que invalide a assinatura sem periodo vigente.

### Reembolso

- Reembolso parcial:
  - acumula valor reembolsado;
  - nao suspende acesso;
  - nao cancela recorrencia;
  - deve registrar historico.
- Reembolso integral:
  - marca pagamento como reembolsado;
  - cancela recorrencia remota;
  - suspende assinatura/acesso pago;
  - registra historico.
- Webhook de reembolso parcial nunca pode ser tratado como reembolso integral.

### Inadimplencia

- Pagamento vencido/falhou deve afetar apenas se nao houver outro pagamento vigente.
- Pagamento terminal recebido/confirmado nao pode ser rebaixado por evento atrasado.
- Deve haver regra clara de tolerancia, comunicacao e bloqueio.

### Ativacao manual legada

- `POST /api/account/activate-founder` esta bloqueado para usuario comum.
- Ainda existe `POST /api/admin/accounts/{contaId}/activate-founder`, que ativa Fundador fora do billing.
- A spec deve decidir uma destas opcoes:
  - remover endpoint;
  - bloquear endpoint;
  - transformar em credito manual auditado com periodo e historico;
  - permitir apenas em migracao legada com prazo.

## O que podemos implementar com a arquitetura atual

Sem criar microservico, e possivel implementar:

- spec mestre de estados e eventos;
- maquina de estados mais rigida;
- processamento assíncrono de webhook via `BackgroundService` e tabela existente;
- reconciliacao por job/endpoint admin;
- reembolso parcial/integral correto;
- cancelamento no fim do periodo;
- dunning simples;
- remocao/bloqueio de ativacao manual;
- painel admin de billing mais confiavel;
- testes de matriz completa.

## O que nao devemos implementar agora

Nao recomendado nesta etapa:

- cartao recorrente real dentro do Emprely;
- Pix Automatico bancario;
- multiplos provedores de pagamento;
- billing como microservico;
- proration/troca complexa de plano;
- checkout transparente com dados de pagamento dentro do app.

## Pontos de falha ainda identificados

### P0 - Webhook de reembolso parcial pode virar reembolso integral

O mapeamento atual usa `eventName.Contains("REFUND")`, o que captura eventos de reembolso parcial. Isso pode marcar o pagamento como `Reembolsado`, preencher `RefundedAmount = Valor`, cancelar recorrencia e suspender acesso.

Impacto: cliente pode perder acesso por um reembolso parcial.

### P0 - Ativacao administrativa legada bypassa billing

O endpoint administrativo legado ativa `PlanoFundador` direto na conta, sem assinatura, pagamento, periodo ou historico de billing.

Impacto: acesso pago pode ficar permanente fora do Asaas.

### P1 - Cancelamento da assinatura antiga antes do novo checkout remoto

Ao tentar novo checkout, a recorrencia antiga pode ser cancelada antes de a nova recorrencia remota estar garantida.

Impacto: se Asaas falhar, o cliente pode perder recorrencia ativa.

### P1 - Periodo de acesso baseado no horario do webhook

O periodo atual e calculado a partir de `DateTimeOffset.UtcNow` no processamento do webhook.

Impacto: webhook atrasado ou reprocessado pode estender periodo indevidamente.

### P1 - Webhook processa trabalho dentro da requisicao

O endpoint persiste e processa no mesmo request.

Impacto: timeout/falha no processamento pode prejudicar retry e confiabilidade operacional.

### P1 - Sync por conta ainda nao cobre bem eventos so de assinatura

Eventos com `ProviderResourceId` de assinatura e sem `ContaId` podem nao ser encontrados pelo sync da conta.

Impacto: eventos pendentes podem ficar presos ate retry externo/manual.

### P2 - Documentacao contraditoria

Ainda existem trechos antigos sobre cartao disponivel, reativacao, ativacao manual e billing fora do MVP.

Impacto: operacao e futuras implementacoes podem seguir regra obsoleta.

## Riscos tecnicos

- Estado financeiro divergente entre Asaas e Emprely.
- Webhook fora de ordem rebaixar ou estender acesso indevidamente.
- Falha entre chamada remota Asaas e persistencia local.
- Admin operar por endpoint legado fora do billing.
- Cliente pagar e nao liberar por falha de webhook/reconciliacao.
- Cliente receber reembolso parcial e perder acesso.
- Documentacao levar a decisao operacional incorreta.

## Riscos de negocio

- Compra com friccao se a tela nao orientar Pix/ciclo/confirmacao.
- Suporte manual aumenta se status de pagamento ficar confuso.
- Inadimplencia sem dunning gera churn involuntario.
- Cartao liberado antes da tokenizacao gera risco de seguranca/compliance.
- Falta de reconciliacao pode gerar perda de confianca.

## Dúvidas para fechar a spec

1. O endpoint admin de ativacao Fundador deve ser removido ou transformado em credito manual auditado?
2. O Plano Fundador anual deve continuar em R$180,00?
3. Qual tolerancia de inadimplencia apos vencimento Pix?
4. O acesso deve liberar em `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED` ou ambos para Pix?
5. Qual evento Asaas sera fonte oficial para reembolso parcial?
6. Reembolso integral deve sempre suspender imediatamente ou manter acesso ate fim do periodo em algum cenario?
7. O admin pode conceder dias gratis como recuperacao de cliente inadimplente?
8. Qual cadencia minima de reconciliacao: manual, diaria ou horaria?
9. Landing deve vender direto para checkout ou sempre levar para cadastro/trial?
10. Quando o cartao sera priorizado: antes ou depois do beta pago com Pix?

## Criterios de aceite para a futura spec

- Todos os estados de assinatura e pagamento definidos.
- Todos os eventos Asaas relevantes mapeados.
- Regras de acesso definidas sem ambiguidade.
- Cancelamento e reembolso definidos para parcial/integral.
- Admin sem bypass financeiro nao auditado.
- Webhook persistente, idempotente e com processamento seguro.
- Reconciliacao definida.
- UI definida para cada estado do cliente.
- Testes obrigatorios listados por fluxo.
- Documentacao operacional atualizada.

## Proximo passo recomendado

Criar `spec/2026-06-28-billing-spec-mestre-emprely.md` a partir desta analise e so depois implementar correcoes. A spec deve ser tratada como fonte unica de verdade para billing antes de mexer novamente no codigo.
