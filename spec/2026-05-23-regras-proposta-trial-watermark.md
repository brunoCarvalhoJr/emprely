# Spec - Regras de proposta, trial e marca d'água

## Visão geral

Esta feature consolida as regras de negócio da V1 do Emprely Orçamentos para o ciclo de vida das propostas, os bloqueios comerciais do trial e o comportamento da marca d'água nas visualizações e documentos.

Status em 2026-05-23: implementada na API e no webapp. Build e lint do web passaram. Testes .NET não foram executados no ambiente atual porque o comando `dotnet` não está disponível.

O objetivo é garantir que a proposta seja editável enquanto ainda está em preparação, preserve histórico depois do envio ao cliente e proteja o valor comercial do produto durante e após o período de trial.

Antes da implementação, parte dessas regras existia no frontend e parte no domínio/API, mas havia lacunas: a API ainda permitia editar propostas enviadas/aceitas/recusadas via `PUT`, e a marca d'água não diferenciava trial ativo de trial expirado. Essas lacunas foram corrigidas nesta feature.

## Status de implementação

- Implementado em `apps/api/src/Emprely.Domain/Propostas/Proposta.cs`:
  - `AtualizarProposta` rejeita `Enviada`, `Aceita` e `Recusada`.
  - `Gerada` continua editável e volta para `Rascunho` ao salvar.
- Implementado em `apps/api/src/Emprely.Api/Controllers/ProposalsController.cs`:
  - conflitos de regra de negócio retornam `409 Conflict` com `message`.
  - `generate` e `send` validam recurso/arquivamento antes do bloqueio comercial.
  - bloqueio de trial expirado usa copy pública “Ative o plano”.
- Implementado em `apps/web/src/App.tsx` e `apps/web/src/styles.css`:
  - confirmação antes de editar proposta `Gerada`.
  - bloqueio de edição direta para `Enviada`, `Aceita` e `Recusada`.
  - banner de trial expirado no dashboard e nas telas de proposta.
  - marca d'água discreta para trial ativo e grande para trial expirado.
  - copy pública com CTA “Ativar plano”.
  - dados atualizados de `/api/me` têm prioridade sobre dados persistidos da sessão.
  - expiração do trial também é inferida localmente por `trialEndsAt` para evitar exportação com estado comercial obsoleto.
- Testes atualizados:
  - `apps/api/tests/Emprely.UnitTests/Propostas/PropostaTests.cs`.
  - `apps/api/tests/Emprely.IntegrationTests/MvpFluxoApiTests.cs`.

## Validações executadas

- `npm run build` em `apps/web`: passou.
- `npm run lint` em `apps/web`: passou.
- `dotnet test` em `apps/api`: não executado porque `dotnet` não está instalado/disponível no ambiente atual (`dotnet: command not found`).

## Pendência de validação

- Executar `dotnet test` em ambiente com .NET SDK instalado antes de considerar a validação de API completa.
- Fazer aceite manual do fluxo proposta/trial em ambiente local ou beta/staging.

## Escopo

Inclui:

- Blindar, na API, as regras de edição por status da proposta.
- Manter a experiência do webapp consistente com as mesmas regras da API.
- Definir transições permitidas entre status de proposta.
- Definir comportamento de duplicação e arquivamento.
- Definir bloqueios comerciais do trial expirado.
- Definir marca d'água discreta para trial ativo.
- Definir marca d'água grande para trial expirado.
- Exibir avisos e CTAs adequados quando a conta estiver com trial expirado.
- Padronizar mensagens de erro de regra de negócio em ações inválidas.
- Cobrir as regras com testes automatizados onde aplicável.

Fora do escopo:

- Sistema de pagamento real.
- Checkout, assinatura, invoices, cobrança, cartão ou integração com gateway.
- E-mails transacionais de cadastro, recuperação de senha ou notificações.
- Link público de proposta.
- Aceite público pelo cliente final.
- Multiusuário/equipe/RBAC avançado.
- Auditoria completa de eventos.
- Renomeação interna do enum/plano `Fundador` no banco ou domínio.
- Exclusão definitiva de dados.

## Fluxo ponta a ponta

### 1. Edição de proposta rascunho

1. Usuário acessa a listagem de propostas no webapp.
2. Usuário escolhe uma proposta com status `Rascunho`.
3. Frontend permite abrir o editor.
4. Usuário altera dados, itens, valores, template ou detalhes.
5. Frontend envia `PUT /api/proposals/{id}`.
6. Backend valida conta, cliente, serviços, itens e regras de negócio.
7. Backend salva alterações mantendo status `Rascunho`.
8. Frontend atualiza cache/listagem e informa sucesso.

