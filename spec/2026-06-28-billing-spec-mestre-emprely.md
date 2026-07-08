# Spec - Billing Emprely mestre

## Visao geral

Esta spec define o fluxo completo de billing do Emprely para compra, assinatura, pagamento, liberacao de acesso, cancelamento, inadimplencia, reembolso, administracao, reconciliacao, app, landing, testes e documentacao.

O objetivo e transformar o billing em um fluxo previsivel, facil de comprar, confiavel para o cliente e auditavel para operacao. Esta spec passa a ser a fonte de verdade para novas implementacoes de pagamento no Emprely.

## Objetivo do billing

O billing do Emprely deve:

- permitir que um cliente comece pelo trial e consiga assinar com poucos passos;
- vender o Plano Fundador mensal ou anual;
- receber por Pix via cobranca hospedada do Asaas;
- deixar o codigo preparado para cartao de credito recorrente tokenizado, sem ativar cartao agora;
- liberar acesso pago somente por confirmacao financeira confiavel;
- bloquear acesso pago quando a assinatura deixar de estar vigente;
- suportar cancelamento, inadimplencia, reembolso parcial, reembolso integral e restauracao;
- manter historico auditavel para suporte e administracao;
- evitar ativacoes pagas fora do fluxo de billing.

## Escopo

Inclui:

- Plano Fundador mensal e anual.
- Trial de 7 dias sem cartao.
- Pix hospedado Asaas como metodo ativo.
- Recorrencia Asaas para mensalidade/anuidade.
- Checkout hospedado do Asaas.
- Webhook Asaas persistido e processado de forma idempotente.
- Worker interno para processar eventos de billing.
- Projecao interna de assinatura, pagamento e entitlement.
- Reconciliacao diaria com Asaas.
- Cancelamento pelo cliente ao fim do periodo pago.
- Suspensao administrativa imediata.
- Inadimplencia com tolerancia de 3 dias.
- Emails essenciais de billing.
- Reembolso parcial e integral.
- Credito manual auditado por Super Admin.
- Tela de plano avancada no app.
- Ajustes de CTA e mensagens na landing.
- Testes obrigatorios de matriz completa.
- Documentacao em repo, Notion e Obsidian.

Fora do escopo:

- Pix Automatico bancario.
- Cartao de credito ativo em producao.
- Captura ou armazenamento de numero de cartao, CVV ou dados sensiveis no Emprely.
- Checkout transparente dentro do app.
- Billing como microservico separado.
- Multiplos provedores de pagamento.
- Proration complexa ou upgrade imediato com calculo proporcional.
- Nota fiscal automatica.
- Marketplace ou divisao de pagamento.

## Arquitetura

O Emprely deve manter billing dentro do monolito modular atual.

- Asaas e a fonte da verdade financeira.
- Emprely mantem uma projecao interna para acesso, UI, suporte e auditoria.
- A API recebe webhooks do Asaas, persiste o evento bruto e processa em background.
- O app consulta somente a API do Emprely para saber status de plano, pagamento e acesso.
- Entitlements devem depender da projecao interna, atualizada por webhook, reconciliacao e operacoes admin auditadas.
- Nenhum redirect de checkout libera acesso sozinho.
- Nenhuma ativacao manual pode conceder Plano Fundador permanente sem registro de billing ou credito auditado.

Componentes esperados:

- `BillingController`: planos, status, checkout e cancelamento pelo cliente.
- `AsaasWebhooksController`: recebimento e persistencia de eventos.
- `AdminBillingController`: suporte operacional e auditoria.
- `BillingService`: regras de checkout, cancelamento, reembolso, sync e estado.
- `BillingEntitlementsService`: decisao central de acesso pago.
- `AsaasProvedorPagamentos`: integracao financeira.
- `BackgroundService` de billing: processamento de eventos pendentes e jobs periodicos.
- Tabelas de assinatura, pagamento, webhook, historico, locks e outbox simples.

## Planos e precos

Plano inicial:

