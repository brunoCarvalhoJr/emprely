# Spec - Email transacional e segurança de conta

## Visão geral

Esta feature implementa a base de email transacional e segurança de conta do Emprely Orçamentos para o beta real. O objetivo é reduzir o risco de usuários ficarem presos no cadastro, login, confirmação de email, recuperação de senha ou suporte, antes de avançar para checkout, billing e pagamento real.

Hoje o cadastro cria o usuário com `EmailConfirmed = true`, retorna JWT imediatamente e permite uso do sistema sem validar se o usuário controla o email informado. A recuperação de senha ainda depende de um link `mailto:` para suporte, sem fluxo automatizado dentro do produto.

A nova solução deve introduzir confirmação de email, recuperação/redefinição de senha, alteração de email com confirmação, emails transacionais de ciclo de conta/trial, suporte completo e uma área admin mínima para histórico/reenvio de emails. A integração de email será feita via **Amazon SES**, usando **API do SES**, região **us-east-1**, com a API do Emprely rodando **dentro da AWS** e usando **IAM Role** sempre que possível.

Status em 2026-05-24: especificação completa criada. Nenhum código foi implementado nesta etapa.
Atualizacao em 2026-06-14: o email oficial inicial da API foi alinhado com a caixa criada no Zoho, `contato@emprely.com.br`, conforme `spec/2026-06-14-email-api-contato-emprely.md`.

## Decisões já tomadas

- Provedor de email: **Amazon SES**.
- Região AWS/SES: **us-east-1**.
- Modo de envio: **API do SES**.
- API do Emprely no beta: **dentro da AWS**.
- Credencial preferida: **IAM Role**, sem access key fixa quando o runtime permitir.
- Remetente: `contato@emprely.com.br`.
- Nome do remetente: `Emprely`.
- URL pública do webapp para links: `https://app.emprely.com.br`.
- Responsável por DNS/domínio: **Bruno**.
- Secrets/configuração sensível: **secret do ambiente de deploy**.
- Volume beta esperado: **baixo**, até 50 usuários beta e até 500 emails/dia.
- Alertas de falha, bounce e complaint: **Suporte Emprely**.
- Admin de histórico/reenvio: **Super admin**.
- SPF/DMARC atual: **não se sabe**, precisa verificar antes da implementação.
- Gate obrigatório para pronto: `pnpm validate:beta`.
- Ambiente local sem API key: usar provedor fake/log.
- Testes de email: usar provedor fake em memória.

## Escopo

### Inclui

- Confirmação de email no cadastro.
- Reenvio de email de confirmação pelo usuário.
- Bloqueio de login enquanto email não estiver confirmado.
- Recuperação de senha por email.
- Redefinição de senha por token.
- Alteração de email do usuário com confirmação do novo email.
- Emails de boas-vindas.
- Emails operacionais de trial:
  - trial iniciado;
  - trial próximo do fim;
  - trial expirado;
  - avisos ligados ao estado da conta.
- Suporte completo dentro do produto.
- Email de confirmação/recebimento de contato de suporte, quando aplicável.
- Tela admin para super admin consultar histórico básico de emails e reenviar confirmações quando necessário.
- Integração backend com Amazon SES via API.
- Configuração mínima de DNS/domínio para SES.
- Observabilidade mínima de envio, falha, bounce e complaint.
- Rate limit nos endpoints públicos sensíveis.
- Testes automatizados com provedor fake em memória.
- Atualização do E2E web para cadastro pendente, login bloqueado e recuperação de senha.
- Atualização de documentação/runbook da operação beta.

### Fora do escopo

- Login social.
- MFA/2FA.
- Magic link de login sem senha.
- Convites multiusuário/equipe.
- Gestão avançada de opt-in/opt-out de marketing.
- Campanhas promocionais ou newsletter.
- Editor visual de templates de email.
- Segmentação avançada de emails.
- CRM ou automação de marketing.
- Checkout, cobrança, invoices, assinatura e webhooks de pagamento.
- Área admin completa de usuários/contas além do necessário para histórico/reenvio de emails.
- Auditoria completa de segurança além dos eventos mínimos definidos nesta spec.

