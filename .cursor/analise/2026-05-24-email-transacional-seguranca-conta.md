# Analise - Email transacional e segurança de conta

## Contexto

A demanda surgiu na priorização dos próximos módulos do SaaS Emprely Orçamentos para preparar o beta real antes de avançar para pagamento, checkout ou billing. O risco imediato identificado é o usuário ficar preso em cadastro, login, confirmação de email ou recuperação de senha.

O estado atual observado é:

- a API usa ASP.NET Core Identity com `UserManager<UsuarioAplicacao>`, `SignInManager<UsuarioAplicacao>` e `AddDefaultTokenProviders()`;
- o usuário `UsuarioAplicacao` herda de `IdentityUser<Guid>` e já possui campos nativos como `EmailConfirmed`, `PasswordHash` e email único;
- o cadastro atual cria usuário, conta, membro e perfil em transação;
- o cadastro atual define `EmailConfirmed = true`, então não há confirmação real de email;
- o login atual valida email e senha, mas não bloqueia email não confirmado;
- já existe troca de senha autenticada em `PUT /api/me/password`;
- o webapp tem apenas os modos de autenticação `cadastro` e `login`;
- o link “Esqueci minha senha” ainda usava mailto para suporte, sem fluxo próprio dentro do produto;
- ainda não existe serviço de email transacional, configuração de provedor, templates ou modo fake para testes.

Esta análise não implementa código. Ela serve como base para a próxima etapa SDD da feature.

## Objetivo

Criar a base funcional de email transacional e segurança de conta para o beta do Emprely, substituindo fluxos manuais ou frágeis por fluxos controlados na API e no webapp.

O resultado esperado é:

- novo cadastro exigir confirmação de email;
- usuário receber email transacional de confirmação;
- usuário conseguir reenviar confirmação quando necessário;
- login impedir acesso quando o email ainda não foi confirmado;
- usuário conseguir solicitar recuperação de senha dentro do produto;
- usuário conseguir redefinir senha por link/token;
- webapp oferecer experiência clara para confirmação pendente e recuperação de senha;
- endpoints sensíveis evitarem enumeração de usuários;
- ambiente local e testes funcionarem sem depender de provedor real de email.

## Projetos impactados

- API: endpoints de autenticação, contratos, Identity, configuração de tokens, provedor de email, testes de integração.
- Web: tela de login/cadastro, estados de confirmação pendente, recuperação e redefinição de senha, cliente API, tipos TypeScript e E2E.
- Mobile: não aplicável no momento.
- Landing: não aplicável, salvo se links públicos de cadastro/login forem expostos futuramente.
- Packages: não aplicável no momento.
- Infra: secrets de email, domínio/remetente, URL pública do webapp, persistência de Data Protection keys em staging/produção.

## Fluxo atual

### Cadastro

1. Usuário preenche cadastro no webapp.
2. Webapp chama `POST /api/auth/register`.
3. API normaliza email, valida duplicidade e cria usuário.
4. API define `EmailConfirmed = true`.
5. API cria conta, membro owner e perfil de conta.
6. API retorna JWT imediatamente.
7. Webapp autentica o usuário e entra no produto.

Lacuna: o usuário consegue usar o produto sem validar que controla o email informado.

### Login

1. Usuário informa email e senha.
2. Webapp chama `POST /api/auth/login`.
3. API valida credenciais.
4. API retorna JWT se senha estiver correta.

Lacuna: login não considera confirmação de email.

### Recuperação de senha

1. Usuário clica em “Esqueci minha senha”.
2. Webapp abre cliente de email via `mailto:` para suporte.

Lacuna: não há recuperação automatizada; o usuário depende de atendimento manual.

## Fluxo proposto

### Cadastro com confirmação pendente

1. Usuário preenche cadastro no webapp.
2. Webapp envia `POST /api/auth/register`.
3. API valida duplicidade e cria usuário, conta, membro e perfil.
4. API cria novo usuário com `EmailConfirmed = false`.
5. API gera token de confirmação usando recursos nativos do Identity.
6. API envia email de confirmação com link para o webapp.
7. API retorna resposta de cadastro criado com confirmação pendente.
8. Webapp mostra tela orientando o usuário a confirmar o email.

### Confirmação de email

1. Usuário clica no link recebido.
2. Webapp abre tela/rota de confirmação com `userId` e `token`.
3. Webapp chama endpoint de confirmação de email.
4. API valida token e confirma email.
5. Webapp mostra sucesso e direciona para login.

### Login com email não confirmado

1. Usuário tenta login com email e senha válidos.
2. API detecta que `EmailConfirmed = false`.
3. API bloqueia o login com erro distinguível pelo frontend.
4. Webapp mostra mensagem clara e CTA para reenviar confirmação.

### Reenvio de confirmação

1. Usuário solicita reenvio informando email.
2. API responde de forma neutra, sem revelar se o email existe.
3. Se usuário existir e ainda não estiver confirmado, API gera novo token e envia email.
4. Webapp informa que, se houver uma conta pendente, o email será enviado.

### Solicitação de recuperação de senha

