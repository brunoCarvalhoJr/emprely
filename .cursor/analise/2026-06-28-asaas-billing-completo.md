# Analise - Asaas billing completo

## Contexto

O Emprely possui trial de 7 dias, plano `Fundador` e ativacao administrativa. Nao existe checkout, webhook, assinatura, pagamento ou fatura real.

Decisao tomada: usar Asaas como provedor inicial, com operacao possivel em CPF agora e migracao para CNPJ depois. O usuario escolhe no app entre Pix mensal e cartao futuro/inativo ate tokenizacao segura para o Plano Fundador de R$19,99.

## Fontes consultadas

- `docs/product/sistema-pagamentos-assinaturas.md`
- `apps/api/src/Emprely.Domain/Contas/Conta.cs`
- `apps/api/src/Emprely.Api/Controllers/ContaAtualResponseBuilder.cs`
- `apps/api/src/Emprely.Api/Controllers/ProposalsController.cs`
- `apps/web/src/App.tsx`
- `apps/web/src/lib/api.ts`
- Landing externa: `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\AGENTS.md`
- Landing externa: `docs/prd-landing-page.md`
- Landing externa: `src/content/landing-content.ts`

## Estado atual

- API calcula acesso por `Conta.Plano`, `TrialEndsAt` e `DiasGratisConta`.
- Web recalcula status comercial em `getStatusComercialContaEfetivo`, o que pode deixar estado divergente do backend.
- A landing comunica Plano Fundador e ativacao manual por WhatsApp/formulario.
- A landing nao deve implementar backend, autenticacao ou pagamento real.

## Direcao

- Criar billing como camada propria do Emprely.
- Manter `PlanoConta.Trial/Fundador` para compatibilidade, mas assinatura/pagamento passam a dirigir o estado comercial quando existirem.
- Usar assinatura recorrente nativa do Asaas quando possivel, com cobranca hospedada retornada ao usuario; Emprely nao coleta cartao.
- Webhook e reconciliacao sao a fonte de ativacao.
- Landing apenas atualiza copy e CTA para cadastro/app.

## Ajuste de escopo V2

O pedido evoluiu para ja deixar recorrencia preparada. A V2 deve:

- criar assinatura Asaas mensal para Plano Fundador;
- vincular `ProviderSubscriptionId` na assinatura local;
- salvar a primeira cobranca retornada/consultada para redirecionamento;
- criar/atualizar pagamentos locais quando webhooks de novas cobrancas chegarem;
- cancelar remotamente a assinatura quando houver ID de assinatura;
- executar reembolso remoto via API Asaas quando houver pagamento remoto;
- manter envio de e-mails de cobranca/notificacao como responsabilidade do Asaas nesta etapa, registrando no Emprely apenas os eventos recebidos por webhook.

## Riscos

- Payload exato do Asaas pode variar entre checkout, pagamento e assinatura; a integracao deve ser resiliente a campos ausentes e registrar payload bruto.
- Pix recorrente deve ser comunicado como cobrancas recorrentes geradas pelo Asaas, nao como debito automatico bancario.
- Web ainda tem muita regra em `App.tsx`; precisa reduzir decisao local aos entitlements retornados pela API.

## Revisao de falhas e correcoes

Achados criticos identificados apos a implementacao V2:

- entitlements ainda podiam liberar acesso por `PlanoConta.Fundador` mesmo com assinatura inadimplente, suspensa, cancelada ou reembolsada;
- cliques repetidos no checkout podiam criar mais de uma assinatura recorrente no Asaas;
- webhook em erro era ignorado nos retries porque a idempotencia bloqueava qualquer evento ja registrado;
- cobrancas recorrentes futuras podiam chegar sem `externalReference` e eram ignoradas antes do fallback por `subscription`;
- reembolso suspendia localmente, mas nao cancelava a recorrencia remota;
- reativacao podia restaurar apenas localmente sem garantir assinatura remota valida;
- criacao remota podia deixar assinatura orfa se falhasse antes de salvar localmente.

Direcao de correcao:

- assinatura local passa a ser a autoridade de acesso pago quando existir qualquer registro de billing;
- `PlanoConta.Fundador` so libera como legado/admin quando nao ha assinatura local;
- checkout deve reutilizar pagamento pendente ou bloquear se ja houver assinatura ativa;
- webhooks `Erro`/`Recebido` podem ser reprocessados, apenas `Processado` e definitivo;
- fallback por `ProviderSubscriptionId` deve independer de `externalReference`;
- reembolso integral cancela recorrencia remota e suspende acesso;
- reativacao sem assinatura remota valida deve exigir novo checkout.