### 2. Edição de proposta gerada

1. Usuário escolhe uma proposta com status `Gerada`.
2. Frontend exibe confirmação antes de abrir/editar: editar fará a proposta voltar para rascunho ao salvar.
3. Usuário confirma.
4. Frontend permite edição.
5. Usuário salva.
6. Frontend envia `PUT /api/proposals/{id}`.
7. Backend permite atualização porque `Gerada` ainda não foi enviada ao cliente.
8. Backend salva alterações e volta status para `Rascunho`.
9. Frontend atualiza estado e indica que o rascunho foi salvo e deve ser gerado novamente.

### 3. Tentativa de edição de proposta enviada, aceita ou recusada

1. Usuário tenta editar uma proposta com status `Enviada`, `Aceita` ou `Recusada` pelo webapp.
2. Frontend bloqueia a abertura do editor e exibe: “Esta proposta não pode mais ser editada. Duplique para criar uma nova versão.”
3. Se alguém chamar a API diretamente com `PUT /api/proposals/{id}`, o backend rejeita.
4. Backend retorna `409 Conflict` com mensagem clara de regra de negócio.
5. Frontend, se receber esse erro, exibe mensagem amigável e orienta duplicação.

### 4. Geração da proposta

1. Usuário salva uma proposta como `Rascunho`.
2. Usuário aciona gerar proposta.
3. Frontend envia `POST /api/proposals/{id}/generate`.
4. Backend verifica se a conta pode usar o fluxo comercial.
5. Se trial ativo ou plano ativo, backend permite gerar.
6. Backend muda status para `Gerada`.
7. Frontend libera visualização final, impressão/exportação e envio por WhatsApp conforme plano/status.
8. Se trial expirado, backend retorna bloqueio comercial e frontend mostra CTA “Ativar plano”.

### 5. Envio e decisão da proposta

1. Usuário envia ou marca como enviada uma proposta `Gerada`.
2. Frontend envia `POST /api/proposals/{id}/send`.
3. Backend permite apenas se status atual for `Gerada` e conta puder usar fluxo comercial.
4. Backend muda status para `Enviada`.
5. Usuário pode marcar como `Aceita` ou `Recusada`.
6. Backend permite aceitar/recusar apenas se status atual for `Enviada`.
7. Depois de `Aceita` ou `Recusada`, a decisão é final na V1.

### 6. Duplicação

1. Usuário aciona duplicar em qualquer proposta não arquivada.
2. Frontend envia `POST /api/proposals/{id}/duplicate`.
3. Backend cria uma nova proposta como `Rascunho`, com novo número sequencial.
4. Conteúdo, cliente, itens, valores, template e detalhes são copiados.
5. A proposta original permanece inalterada.
6. Trial expirado pode duplicar, pois a cópia é apenas rascunho; gerar/enviar/exportar continua bloqueado.

### 7. Arquivamento

1. Usuário arquiva proposta em qualquer status não arquivado.
2. Frontend envia `DELETE /api/proposals/{id}`.
3. Backend muda status para `Arquivada`.
4. Proposta arquivada some da listagem principal.
5. Na V1 não há exclusão definitiva pelo usuário.

### 8. Marca d'água e trial

1. Frontend monta preview/documento da proposta com dados da conta.
2. Se conta está em plano ativo, não há marca d'água.
3. Se conta está em trial ativo, preview/documento exibe marca d'água discreta no canto.
4. Se conta está com trial expirado, preview interno exibe marca d'água muito grande atravessando a página.
5. Trial expirado bloqueia gerar, exportar, imprimir e enviar/compartilhar.
6. Trial expirado mantém visualização, criação de clientes, serviços, rascunhos e duplicação.
7. Dashboard e telas de proposta exibem banner fixo informando expiração e CTA “Ativar plano”.

## Requisitos

### Requisitos funcionais