## Fluxo ponta a ponta

### 1. Cadastro com confirmação de email

#### Frontend

1. Usuário acessa a tela pública do Emprely.
2. Usuário preenche cadastro com nome, email, senha, telefone e nome da empresa.
3. Webapp envia `POST /api/auth/register`.
4. Ao receber sucesso, webapp não cria sessão autenticada.
5. Webapp mostra tela “Confirme seu email”.
6. Tela informa que o usuário precisa abrir o email enviado e confirmar o cadastro.
7. Tela oferece ação de reenviar confirmação.

#### Backend

1. API normaliza email.
2. API valida duplicidade.
3. API cria usuário, conta, membro owner e perfil de conta em transação.
4. Usuário novo é criado com `EmailConfirmed = false`.
5. API gera token de confirmação via ASP.NET Core Identity.
6. API monta link usando `https://app.emprely.com.br`.
7. API solicita envio de email transacional ao serviço de email.
8. API registra tentativa de envio com tipo, destinatário mascarado/hash, status e identificador do provedor quando disponível.
9. API retorna resposta indicando cadastro criado e confirmação pendente.

#### Integração Amazon SES

1. Serviço de email envia mensagem via API do SES em `us-east-1`.
2. O remetente usado é `Emprely <contato@emprely.com.br>`.
3. SES retorna identificador da mensagem.
4. Backend armazena o resultado mínimo necessário para suporte/admin.

### 2. Falha no envio de confirmação após cadastro

#### Regra decidida

A conta permanece criada. O usuário deve ver opção de reenviar confirmação.

#### Fluxo

1. Cadastro é concluído no banco.
2. Envio de email falha por erro temporário, configuração ou SES.
3. API registra falha.
4. Webapp mostra a tela “Confirme seu email” com orientação de reenviar.
5. Reenvio pode ser acionado pelo usuário ou por super admin.

### 3. Confirmação de email

#### Frontend

1. Usuário clica no link recebido por email.
2. Webapp abre rota/tela de confirmação com `userId` e `token`.
3. Webapp chama endpoint de confirmação.
4. Se confirmar com sucesso, webapp redireciona para login.
5. Se token estiver inválido/expirado, webapp mostra erro e botão para reenviar confirmação.

#### Backend

1. API recebe `userId` e `token`.
2. API localiza usuário.
3. API valida token pelo Identity.
4. API marca email como confirmado.
5. API registra evento de segurança mínimo.
6. API retorna sucesso.

### 4. Login com email não confirmado

#### Frontend

1. Usuário informa email e senha.
2. Webapp envia `POST /api/auth/login`.
3. Se API indicar email não confirmado, webapp não entra no sistema.
4. Webapp mostra mensagem clara e CTA de reenvio de confirmação.

#### Backend

1. API valida usuário e senha.
2. Se credenciais estiverem inválidas, retorna erro genérico de credenciais.
3. Se credenciais estiverem válidas, mas email não confirmado, retorna erro distinguível para o frontend.
4. API não emite JWT para email não confirmado.

### 5. Reenvio de confirmação pelo usuário

#### Frontend

1. Usuário informa email ou usa email já preenchido na tela de confirmação pendente.
2. Webapp chama endpoint de reenvio.
3. Webapp mostra mensagem neutra: se houver uma conta pendente, um novo email será enviado.

#### Backend

1. API recebe email.
2. API responde de forma neutra para evitar enumeração.
3. Se usuário existir e email não estiver confirmado, gera novo token e envia email.
4. Se usuário não existir ou já estiver confirmado, não revela essa informação.
5. API aplica rate limit.

### 6. Recuperação de senha

#### Frontend

1. Usuário clica em “Esqueci minha senha”.
2. Webapp abre fluxo interno de recuperação, sem `mailto:`.
3. Usuário informa email.
4. Webapp chama endpoint de recuperação.
5. Webapp mostra mensagem neutra orientando verificar a caixa de entrada.

#### Backend

1. API recebe email.
2. API responde de forma neutra, independentemente de o email existir.
3. Se usuário existir, API gera token de reset com validade de 1 hora.
4. Usuário com email não confirmado pode solicitar reset.
5. API envia email de recuperação via SES.
6. API aplica rate limit por IP/email.