- Nome: Plano Fundador.
- Ciclo mensal: R$ 19,99.
- Ciclo anual: R$ 180,00.
- Moeda: BRL.
- Trial: 7 dias sem cartao.

Regras:

- O cliente pode criar conta e usar trial antes de pagar.
- A landing deve ter CTA principal para teste gratis.
- A landing e o app tambem podem oferecer assinatura direta.
- O ciclo anual deve ser apresentado como alternativa economica ao mensal.
- Troca de ciclo deve valer somente a partir do proximo periodo, sem proration no MVP.

## Metodos de pagamento

### Pix

- Pix e o metodo ativo na V1 desta spec.
- Pix deve usar cobranca hospedada do Asaas.
- Pix nao deve ser comunicado como Pix Automatico bancario.
- O pagamento Pix libera acesso quando o Asaas confirmar ou receber o pagamento por evento aceito.
- Pagamento pendente deve manter a tela com link para pagar.

### Cartao de credito

- Cartao deve ficar preparado em contratos, enums, tipos e pontos de extensao.
- Cartao nao deve aparecer como metodo ativo para compra real enquanto nao houver tokenizacao.
- Quando ativado no futuro, o Emprely nao deve coletar nem armazenar numero de cartao ou CVV.
- A ativacao de cartao exige spec propria de tokenizacao, antifraude, chargeback, retries e eventos.
- Chargeback deve ficar documentado como fluxo futuro, sem comportamento ativo agora.

## Estados de assinatura

A assinatura interna deve representar o acesso projetado do cliente.

Estados esperados:

- `AguardandoPagamento`: checkout criado, pagamento ainda nao confirmado.
- `PagamentoEmAnalise`: pagamento ou evento em analise pelo provedor.
- `Ativa`: pagamento vigente confirmado ou recebido.
- `CancelamentoAgendado`: renovacao cancelada, acesso mantido ate o fim do periodo pago.
- `Inadimplente`: pagamento vencido/falhou e ainda dentro da tolerancia ou em tratamento operacional.
- `Suspensa`: acesso pago bloqueado imediatamente por regra admin, reembolso integral ou falha critica.
- `Cancelada`: periodo pago terminou ou recorrencia foi encerrada sem acesso vigente.
- `Reembolsada`: assinatura encerrada por reembolso integral.

Credito manual auditado nao deve fingir ser pagamento Asaas. Ele deve ser uma concessao auditada de acesso, com inicio, fim, motivo, responsavel e historico.

## Estados de pagamento

Estados esperados:

- `Criado`: registro local criado.
- `AguardandoPagamento`: cobranca criada e pendente.
- `EmAnalise`: pagamento aguardando analise ou confirmacao do provedor.
- `Confirmado`: provedor confirmou pagamento.
- `Recebido`: provedor recebeu pagamento.
- `Vencido`: cobranca venceu.
- `Falhou`: cobranca falhou ou foi recusada.
- `Cancelado`: cobranca cancelada.
- `ReembolsadoParcial`: valor parcialmente reembolsado, com acumulador.
- `Reembolsado`: valor integral reembolsado.

Regras:

- Estados terminais financeiros nao devem ser rebaixados por webhook atrasado.
- `Confirmado` e `Recebido` liberam acesso para Pix.
- Reembolso parcial nunca pode ser tratado como reembolso integral.
- Multiplos reembolsos parciais devem acumular valor.
- Quando o acumulado reembolsado atingir o valor pago, o pagamento deve ser tratado como reembolso integral.

## Eventos Asaas aceitos

Eventos de pagamento aceitos:

- `PAYMENT_CREATED`
- `PAYMENT_UPDATED`
- `PAYMENT_AWAITING_RISK_ANALYSIS`
- `PAYMENT_APPROVED_BY_RISK_ANALYSIS`
- `PAYMENT_REPROVED_BY_RISK_ANALYSIS`
- `PAYMENT_CONFIRMED`
- `PAYMENT_RECEIVED`
- `PAYMENT_OVERDUE`
- `PAYMENT_DELETED`
- `PAYMENT_CANCELED`
- `PAYMENT_REFUNDED`
- `PAYMENT_PARTIALLY_REFUNDED`