- RF01: A API deve permitir atualizar proposta `Rascunho`.
- RF02: A API deve permitir atualizar proposta `Gerada` e, ao salvar, mudar status para `Rascunho`.
- RF03: A API deve rejeitar atualização de proposta `Enviada`, `Aceita` ou `Recusada`.
- RF04: A API deve retornar `409 Conflict` para ações bloqueadas por regra de status.
- RF05: O webapp deve bloquear edição direta de proposta `Enviada`, `Aceita` e `Recusada`.
- RF06: O webapp deve avisar antes de editar proposta `Gerada`.
- RF07: Proposta `Gerada` pode ser enviada/marcada como enviada quando a conta tem permissão comercial.
- RF08: Proposta `Enviada` pode ser marcada como `Aceita`.
- RF09: Proposta `Enviada` pode ser marcada como `Recusada`.
- RF10: Proposta `Aceita` não pode virar `Recusada` na V1.
- RF11: Proposta `Recusada` não pode virar `Aceita` na V1.
- RF12: Proposta `Aceita` ou `Recusada` não pode voltar para `Enviada` na V1.
- RF13: Qualquer proposta não arquivada pode ser duplicada.
- RF14: Duplicação sempre cria nova proposta com status `Rascunho`.
- RF15: Qualquer proposta não arquivada pode ser arquivada.
- RF16: Proposta arquivada não aparece na listagem principal.
- RF17: Trial ativo pode criar, gerar, exportar, imprimir e enviar propostas com marca d'água discreta.
- RF18: Trial expirado pode visualizar propostas internamente.
- RF19: Trial expirado pode criar clientes, serviços e propostas rascunho.
- RF20: Trial expirado pode duplicar propostas.
- RF21: Trial expirado não pode gerar, exportar, imprimir, enviar nem compartilhar proposta.
- RF22: Trial expirado deve mostrar marca d'água muito grande nas visualizações internas de proposta.
- RF23: Trial expirado deve exibir banner fixo no dashboard e telas de proposta.
- RF24: CTAs comerciais de trial expirado devem usar texto público “Ativar plano”.
- RF25: O nome público “Fundador” não deve ser necessário no CTA principal da V1.

### Requisitos não funcionais

- RNF01: Regras críticas de status devem ser aplicadas no backend, não apenas no frontend.
- RNF02: Mensagens de bloqueio devem ser claras para usuário final e programador que consome a API.
- RNF03: Alterações devem preservar dados existentes e não exigir migration para renomear plano interno.
- RNF04: A implementação deve manter isolamento por conta/tenant já existente.
- RNF05: A experiência visual deve evitar que trial expirado gere print comercial limpo.
- RNF06: As regras devem ser cobertas por testes automatizados na API.
- RNF07: O webapp deve continuar tratando erro de sessão expirada e erro de permissão comercial de forma amigável.

## Regras de negócio

### Status de proposta

- RB01: `Rascunho` é editável.
- RB02: `Gerada` é editável, mas salvar alterações muda status para `Rascunho`.
- RB03: Antes de editar `Gerada`, o usuário deve ser avisado que ela voltará para rascunho.
- RB04: `Enviada`, `Aceita` e `Recusada` não são editáveis diretamente.
- RB05: Para alterar proposta `Enviada`, `Aceita` ou `Recusada`, o usuário deve duplicar.
- RB06: `Aceita` e `Recusada` são decisões finais na V1.
- RB07: Ação de aceitar só é permitida a partir de `Enviada`.
- RB08: Ação de recusar só é permitida a partir de `Enviada`.
- RB09: Ação de enviar só é permitida a partir de `Gerada`.
- RB10: Ação de gerar só é permitida a partir de `Rascunho`.
- RB11: Proposta `Arquivada` não aceita ações de edição, geração, envio, aceite, recusa ou duplicação.

### Duplicação e arquivamento

- RB12: Qualquer proposta não arquivada pode ser duplicada.
- RB13: Duplicação sempre gera uma nova proposta `Rascunho`.
- RB14: Duplicação não altera a proposta original.
- RB15: A cópia recebe novo número sequencial.
- RB16: Qualquer proposta não arquivada pode ser arquivada.
- RB17: Arquivamento é lógico; não há exclusão definitiva pelo usuário na V1.
- RB18: Propostas arquivadas somem da listagem principal.

### Trial e plano

- RB19: Trial ativo permite uso comercial com marca d'água discreta.
- RB20: Trial expirado bloqueia gerar proposta.
- RB21: Trial expirado bloqueia exportar/imprimir proposta.
- RB22: Trial expirado bloqueia enviar/compartilhar proposta por WhatsApp.
- RB23: Trial expirado não bloqueia criação de clientes.
- RB24: Trial expirado não bloqueia criação de serviços.
- RB25: Trial expirado não bloqueia criação de rascunhos.
- RB26: Trial expirado não bloqueia duplicação.
- RB27: Trial expirado não bloqueia visualização interna.
- RB28: Trial expirado deve exibir marca d'água grande em visualizações internas para evitar print comercial limpo.
- RB29: Trial não renova na V1.
- RB30: Plano ativo não desativa na V1.
- RB31: Trial não possui limite de quantidade de clientes, serviços ou rascunhos na V1.