### 7. Redefinição de senha

#### Frontend

1. Usuário clica no link de recuperação.
2. Webapp abre tela de redefinição com `userId` e `token`.
3. Usuário informa nova senha e confirmação.
4. Webapp chama endpoint de reset.
5. Se sucesso, webapp mostra mensagem de sucesso e botão “Entrar”.
6. Se token estiver inválido/expirado, webapp mostra erro e botão para pedir novo link.

#### Backend

1. API valida usuário e token.
2. API valida política de senha.
3. API exige que nova senha e confirmação sejam iguais.
4. API redefine senha.
5. API registra evento de segurança mínimo.
6. API não autentica automaticamente o usuário.

### 8. Alteração de email com confirmação

#### Frontend

1. Usuário autenticado acessa área de conta/segurança.
2. Usuário solicita alterar email.
3. Webapp envia novo email para API.
4. Webapp informa que o novo email precisa ser confirmado.

#### Backend

1. API valida usuário autenticado.
2. API valida se o novo email já está em uso.
3. API gera token de confirmação para o novo email.
4. API envia confirmação para o novo endereço.
5. API só troca o email principal após confirmação do novo endereço.
6. API deve considerar avisar o email antigo por segurança.

### 9. Emails de boas-vindas e trial

#### Regra recomendada

Emails de trial ligados ao estado da conta são tratados como transacionais/operacionais. Campanhas comerciais e promoções ficam fora desta feature ou entram futuramente como marketing separado.

#### Fluxos incluídos

- Boas-vindas após email confirmado ou primeiro acesso válido.
- Trial iniciado.
- Trial próximo do fim.
- Trial expirado.
- Avisos operacionais ligados a bloqueios/estado da conta.

### 10. Suporte completo

#### Frontend

1. Usuário acessa fluxo de suporte dentro do produto.
2. Usuário descreve o problema.
3. Webapp envia solicitação ao backend.
4. Usuário recebe confirmação visual.

#### Backend

1. API registra solicitação de suporte.
2. API envia email operacional para Suporte Emprely ou canal definido.
3. API pode enviar confirmação ao usuário, quando aplicável.

### 11. Tela admin de histórico e reenvio

#### Frontend/Admin

1. Super admin acessa tela admin.
2. Super admin consulta histórico básico de emails por usuário/conta.
3. Super admin pode reenviar confirmação quando aplicável.

#### Backend

1. API exige permissão de super admin.
2. API retorna histórico mínimo de emails.
3. API executa reenvio manual permitido.
4. API registra auditoria mínima da ação admin.

### 12. Eventos SES: bounce, complaint e falhas

#### Integração

1. SES emite eventos de bounce, complaint, reject/failure e delivery quando configurado.
2. Eventos devem ser roteados via SNS, EventBridge ou mecanismo AWS equivalente.
3. Backend ou processo operacional registra eventos importantes.
4. Hard bounce deve restringir reenvio automático para o endereço.
5. Complaint deve suprimir emails não essenciais e alertar suporte/admin.

## Requisitos

### Requisitos funcionais

- RF01: Cadastro deve criar usuário com email não confirmado por padrão.
- RF02: Cadastro não deve autenticar automaticamente o usuário.
- RF03: Cadastro deve disparar email de confirmação via Amazon SES.
- RF04: Usuário não pode entrar no sistema antes de confirmar email.
- RF05: Usuários antigos já marcados como confirmados não devem ser afetados.
- RF06: Falha no envio de confirmação não deve apagar a conta criada.
- RF07: Usuário deve conseguir solicitar reenvio de confirmação.
- RF08: Reenvio de confirmação deve usar resposta neutra para evitar enumeração.
- RF09: Link de confirmação deve expirar em 24 horas.
- RF10: Link inválido/expirado de confirmação deve mostrar erro e permitir reenvio.
- RF11: Recuperação de senha deve acontecer dentro do produto, sem `mailto:`.
- RF12: Usuário com email não confirmado pode solicitar recuperação de senha.
- RF13: Solicitação de recuperação deve responder de forma neutra.
- RF14: Link de recuperação de senha deve expirar em 1 hora.
- RF15: Redefinição de senha deve validar token, política de senha e confirmação da nova senha.
- RF16: Após redefinição bem-sucedida, usuário deve ver sucesso e botão “Entrar”.
- RF17: Link inválido/expirado de reset deve mostrar erro e permitir pedir novo link.
- RF18: Alteração de email deve exigir confirmação do novo email antes de trocar o email principal.
- RF19: Deve haver emails de boas-vindas e emails operacionais de trial.
- RF20: Deve haver fluxo completo de suporte dentro do produto.
- RF21: Deve haver tela admin para super admin consultar histórico e reenviar confirmação.
- RF22: Deve haver modo fake/log em ambiente local sem API key.
- RF23: Testes automatizados devem validar envio via fake em memória.
- RF24: Alertas de falha, bounce e complaint devem ir para Suporte Emprely.

