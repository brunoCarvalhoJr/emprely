# Analise - Administracao de usuarios, planos e emails

## Contexto

O Emprely ja possui uma base inicial de operacoes administrativas, mas ainda limitada:

- `AdminAccountsController` permite ativar o Plano Fundador para uma conta especifica.
- `AdminEmailsController` permite consultar historico recente de emails transacionais e reenviar confirmacao de email.
- O frontend ja possui uma tela simples de `Admin emails`, protegida por chave administrativa.
- O dominio de contas ja possui `PlanoConta` com `Trial` e `Fundador`.
- O dominio de contas ja possui `StatusConta` com `Ativa`, `Suspensa` e `Cancelada`.
- O dominio de membros ja possui `StatusMembroConta` com `Ativo` e `Inativo`.
- A autenticacao usa ASP.NET Core Identity com `UsuarioAplicacao`.
- O beta atual ainda depende de operacoes manuais para plano, trial, acesso e suporte.

O usuario solicitou o planejamento de uma tela administrativa completa para usuarios, planos, acessos e comunicacao individual. Esta etapa e apenas de analise. Nao deve criar codigo, endpoints, componentes, migrations ou estilos.

## Objetivo

Planejar uma area administrativa interna para o super admin do Emprely conseguir:

- listar e pesquisar usuarios;
- visualizar contas vinculadas;
- criar usuario manualmente;
- atribuir plano;
- ativar Plano Fundador;
- estender trial;
- atribuir dias gratis;
- remover acesso sem apagar dados indevidamente;
- bloquear usuario;
- desbloquear usuario;
- suspender ou reativar conta;
- enviar email personalizado para um usuario;
- consultar historico de emails;
- consultar historico de acoes administrativas;
- reduzir operacoes manuais diretamente no banco.

O objetivo principal e dar controle operacional durante o beta e preparar uma base segura para suporte, vendas manuais do Plano Fundador e administracao futura de assinaturas.

## Fluxo

### Fluxo de acesso administrativo

1. Super admin acessa a area administrativa.
2. Sistema solicita chave administrativa ou autenticacao administrativa equivalente.
3. Sistema valida permissao antes de carregar dados sensiveis.
4. Sistema exibe painel de usuarios e contas.
5. Super admin executa operacoes com confirmacao explicita quando houver risco.
6. Sistema registra auditoria de cada acao critica.
7. Sistema atualiza dados e mostra feedback claro.

### Fluxo da tela principal

1. Super admin abre a tela `Admin usuarios`.
2. Sistema carrega lista paginada de usuarios/contas.
3. Super admin filtra por nome, email, conta, plano, status comercial, status da conta, email confirmado e bloqueio.
4. Super admin seleciona um usuario.
5. Sistema abre painel lateral ou detalhe completo com:
   - dados do usuario;
   - dados da conta;
   - plano atual;
   - status comercial;
   - trial e dias restantes;
   - status de acesso;
   - historico de emails;
   - historico administrativo.
6. Super admin escolhe uma acao.
7. Acoes criticas exigem confirmacao, motivo e resumo do impacto.
8. Sistema executa a acao e atualiza lista/detalhe.

### Fluxo de plano e dias gratis

1. Super admin seleciona uma conta.
2. Sistema exibe plano atual e status comercial calculado.
3. Super admin escolhe uma acao:
   - ativar Plano Fundador;
   - alterar plano;
   - estender trial;
   - adicionar dias gratis;
   - corrigir data de fim do trial.
4. Sistema exige motivo administrativo.
5. Sistema aplica alteracao.
6. Sistema registra auditoria.
7. Sistema mostra novo status comercial.

### Fluxo de bloqueio e remocao de acesso

1. Super admin seleciona usuario ou conta.
2. Sistema diferencia bloqueio de usuario, suspensao de conta e cancelamento comercial.
3. Super admin escolhe acao:
   - bloquear usuario individual;
   - desbloquear usuario;
   - inativar membro da conta;
   - suspender conta;
   - reativar conta;
   - cancelar conta.