### Mensagens e UX

- RB32: Mensagem padrão ao tentar editar proposta travada: “Esta proposta não pode mais ser editada. Duplique para criar uma nova versão.”
- RB33: Ações comerciais bloqueadas por trial expirado devem orientar o usuário a ativar plano.
- RB34: CTA público recomendado: “Ativar plano”.
- RB35: Nome interno `Fundador` pode permanecer no código nesta feature, mas não deve ser obrigatório na copy principal do usuário.

## Impactos por projeto

### API (`apps/api`)

- Atualizar regra de `PUT /api/proposals/{id}` para rejeitar status `Enviada`, `Aceita` e `Recusada`.
- Manter permissão de atualização para `Rascunho` e `Gerada`.
- Garantir que atualização de `Gerada` volte status para `Rascunho`.
- Retornar `409 Conflict` em conflitos de status/regra de negócio.
- Padronizar mensagem de conflito para edição bloqueada.
- Garantir que duplicação continue permitida em qualquer status não arquivado.
- Garantir que duplicação continue criando `Rascunho`.
- Garantir que arquivamento continue lógico e permitido para qualquer status não arquivado.
- Adicionar/ajustar testes unitários do domínio `Proposta`.
- Adicionar/ajustar testes de integração do controller de propostas.

### Web (`apps/web`)

- Ajustar função de status editável para refletir regra final.
- Exibir confirmação antes de editar proposta `Gerada`.
- Bloquear edição de `Enviada`, `Aceita` e `Recusada` com mensagem padrão.
- Tratar erro `409 Conflict` da API com mensagem amigável.
- Atualizar tooltips e ações da listagem/modal para orientar duplicação.
- Diferenciar marca d'água de trial ativo e trial expirado.
- Exibir marca d'água discreta no trial ativo.
- Exibir marca d'água grande atravessando a página no trial expirado.
- Garantir que preview interno com trial expirado não fique visualmente limpo para print.
- Exibir banner fixo no dashboard e telas de proposta quando trial estiver expirado.
- Trocar CTA público principal de plano para “Ativar plano”.
- Garantir que trial expirado permita criar rascunhos e duplicar, mas bloqueie gerar/exportar/enviar.

### Mobile

- Sem impacto na V1, pois mobile Expo está fora do escopo atual.

### Landing

- Sem impacto direto.
- Futuramente a landing pode refletir nome público final do plano e prints com marca d'água, mas isso não entra nesta feature.

### Packages

- Sem impacto identificado.

### Infra

- Sem migration obrigatória.
- Sem nova variável de ambiente obrigatória.
- Sem mudança de deploy esperada.

## Critérios de aceitação

- CA01: API permite `PUT` em proposta `Rascunho` e mantém status `Rascunho`.
- CA02: API permite `PUT` em proposta `Gerada` e retorna proposta com status `Rascunho`.
- CA03: API rejeita `PUT` em proposta `Enviada` com `409 Conflict`.
- CA04: API rejeita `PUT` em proposta `Aceita` com `409 Conflict`.
- CA05: API rejeita `PUT` em proposta `Recusada` com `409 Conflict`.
- CA06: API mantém geração apenas a partir de `Rascunho`.
- CA07: API mantém envio apenas a partir de `Gerada`.
- CA08: API mantém aceite apenas a partir de `Enviada`.
- CA09: API mantém recusa apenas a partir de `Enviada`.
- CA10: API não permite alternar `Aceita` para `Recusada`.
- CA11: API não permite alternar `Recusada` para `Aceita`.
- CA12: API permite duplicar `Rascunho`, `Gerada`, `Enviada`, `Aceita` e `Recusada`.
- CA13: API não permite duplicar `Arquivada`.
- CA14: Duplicação retorna nova proposta com status `Rascunho`.
- CA15: API permite arquivar qualquer proposta não arquivada.
- CA16: Listagem principal não retorna/mostra proposta `Arquivada`.
- CA17: Web exibe confirmação antes de editar proposta `Gerada`.
- CA18: Web não abre editor direto para `Enviada`, `Aceita` ou `Recusada`.
- CA19: Web orienta duplicação ao tentar editar proposta travada.
- CA20: Web trata `409 Conflict` com mensagem clara.
- CA21: Trial ativo exibe marca d'água discreta no documento/preview.
- CA22: Trial expirado exibe marca d'água grande atravessando a visualização interna.
- CA23: Trial expirado bloqueia gerar proposta no frontend e no backend.
- CA24: Trial expirado bloqueia enviar/compartilhar proposta no frontend e no backend.
- CA25: Trial expirado bloqueia exportação/impressão no frontend.
- CA26: Trial expirado permite criar cliente, serviço e proposta rascunho.
- CA27: Trial expirado permite duplicar proposta.
- CA28: Dashboard exibe banner de trial expirado com CTA “Ativar plano”.
- CA29: Tela de propostas exibe banner de trial expirado com CTA “Ativar plano”.
- CA30: Build, lint e testes relevantes passam.