Eventos de assinatura aceitos:

- assinatura criada/atualizada quando vier do Asaas;
- assinatura cancelada, removida ou inativada;
- eventos equivalentes devem ser mapeados de forma explicita quando forem confirmados na sandbox/documentacao Asaas.

Regras:

- Evento desconhecido deve ser persistido, marcado como ignorado e nao quebrar o webhook.
- Evento conhecido sem conta resolvida deve ficar pendente ou em erro operacional, sem liberar acesso.
- Eventos de assinatura nao podem liberar acesso sem pagamento confirmado/recebido ou credito manual vigente.

## Regras de checkout

1. Usuario escolhe plano, ciclo e metodo.
2. API valida se o metodo esta ativo.
3. API verifica assinatura atual, pagamentos abertos e periodo vigente.
4. Se ja houver cobranca aberta para a mesma conta, plano, ciclo e metodo, a API deve reutilizar a cobranca e retornar a mesma URL.
5. Se houver assinatura ativa vigente, a API nao deve criar checkout duplicado para o mesmo periodo.
6. Se houver troca de ciclo, a mudanca deve ser agendada para o proximo periodo.
7. A assinatura remota antiga so pode ser cancelada depois de a nova assinatura/cobranca remota ter sido criada e persistida com sucesso.
8. A API cria ou atualiza a assinatura local como `AguardandoPagamento`.
9. A API cria pagamento local como `AguardandoPagamento`.
10. A API chama Asaas para criar recorrencia/cobranca hospedada.
11. A API salva IDs remotos e URL de pagamento.
12. A web redireciona para o checkout hospedado.

Retornos do checkout:

- `billing/sucesso`: deve mostrar que o pagamento esta aguardando confirmacao se ainda nao houve webhook.
- `billing/cancelado`: deve manter opcao de voltar e pagar.
- `billing/expirado`: deve orientar criar ou reutilizar uma cobranca vigente.

## Regras de webhook

O webhook deve seguir o fluxo:

1. Validar token/header configurado.
2. Persistir evento bruto com idempotencia.
3. Responder `200` rapidamente apos persistencia valida.
4. Processar evento em `BackgroundService`.
5. Aplicar lock por conta/pagamento/assinatura quando necessario.
6. Resolver conta por `externalReference`, pagamento remoto, assinatura remota ou historico.
7. Atualizar pagamento, assinatura, conta e historico.
8. Marcar evento como processado, ignorado ou erro.
9. Permitir retry controlado de evento com erro.

Regras obrigatorias:

- Processamento deve ser idempotente.
- Evento duplicado nao pode duplicar historico nem extender periodo.
- Evento atrasado nao pode rebaixar pagamento terminal.
- Reembolso parcial e integral devem ter caminhos separados.
- Falha de processamento nao deve impedir o Asaas de receber `200` quando o evento ja foi persistido.
- Eventos sem conta resolvida nao devem liberar acesso.
- Payload bruto deve ser mantido para auditoria.

## Regras de acesso e entitlements

O acesso pago deve ser decidido pelo billing interno, nao diretamente pelo Asaas nem por redirect.

Libera acesso pago:

- assinatura `Ativa` com periodo atual vigente e pagamento `Confirmado` ou `Recebido`;
- credito manual auditado vigente;
- pagamento confirmado apos bloqueio, se ainda houver periodo ou nova recorrencia valida.

Nao libera acesso pago:

- checkout criado sem pagamento confirmado;
- pagamento pendente;
- pagamento vencido fora da tolerancia;
- assinatura cancelada sem periodo vigente;
- assinatura suspensa;
- reembolso integral;
- ativacao manual legada sem credito auditado.

Entitlements pagos devem cobrir, no minimo:

- exportacao sem marca d'agua;
- compartilhamento pago;
- recursos reservados ao Plano Fundador;
- limites e vantagens exibidos na tela de plano.

## Cancelamento

Cancelamento pelo cliente:

- significa cancelar renovacao;
- deve manter acesso ate o fim do periodo pago;
- deve cancelar a recorrencia remota no Asaas;
- deve colocar a assinatura local como `CancelamentoAgendado`;
- ao fim do periodo, deve virar `Cancelada`.

Cancelamento administrativo/suspensao:

- deve bloquear acesso pago imediatamente;
- deve cancelar recorrencia remota quando existir;
- deve exigir motivo;
- deve registrar historico e responsavel;
- deve ser acao forte e restrita.

Cancelamento remoto pelo Asaas:

- deve ser refletido internamente por webhook ou reconciliacao;
- nao deve remover acesso antes do fim do periodo pago se o cancelamento for apenas de renovacao;
- deve suspender se o provedor indicar invalidacao financeira sem pagamento vigente.

## Inadimplencia

Regras:

- Tolerancia apos vencimento: 3 dias.
- Durante a tolerancia, o cliente deve ver status de pendencia e link para pagar.
- Apos 3 dias de atraso, o acesso pago deve ser bloqueado.
- Pagamento recebido depois do bloqueio deve reativar acesso se a cobranca/assinatura ainda for valida.
- Pagamento vencido/falhou nao pode bloquear se houver outro pagamento vigente confirmado.

Emails essenciais:

- pre-vencimento 1 dia antes;
- pagamento pendente ou vencido;
- bloqueio apos 3 dias;
- pagamento confirmado e acesso liberado;
- cancelamento agendado;
- cancelamento efetivado;
- reembolso parcial;
- reembolso integral.

## Reembolso parcial e integral

Reembolso parcial:

- pode ser iniciado por admin autorizado;
- deve chamar API do Asaas;
- deve registrar valor reembolsado;
- deve acumular multiplos parciais;
- deve manter acesso pago;
- nao deve cancelar recorrencia;
- deve registrar historico;
- deve enviar email ao cliente.

Reembolso integral:

- pode ser iniciado por admin autorizado;
- deve chamar API do Asaas;
- deve marcar pagamento como `Reembolsado`;
- deve cancelar recorrencia remota;
- deve suspender acesso pago imediatamente;
- deve registrar historico;
- deve enviar email ao cliente.

Webhook de reembolso:

- `PAYMENT_PARTIALLY_REFUNDED` deve atualizar acumulado e manter acesso, salvo se acumulado atingir valor integral.
- `PAYMENT_REFUNDED` deve tratar como reembolso integral.
- Eventos com `REFUND` no nome nao podem ser mapeados por `Contains` generico.

## Admin billing

O painel admin deve permitir, com seguranca:

- consultar status de billing por conta;
- ver assinatura, ciclo, metodo, periodo e proxima cobranca;
- ver pagamentos dos ultimos 12 meses;
- ver eventos recentes de webhook;
- executar sync/reconciliacao por conta;
- reprocessar evento com erro;
- suspender assinatura/conta com motivo;
- restaurar acesso apenas quando houver pagamento vigente ou credito manual vigente;
- emitir reembolso parcial;
- emitir reembolso integral;
- conceder credito manual auditado.

Credito manual:

- permitido somente para Super Admin;
- prazo padrao: 30 dias;
- exige motivo;
- exige responsavel;
- deve aparecer no historico;
- nao deve criar pagamento Asaas falso;
- deve ser usado para migracao, cortesia controlada ou correcao operacional.

Ativacao legada:

- endpoint administrativo de ativacao direta do Plano Fundador deve ser removido, bloqueado ou convertido para credito manual auditado;
- nenhum usuario comum pode ativar Plano Fundador fora do billing;
- qualquer acesso pago fora do Asaas deve ter prazo e auditoria.

## Reconciliacao

Regras:

- Cadencia minima: diaria.
- Deve existir reconciliacao manual por conta no admin.
- Asaas vence em divergencia financeira.
- Falha de reconciliacao deve ser registrada e nao deve apagar estado vigente sem evidencia.
- Reconciliacao deve consultar pagamentos e assinaturas remotas relevantes.
- Eventos pendentes sem conta devem ser tentados novamente quando novas referencias locais existirem.