### Requisitos não funcionais

- RNF01: Não revelar se um email existe nos endpoints públicos de recuperação e reenvio.
- RNF02: Aplicar rate limit em cadastro, login, reenvio de confirmação, recuperação e reset de senha.
- RNF03: Tokens em URL devem ser codificados de forma segura.
- RNF04: Links enviados por email devem usar HTTPS e `https://app.emprely.com.br`.
- RNF05: Segredos AWS/SES não podem ser versionados.
- RNF06: Em AWS, preferir IAM Role a access key fixa.
- RNF07: Logs não devem armazenar tokens de confirmação/reset.
- RNF08: Logs de email devem mascarar ou hashear destinatários quando possível.
- RNF09: Templates de email devem ser simples, claros e funcionais sem depender de imagens externas.
- RNF10: Integração SES deve ser observável: status, falha, message id e eventos críticos.
- RNF11: A solução deve preservar dados existentes e não exigir migração destrutiva.
- RNF12: `pnpm validate:beta` deve passar para considerar a feature pronta.

## Regras de negócio

- RB01: Novo cadastro começa com email não confirmado.
- RB02: Email não confirmado bloqueia login e emissão de JWT.
- RB03: Usuário só entra após confirmar email.
- RB04: Usuários antigos com email confirmado permanecem válidos.
- RB05: Falha de envio não cancela a criação da conta.
- RB06: Reenvio de confirmação não revela existência de conta.
- RB07: Recuperação de senha não revela existência de conta.
- RB08: Usuário não confirmado pode recuperar senha, mas continua sem entrar enquanto não confirmar email.
- RB09: Link de confirmação vale 24 horas.
- RB10: Link de reset vale 1 hora.
- RB11: Reset de senha não autentica automaticamente.
- RB12: Alteração de email só troca o email principal depois da confirmação do novo endereço.
- RB13: Emails de trial ligados ao estado da conta são transacionais/operacionais.
- RB14: Campanhas comerciais, promoções e newsletter não entram nesta feature.
- RB15: Somente super admin pode usar tela admin de histórico/reenvio.
- RB16: Reenvio manual admin deve ser auditável.
- RB17: Hard bounce deve bloquear reenvio automático para o endereço afetado.
- RB18: Complaint deve suprimir emails não essenciais para o endereço afetado.

## Impactos por projeto

### API (`apps/api`)

- Ajustar cadastro para criar usuário não confirmado e não retornar sessão autenticada.
- Ajustar login para bloquear email não confirmado.
- Criar contratos de confirmação, reenvio, recuperação, reset e alteração de email.
- Criar abstração de email transacional.
- Criar provedor fake/log para desenvolvimento e testes.
- Criar provedor Amazon SES via API.
- Configurar opções de email, URL pública, remetente, região, token lifetime e provider.
- Persistencia de Data Protection keys implementada em 2026-06-14 via `spec/2026-06-14-data-protection-keys-postgres.md`, usando a tabela `data_protection_keys` no Postgres/Neon.
- Implementar registro/histórico básico de envio de emails.
- Implementar endpoints de suporte.
- Implementar endpoints admin de histórico e reenvio.
- Implementar tratamento mínimo de eventos SES para bounce/complaint/failure.
- Atualizar testes de integração.