## Estratégia de implementação (alto nível)

1. Consolidar regras em testes da API antes de alterar comportamento.
2. Ajustar domínio/API para bloquear atualização de status finais com `409 Conflict`.
3. Preservar a regra atual de `Gerada` voltar para `Rascunho` ao salvar.
4. Ajustar controller para mapear conflito de regra de negócio para `409`, não `400`.
5. Atualizar webapp para avisar antes de editar `Gerada`.
6. Atualizar webapp para bloquear edição de `Enviada`, `Aceita` e `Recusada` de forma consistente em listagem, modal e ações contextuais.
7. Atualizar tratamento de erro de API para mensagem amigável quando receber `409`.
8. Separar visualmente a marca d'água por estado comercial da conta: trial ativo versus trial expirado.
9. Inserir banner persistente de trial expirado no dashboard e nas telas de proposta.
10. Atualizar copy pública de CTA para “Ativar plano”, sem exigir renomeação interna do plano nesta feature.
11. Rodar validações automatizadas do web e API.
12. Fazer aceite manual dos fluxos críticos de proposta e trial.

## Testes

- Testes unitários do domínio de proposta:
  - atualização de `Rascunho`;
  - atualização de `Gerada` voltando para `Rascunho`;
  - bloqueio de atualização para `Enviada`, `Aceita`, `Recusada`;
  - duplicação como `Rascunho`;
  - aceite/recusa apenas de `Enviada`;
  - decisão final travada.
- Testes de integração da API:
  - `PUT /api/proposals/{id}` retorna `409` para status travados;
  - `POST /generate` respeita trial expirado;
  - `POST /send` respeita trial expirado;
  - `POST /duplicate` funciona com trial expirado;
  - `DELETE` arquiva e remove da listagem principal.
- Testes web/E2E ou manuais guiados:
  - confirmação ao editar `Gerada`;
  - bloqueio ao editar `Enviada`, `Aceita`, `Recusada`;
  - marca d'água discreta em trial ativo;
  - marca d'água grande em trial expirado;
  - banner de trial expirado no dashboard e propostas;
  - CTA “Ativar plano” visível quando aplicável.

## Riscos e cuidados

- Risco de divergência entre frontend e backend se apenas um lado for atualizado.
- Risco de usuários existentes terem propostas `Gerada` e estranharem volta para `Rascunho` após edição; a confirmação no frontend mitiga isso.
- Risco de marca d'água grande prejudicar legibilidade no preview expirado; precisa ser visível sem impedir entendimento geral.
- Risco de o nome interno `Fundador` continuar aparecendo em algum ponto da UI; revisar copy pública.
- Risco de testes E2E antigos esperarem comportamento anterior; atualizar testes junto da feature.

## Decisões registradas

- `Gerada` pode ser editada e volta para `Rascunho`.
- `Enviada`, `Aceita` e `Recusada` não podem ser editadas diretamente.
- `Aceita` e `Recusada` são decisões finais na V1.
- Arquivar é permitido em qualquer status não arquivado.
- Duplicar é permitido em qualquer status não arquivado.
- Trial expirado pode duplicar, mas não gerar/exportar/enviar.
- Ações inválidas por regra de status retornam `409 Conflict`.
- Cópia de proposta sempre nasce como `Rascunho`.
- Propostas arquivadas somem da listagem principal.
- Trial ativo tem marca d'água discreta.
- Trial expirado tem marca d'água grande atravessando a visualização.
- Trial expirado tem banner fixo no dashboard e propostas.
- CTA público deve ser “Ativar plano”.
- Trial não renova na V1.
- Plano ativo não desativa na V1.
- Usuário não exclui dados definitivamente na V1; apenas arquiva.
- Trial não tem limite de quantidade na V1.

## Perguntas em aberto

- Nenhuma pergunta bloqueante para implementação desta feature.
- A renomeação interna do plano `Fundador` pode ser tratada em spec separada, caso necessário.