Casos que a reconciliacao deve corrigir:

- cliente pagou e webhook falhou;
- assinatura remota foi cancelada e webhook nao chegou;
- reembolso foi feito no Asaas e webhook falhou;
- pagamento venceu e webhook falhou;
- pagamento foi recebido depois de inadimplencia;
- evento chegou antes de a referencia local estar completa.

## UI do app

A tela de plano deve ser avancada, clara e operacional.

Deve exibir:

- plano atual;
- status de assinatura;
- status do pagamento atual;
- ciclo mensal/anual;
- valor;
- metodo de pagamento;
- periodo atual;
- proxima cobranca ou fim do acesso;
- link para pagar quando houver pendencia;
- historico dos ultimos 12 meses;
- acoes disponiveis conforme estado;
- mensagens especificas para trial, pendente, ativo, cancelamento agendado, inadimplente, suspenso, cancelado e reembolsado.

Acoes esperadas:

- iniciar assinatura;
- pagar cobranca pendente;
- trocar ciclo para o proximo periodo;
- cancelar renovacao;
- voltar ao checkout hospedado;
- contatar suporte quando estado exigir intervencao.

Cartao:

- pode aparecer como futuro ou indisponivel somente se isso nao causar tentativa de compra;
- nao deve permitir envio de dados de cartao.

## Landing

A landing deve:

- ter CTA principal para teste gratis;
- permitir caminho secundario para assinar;
- explicar Plano Fundador mensal e anual;
- comunicar Pix como pagamento hospedado Asaas;
- nao prometer Pix Automatico;
- nao prometer cartao ativo enquanto nao estiver implementado;
- alinhar mensagens de preco com `R$ 19,99/mensal` e `R$ 180,00/anual`;
- levar o usuario para cadastro/trial ou fluxo de assinatura definido.

## Impactos por projeto

- API: estados, checkout, webhook, worker, reconciliacao, admin, reembolso, credito manual e testes.
- Web: tela de plano, estados, acoes, mensagens, historico e bloqueio de cartao ativo.
- Mobile: sem impacto nesta etapa.
- Landing: CTA, precos, textos e rota de compra/trial.
- Packages: sem impacto previsto.
- Infra: variaveis Asaas, webhook configurado no painel Asaas, jobs/background worker, migrations e deploy.
- Docs: atualizar documentacao no repositorio, Notion e Obsidian.

## Estrategia de implementacao

1. Alinhar modelos e contratos com esta spec.
2. Corrigir precos e mensagens oficiais.
3. Remover ou converter ativacao manual legada para credito auditado.
4. Separar reembolso parcial de integral.
5. Tornar webhook persistido com processamento por worker.
6. Garantir idempotencia e maquina de estados.
7. Ajustar checkout duplicado, troca de ciclo e cancelamento seguro de recorrencia antiga.
8. Implementar ou ajustar reconciliacao diaria e sync manual admin.
9. Implementar dunning e emails essenciais.
10. Completar tela de plano no app.
11. Atualizar landing.
12. Atualizar docs repo, Notion e Obsidian.
13. Fechar matriz de testes automatizados.
14. Validar fluxo completo em sandbox Asaas.

## Testes obrigatorios

API:

- lista planos com mensal R$ 19,99 e anual R$ 180,00;
- cria checkout Pix mensal;
- cria checkout Pix anual;
- bloqueia cartao ativo;
- reutiliza cobranca aberta;
- nao cria checkout duplicado com assinatura ativa;
- troca de ciclo apenas no proximo periodo;
- nao cancela assinatura remota antiga se nova cobranca falhar;
- webhook invalido por token e rejeitado;
- webhook valido e persistido;
- webhook duplicado e idempotente;
- webhook `PAYMENT_CONFIRMED` libera acesso;
- webhook `PAYMENT_RECEIVED` libera acesso;
- webhook atrasado nao rebaixa pagamento recebido;
- webhook desconhecido e salvo/ignorado;
- webhook sem conta nao libera acesso;
- pagamento vencido entra em inadimplencia;
- bloqueio apos 3 dias de atraso;
- pagamento apos bloqueio reativa acesso quando valido;
- cancelamento pelo cliente mantem acesso ate o fim do periodo;
- fim de periodo cancelado bloqueia acesso pago;
- suspensao admin bloqueia imediatamente e cancela recorrencia;
- restauracao admin exige pagamento ou credito vigente;
- credito manual Super Admin concede 30 dias auditados;
- reembolso parcial mantem acesso;
- multiplos reembolsos parciais acumulam;
- acumulado parcial igual ao total vira integral;
- reembolso integral suspende e cancela recorrencia;
- reconciliacao corrige pagamento confirmado sem webhook;
- reconciliacao registra falha sem apagar estado vigente.