### Web (`apps/web`)

- Expandir fluxo de autenticação além de `cadastro` e `login`.
- Criar estado/tela “Confirme seu email”.
- Criar fluxo de reenvio de confirmação.
- Criar fluxo interno de recuperação de senha.
- Criar tela de redefinição de senha.
- Criar fluxo de alteração de email com confirmação.
- Criar UI de suporte completo dentro do produto.
- Criar ou preparar UI admin para histórico/reenvio de emails por super admin.
- Atualizar cliente API e tipos de auth.
- Atualizar mensagens de erro e feedbacks de usuário.
- Atualizar E2E para cadastro pendente, login bloqueado e recuperação de senha.

### Infra/AWS

- Verificar domínio `emprely.com.br` no Amazon SES em `us-east-1`.
- Configurar DKIM via CNAMEs gerados pelo SES.
- Verificar/criar SPF.
- Verificar/criar DMARC, iniciando preferencialmente com `p=none` para monitoramento.
- Avaliar MAIL FROM customizado, por exemplo `mail.emprely.com.br`.
- Solicitar saída do sandbox do SES antes do beta real.
- Configurar IAM Role para runtime da API enviar emails.
- Restringir permissões SES ao mínimo necessário.
- Configurar SNS/EventBridge/CloudWatch para eventos e alertas mínimos.
- Enviar alertas operacionais para Suporte Emprely.

### Documentação/Produto

- Atualizar runbook beta com configuração SES, DNS, sandbox e troubleshooting.
- Documentar variáveis/secrets necessários.
- Documentar fluxos de suporte e admin.
- Documentar política de bounce/complaint.
- Registrar que emails de trial operacionais são transacionais e campanhas ficam fora do escopo.

### Banco de dados

- Avaliar necessidade de tabela para histórico de emails.
- Avaliar necessidade de campos auxiliares para alteração de email pendente.
- Avaliar necessidade de tabela/evento para suporte.
- Evitar migration desnecessária para tokens se Identity/Data Protection atender ao fluxo.
- Não alterar usuários antigos confirmados.

## Integrações

### Amazon SES

- Região: `us-east-1`.
- Modo: API do SES.
- Remetente: `Emprely <contato@emprely.com.br>`.
- Domínio: `emprely.com.br`.
- URL dos links: `https://app.emprely.com.br`.
- Volume inicial: até 50 usuários beta e até 500 emails/dia.

### DNS

- Bruno configura registros necessários.
- Necessário verificar SPF/DMARC atuais.
- Necessário configurar DKIM SES.
- Recomendado configurar MAIL FROM customizado.

### IAM/Secrets

- Runtime dentro da AWS deve usar IAM Role.
- Se algum ambiente rodar fora da AWS, usar credenciais restritas em secret de deploy.
- Nunca versionar credenciais.

### Eventos e alertas

- Monitorar sends, deliveries, rejects, bounces e complaints.
- Alertas para Suporte Emprely.
- Hard bounce e complaint devem influenciar política de reenvio.

## Critérios de aceitação

- CA01: Novo cadastro cria usuário com email não confirmado.
- CA02: Novo cadastro não retorna JWT nem cria sessão autenticada.
- CA03: Após cadastro, webapp mostra tela “Confirme seu email”.
- CA04: Email de confirmação é registrado no fake em memória nos testes.
- CA05: Email de confirmação real usa Amazon SES no ambiente configurado.
- CA06: Link válido confirma email e permite login posterior.
- CA07: Link de confirmação expirado/inválido mostra erro e permite reenvio.
- CA08: Login com email não confirmado é bloqueado e mostra CTA de reenvio.
- CA09: Usuários antigos confirmados continuam conseguindo acessar.
- CA10: Reenvio de confirmação não revela se email existe.
- CA11: Recuperação de senha não revela se email existe.
- CA12: Usuário não confirmado pode solicitar reset de senha.
- CA13: Link válido de reset permite redefinir senha.
- CA14: Link de reset expirado/inválido mostra erro e permite pedir novo link.
- CA15: Após reset, senha antiga não funciona e nova senha funciona.
- CA16: Após reset, usuário vê sucesso e botão “Entrar”.
- CA17: Alteração de email exige confirmação do novo endereço.
- CA18: Emails de boas-vindas e trial operacional estão previstos e testáveis.
- CA19: Fluxo de suporte completo está disponível no produto.
- CA20: Super admin consegue consultar histórico básico de emails e reenviar confirmação.
- CA21: Ambiente local sem API key usa fake/log.
- CA22: Tokens não aparecem em logs.
- CA23: Rate limit é aplicado nos endpoints sensíveis.
- CA24: `pnpm validate:beta` passa.