4. Sistema mostra consequencia antes de confirmar.
5. Sistema exige motivo.
6. Sistema registra auditoria.
7. Usuario afetado perde ou recupera acesso conforme a acao.

### Fluxo de criacao manual de usuario

1. Super admin clica em criar usuario.
2. Sistema solicita nome, email, telefone opcional, nome da conta, plano inicial e politica de email.
3. Super admin escolhe se o usuario recebera email de convite, confirmacao ou redefinicao de senha.
4. Sistema cria usuario, conta, membro owner e perfil inicial, seguindo as mesmas regras do cadastro publico.
5. Sistema registra auditoria.
6. Sistema mostra resumo da conta criada.

### Fluxo de email personalizado

1. Super admin seleciona usuario.
2. Sistema abre composer de email.
3. Super admin informa assunto e mensagem.
4. Sistema mostra preview simples.
5. Super admin confirma envio.
6. Sistema envia pelo provedor transacional configurado.
7. Sistema registra email no historico transacional com tipo administrativo.
8. Sistema registra auditoria da acao.

## Regras

- A tela deve ser invisivel para usuarios comuns.
- Toda operacao administrativa deve exigir permissao administrativa valida.
- A chave administrativa nao deve ficar persistida de forma insegura no frontend.
- Acoes criticas devem exigir confirmacao e motivo.
- Nao deve haver delete fisico de usuario/conta no MVP administrativo.
- Remover acesso deve significar suspender conta, cancelar conta, bloquear usuario ou inativar membro, conforme o caso.
- Bloqueio de usuario deve impedir login daquele usuario.
- Suspensao de conta deve impedir uso do produto pela conta, mesmo que o usuario consiga autenticar.
- Cancelamento deve preservar dados para auditoria e suporte, salvo decisao futura de LGPD.
- Alteracao de plano deve refletir imediatamente nas regras de uso do produto.
- Extensao de trial e dias gratis devem atualizar a data de fim do periodo gratuito.
- Email personalizado deve ficar registrado no historico de emails.
- Email personalizado nao deve ser usado como campanha de marketing nesta fase.
- Dados sensiveis devem ser mascarados quando exibidos em listas.
- Historico administrativo deve registrar quem fez, quando fez, alvo, acao, motivo e resultado.
- Operacoes devem ser idempotentes quando fizer sentido, por exemplo ativar Fundador em conta ja Fundador.
- Falha de envio de email nao deve corromper alteracao de plano/acesso ja confirmada; precisa ser registrada como falha operacional.
- O MVP deve manter escopo pequeno: administracao operacional, nao CRM completo, billing completo ou automacao de marketing.

## Impactos

### Backend

- Expandir a area administrativa existente.
- Criar consultas administrativas paginadas para usuarios, contas, membros e emails.
- Criar contratos administrativos para listagem, detalhe, criacao e acoes.
- Criar acoes administrativas para plano, trial, acesso, bloqueio e email personalizado.
- Adicionar auditoria administrativa.
- Possivelmente ampliar o dominio de conta para suportar extensao controlada de trial e mudancas de status.
- Possivelmente ampliar o dominio de email transacional para tipo administrativo personalizado.
- Reforcar validacao de permissao administrativa.

### Frontend

- Criar uma tela administrativa dedicada, separada da tela simples de `Admin emails`.
- Adicionar tabela de usuarios/contas com filtros e paginacao.
- Adicionar painel de detalhes.
- Adicionar formularios de acao com confirmacao.
- Adicionar composer de email personalizado.
- Adicionar historico de emails e historico administrativo.
- Reaproveitar padroes visuais existentes do app, evitando uma tela com visual de landing.

### Banco de dados

- Pode precisar de tabela de auditoria administrativa.
- Pode precisar registrar metadados de bloqueio, motivo, autor e datas.
- Pode precisar de novos campos ou eventos para trial estendido e dias gratis.
- Pode precisar de novo tipo de email transacional administrativo.
- Nao deve armazenar secrets ou chave administrativa em tabela comum.