Web/app:

- tela mostra trial corretamente;
- tela mostra pendencia com link para pagar;
- tela mostra assinatura ativa;
- tela mostra cancelamento agendado;
- tela mostra inadimplencia e prazo;
- tela mostra bloqueio apos inadimplencia;
- tela mostra historico dos ultimos 12 meses;
- botao de cartao nao permite compra;
- cancelamento exibe confirmacao e estado correto.

Landing:

- CTA principal de teste gratis;
- precos corretos;
- Pix descrito como hospedado Asaas;
- cartao nao prometido como ativo.

Sandbox Asaas:

- criar assinatura/cobranca Pix;
- receber webhook de confirmacao/recebimento;
- testar atraso/duplicidade de webhook;
- cancelar recorrencia;
- reembolsar parcial;
- reembolsar integral;
- rodar reconciliacao apos alterar estado no Asaas.

## Criterios de aceite

- Todos os estados de assinatura e pagamento existem ou estao mapeados sem ambiguidade.
- Todos os eventos Asaas aceitos estao mapeados explicitamente.
- Checkout nao libera acesso por redirect.
- Pix libera acesso apenas por webhook/reconciliacao confirmada.
- Cartao fica preparado, mas inativo.
- Reembolso parcial nao suspende acesso.
- Reembolso integral suspende acesso e cancela recorrencia.
- Cancelamento pelo cliente mantem acesso ate o fim do periodo pago.
- Inadimplencia bloqueia somente apos 3 dias.
- Admin nao consegue ativar Plano Fundador permanente fora do billing.
- Credito manual e auditado, temporario e restrito a Super Admin.
- Reconciliacao diaria existe e Asaas vence divergencia financeira.
- UI do app cobre todos os estados principais.
- Landing esta alinhada aos precos e metodos reais.
- Testes automatizados obrigatorios passam.
- Fluxo completo passa na sandbox Asaas.
- Documentacao do repo, Notion e Obsidian esta atualizada.

## Decisoes fechadas

- Modelo comercial: trial mais assinatura.
- Fonte de acesso: projecao interna de billing do Emprely, alimentada pelo Asaas.
- Metodo ativo: Pix hospedado Asaas.
- Metodo futuro: cartao tokenizado.
- Planos: Fundador mensal e anual.
- Precos: R$ 19,99 mensal e R$ 180,00 anual.
- Landing: CTA principal para teste gratis.
- Checkout duplicado: reutilizar cobranca aberta.
- Troca de ciclo: aplicar no proximo periodo.
- Redirect: nunca libera acesso sozinho.
- Webhook: persistir e processar por worker.
- Eventos que liberam Pix: confirmado ou recebido.
- Evento desconhecido: salvar e ignorar.
- Cancelamento cliente: manter acesso ate o fim do periodo.
- Inadimplencia: tolerancia de 3 dias.
- Emails: Emprely envia emails essenciais.
- Reembolso parcial: manter acesso.
- Reembolso integral: suspender imediato.
- Credito manual: Super Admin, 30 dias, auditado.
- Suspensao admin: bloqueia e cancela recorrencia.
- Reconciliacao: diaria; Asaas vence divergencia financeira.
- UI app: tela de plano avancada.
- Admin UI: completo e seguro.
- Documentacao: repo, Notion e Obsidian.