## Estratégia de implementação alto nível

### Fase 1 - Base de contratos e configuração

1. Definir contratos públicos de auth, suporte e admin.
2. Definir opções de configuração para app, email, SES e token lifetime.
3. Definir estratégia de fake/log local.
4. Definir estrutura mínima de histórico de emails, se necessária.

### Fase 2 - Backend auth e email fake

1. Alterar cadastro para confirmação pendente.
2. Implementar confirmação de email.
3. Implementar reenvio de confirmação.
4. Implementar recuperação/reset de senha.
5. Implementar alteração de email com confirmação.
6. Implementar provedor fake em memória para testes.
7. Cobrir fluxos principais com testes de integração.

### Fase 3 - Integração Amazon SES

1. Criar provedor SES via API.
2. Integrar com IAM Role em AWS.
3. Configurar remetente, região e URL pública.
4. Preparar tratamento de erros do SES.
5. Preparar registro de message id e status.

### Fase 4 - Frontend auth

1. Expandir estados de autenticação.
2. Criar tela de confirmação pendente.
3. Criar tela de confirmação realizada/erro.
4. Criar recuperação e redefinição de senha.
5. Criar alteração de email com confirmação.
6. Atualizar mensagens e CTAs.

### Fase 5 - Suporte e admin

1. Implementar fluxo completo de suporte.
2. Implementar histórico básico de emails.
3. Implementar reenvio manual para super admin.
4. Adicionar auditoria mínima das ações admin.

### Fase 6 - Infra e operação beta

1. Verificar domínio no SES.
2. Configurar DKIM, SPF, DMARC e opcionalmente MAIL FROM.
3. Solicitar saída do sandbox.
4. Configurar alertas para Suporte Emprely.
5. Validar envio real para Gmail/Outlook.

### Fase 7 - Validação final

1. Atualizar E2E web para cadastro pendente, login bloqueado e recuperação de senha.
2. Rodar `pnpm validate:beta`.
3. Atualizar documentação/runbook.
4. Registrar limitações e próximos passos.

## Riscos e mitigação

- Risco: SES ficar em sandbox no beta.
  - Mitigação: solicitar saída do sandbox antes do lançamento.
- Risco: DNS/SPF/DMARC atual desconhecido.
  - Mitigação: verificar DNS antes da implementação e registrar alterações necessárias.
- Risco: emails caírem em spam.
  - Mitigação: configurar DKIM/SPF/DMARC, conteúdo simples e baixo volume inicial.
- Risco: quebrar cadastro/E2E atual que espera JWT imediato.
  - Mitigação: atualizar testes e webapp para fluxo pendente.
- Risco: token inválido após restart/deploy.
  - Mitigacao: Data Protection keys persistidas no Postgres/Neon via `data_protection_keys`.
- Risco: enumeração de usuários.
  - Mitigação: respostas neutras em reenvio e recuperação.
- Risco: abuso de recuperação/reenvio.
  - Mitigação: rate limit por IP/email e auditoria mínima.
- Risco: bounce/complaint ignorado prejudicar reputação.
  - Mitigação: configurar eventos e política mínima de supressão.

## Dúvidas remanescentes

- O DNS atual de `emprely.com.br` já possui SPF e DMARC?
- Será configurado MAIL FROM customizado no beta ou ficará para depois?
- Qual endereço/lista exata receberá alertas de Suporte Emprely?
- Futuro: avaliar se Data Protection keys devem migrar para S3, Parameter Store ou Secrets Manager quando a infra sair do MVP barato.
- O email antigo deve sempre receber aviso quando o usuário solicitar alteração de email?