### Produto e operacao

- Reduz dependencia de alteracoes diretas no banco.
- Acelera suporte durante beta assistido.
- Facilita venda manual do Plano Fundador.
- Cria rastreabilidade para decisoes de acesso e plano.
- Aumenta responsabilidade operacional, pois a tela passa a ter poder alto.

## Dependencias

- ASP.NET Core Identity para usuarios, bloqueio e validacao de credenciais.
- `EmprelyDbContext` para contas, membros, perfis, emails e dados comerciais.
- `AdminOperacoesOptions` e header administrativo atual.
- `IEmailTransacionalService` para envio de emails.
- Amazon SES configurado no beta.
- Regras atuais de plano `Trial` e `Fundador`.
- Status atuais de conta e membro.
- Webapp React/Vite atual, que ainda concentra a maior parte da UI em `App.tsx`.
- Definicao de como o super admin deve autenticar no futuro: chave administrativa, login administrativo ou role interna.
- Definicao de quais planos existirao alem de Trial e Fundador.

## Riscos

- Expor dados sensiveis demais na UI administrativa.
- Vazamento de chave administrativa se ela for persistida no navegador.
- Operacao incorreta bloquear cliente real ou remover acesso indevidamente.
- Alteracoes de plano sem auditoria causarem divergencia comercial.
- Criacao manual de usuario duplicar fluxo de cadastro e gerar inconsistencia entre usuario, conta, membro e perfil.
- Envio de email personalizado virar ferramenta de marketing antes de haver regras de consentimento.
- Falha parcial: plano alterado com email de aviso nao enviado.
- Ausencia de paginacao prejudicar performance quando houver mais usuarios.
- Confusao entre usuario bloqueado, membro inativo, conta suspensa e conta cancelada.
- Dependencia excessiva de uma chave administrativa unica.
- Falta de testes em operacoes administrativas causar regressao em login, trial ou geracao de propostas.

## Duvidas

- A primeira versao deve continuar usando `X-Emprely-Admin-Key` ou ja deve exigir login de super admin?
- Quem pode acessar esta tela alem do Bruno?
- O admin deve conseguir criar usuario com senha temporaria ou apenas enviar link de definicao/redefinicao de senha?
- Quando o admin cria usuario manualmente, o email deve nascer confirmado ou deve seguir o fluxo normal de confirmacao?
- `Dias gratis` deve ser apenas extensao de trial ou um beneficio separado do plano?
- Deve existir plano alem de `Trial` e `Fundador` nesta fase?
- `Remover acesso` significa suspender conta inteira, inativar membro ou bloquear usuario?
- Conta `Cancelada` deve poder ser reativada pelo admin?
- Usuario bloqueado deve receber email automatico ou isso deve ser opcional?
- Email personalizado deve aceitar apenas texto simples ou tambem HTML/template?
- O historico administrativo deve aparecer so no admin ou tambem em algum painel interno de suporte?
- Deve haver exportacao CSV da lista de usuarios no MVP?
- Deve haver filtro por usuarios com trial perto de expirar?
- Deve haver acao em massa ou apenas acoes individuais no MVP?
- Quais dados podem ser exibidos sem mascaramento para o super admin?

## Atualizacao 2026-06-17 - ajustes solicitados

- A tela `/admin` nao deve oferecer fluxo publico de `Criar owner` ou bootstrap administrativo.
- A criacao/manutencao de administradores deve acontecer apenas dentro do painel autenticado.
- A permissao para criar, listar, bloquear/desbloquear ou alterar perfil de admins passa a ser por perfil `SuperAdmin`.
- O layout administrativo deve priorizar manutencao operacional: filtros legiveis, acoes agrupadas, tabelas com rolagem horizontal quando necessario e painel lateral apenas em telas largas.
- A landing pode ter botao `Entrar` para o app publico, mas nao deve divulgar o painel admin.