1. Usuário clica em “Esqueci minha senha”.
2. Webapp exibe formulário interno com campo de email.
3. Webapp chama endpoint de recuperação.
4. API responde de forma neutra, independentemente de o email existir.
5. Se usuário existir, API gera token de reset e envia email.
6. Webapp orienta o usuário a verificar a caixa de entrada.

### Redefinição de senha

1. Usuário clica no link de recuperação.
2. Webapp abre tela de redefinição com `userId` e `token`.
3. Usuário informa nova senha e confirmação.
4. Webapp chama endpoint de reset de senha.
5. API valida token e política de senha.
6. API redefine senha.
7. Webapp exibe sucesso e direciona para login.

## Regras de negócio

- Novo usuário deve ser criado com email não confirmado por padrão.
- Usuário com email não confirmado não deve acessar o produto em fluxo normal.
- Login com email não confirmado deve ser tratado diferente de email/senha inválidos para permitir CTA de reenvio no frontend.
- Recuperação de senha não deve revelar se o email existe.
- Reenvio de confirmação não deve revelar se o email existe.
- Token inválido, expirado ou pertencente a outro usuário não deve confirmar email nem redefinir senha.
- Nova senha e confirmação de nova senha devem ser iguais.
- Nova senha deve seguir a mesma política do Identity já configurada.
- Falha no envio de email após cadastro não deve apagar silenciosamente a conta criada; deve haver caminho de reenvio.
- Links enviados por email devem usar URL pública configurável do webapp.
- Tokens não devem aparecer em logs.
- Ambiente de desenvolvimento/teste deve funcionar com provedor fake/logado, sem depender de Resend/Brevo/SES real.

## Impactos técnicos

- Alterar comportamento de `POST /api/auth/register`: hoje retorna JWT e autentica imediatamente; o fluxo recomendado passa a retornar cadastro pendente de confirmação.
- Alterar comportamento de `POST /api/auth/login`: deve bloquear email não confirmado.
- Criar novos contratos de auth para confirmação, reenvio, recuperação e reset de senha.
- Criar abstração de email transacional para desacoplar API do provedor.
- Criar implementação fake para testes e desenvolvimento local.
- Criar implementação real para o provedor escolhido, recomendado Resend para beta.
- Configurar opções de email, remetente, URL pública e secrets por ambiente.
- Avaliar configuração de tempo de vida dos tokens Identity.
- Avaliar persistência das chaves de Data Protection em staging/produção para evitar invalidar tokens após restart/deploy.
- Expandir os estados de autenticação no webapp além de `cadastro` e `login`.
- Substituir o `mailto:` de recuperação por fluxo interno.
- Atualizar testes de integração que hoje esperam JWT imediatamente após cadastro.
- Atualizar E2E web que hoje cadastra e entra direto no produto.
- Atualizar documentação e runbook do beta para incluir provedor de email e troubleshooting.

## Dependências

- Definição do provedor de email transacional.
- Domínio/remetente verificado para envio, por exemplo `no-reply@emprely.com.br`.
- URL pública do webapp no beta/staging para montar links.
- Secret/API key do provedor em ambiente seguro.
- Configuração por ambiente no backend.
- Estratégia de Data Protection keys para staging/produção.
- Ajuste dos testes para usar provedor fake.
- Decisão de produto sobre liberar ou não login limitado antes da confirmação. Recomendação atual: não liberar.

## Riscos

- Quebrar fluxo atual de cadastro e testes porque o cadastro deixa de retornar JWT imediatamente.
- Usuários ficarem bloqueados se o provedor de email falhar ou se o domínio/remetente não estiver configurado corretamente.
- Tokens de confirmação/reset expirarem ou invalidarem após restart se Data Protection não estiver persistido corretamente.
- Enumeração de usuários caso mensagens de erro revelem se um email existe.
- Vazamento de tokens em logs, analytics ou ferramentas de observabilidade.
- Entregabilidade baixa se domínio, SPF, DKIM e DMARC não estiverem configurados corretamente.
- Confusão de UX se o usuário criar conta e não entender que precisa confirmar email antes de entrar.
- Contas legadas com `EmailConfirmed = true` precisam ser preservadas sem migração destrutiva.

## Dúvidas

- Qual provedor será usado no beta: Resend, Brevo, Amazon SES ou SMTP temporário?
- O cadastro deve bloquear totalmente o primeiro login até a confirmação? Recomendação: sim.
- Qual será o remetente oficial? Exemplo: `no-reply@emprely.com.br`.
- Qual será a URL pública do webapp para links enviados por email?
- Qual expiração desejada para confirmação de email: 24h ou 48h?
- Qual expiração desejada para reset de senha: 1h ou 2h?
- Deve haver tela específica de “email confirmado com sucesso” ou redirecionamento direto para login com toast/mensagem?
- Em caso de falha de envio no cadastro, a API deve retornar sucesso com aviso de reenvio ou erro explícito para o usuário tentar novamente?
- Será necessário registrar data/hora de envio de confirmação e reset para suporte/observabilidade já nesta fase?
