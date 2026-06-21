# Spec - Administracao de usuarios, planos e emails

## Visao geral

Esta feature cria um painel administrativo separado para o Emprely, dentro do mesmo projeto do webapp, permitindo administrar usuarios, contas, planos, dias gratis, acesso e comunicacao com usuarios durante o beta.

O painel deve ter login administrativo proprio, separado do login do cliente. Administradores nao devem usar o `X-Emprely-Admin-Key` como experiencia principal do MVP. A autenticacao administrativa deve usar uma base separada dos usuarios comuns, com perfis `Super Admin` e `Suporte`.

O objetivo e reduzir operacoes manuais no banco, apoiar suporte, permitir ativacao manual do Plano Fundador, controlar acesso de contas e usuarios, enviar emails personalizados e manter auditoria completa das acoes administrativas.

Decisoes consolidadas:

- Painel admin no mesmo projeto do webapp, mas separado da area do cliente.
- Login administrativo separado.
- Admins em tabela separada dos usuarios comuns.
- Perfis do painel: `Super Admin` e `Suporte`.
- Dono principal definido por variavel de ambiente com email `Bruno.jr.ti@hotmail.com`.
- Apenas o dono principal pode administrar outros admins.
- Planos no MVP administrativo: `Trial` e `Fundador`.
- Dias gratis sao beneficio separado do trial, com data inicial e data final proprias.
- Conta com trial expirado e dias gratis ativos continua aparecendo como `TrialAtivo`.
- Billing, pagamento, assinatura e cobranca ficam fora desta spec.

## Escopo

Inclui:

- Tela de login administrativo separada.
- Sessao administrativa separada da sessao do cliente.
- Perfis administrativos `Super Admin` e `Suporte`.
- Cadastro e manutencao de administradores em tabela separada.
- Definicao de dono principal por variavel de ambiente.
- Lista paginada de usuarios e contas.
- Filtros completos desde o inicio.
- Metricas resumidas no topo.
- Painel lateral de detalhe do usuario/conta.
- Criacao manual de usuario.
- Criacao de conta com usuario owner obrigatorio.
- Criacao de usuario sem conta.
- Escolha, ao criar usuario, entre:
  - usuario ja confirmado pelo admin;
  - usuario com link para definir senha e confirmar acesso.
- Alteracao de plano para `Trial` ou `Fundador`.
- Ativacao manual de Plano Fundador.
- Cadastro de dias gratis com data inicial e data final proprias.
- Acoes em massa para envio de emails e dias gratis.
- Revisao final obrigatoria antes de qualquer acao em massa.
- Suspensao e reativacao de conta.
- Bloqueio e desbloqueio de usuario.
- Encerramento de sessao ativa de usuario bloqueado assim que possivel, sem solucao cara de performance no MVP.
- Envio de email personalizado via SES.
- Editor HTML de email com assunto, conteudo, preview e anexos simples.
- Opcao de envio de email automatico ao suspender conta, com possibilidade de nao enviar.
- Historico detalhado de emails.
- Auditoria completa de todas as acoes administrativas.
- Registro de IP e user-agent na auditoria.
- Exportacao CSV simples com dados completos para admin autenticado.

Fora do escopo:

- Billing, pagamentos, checkout, assinatura recorrente, invoices e webhooks.
- Multiplicidade de planos alem de `Trial` e `Fundador`.
- Trocar usuario de conta.
- Edicao de dados basicos do usuario pelo admin no MVP.
- Acoes em massa para bloqueio, desbloqueio, suspensao ou alteracao de plano.
- Campanhas de marketing ou newsletter.
- Automacao avancada de marketing.
- Editor visual completo de templates.
- Login social, MFA ou magic link administrativo.
- App administrativo separado.
- Exclusao fisica de usuario ou conta.
- Fluxo LGPD de exclusao/anonimizacao definitiva.

## Fluxo ponta a ponta

### 1. Login administrativo

#### Frontend

1. Admin acessa a rota administrativa separada.
2. Webapp mostra tela de login administrativa, visualmente separada da area do cliente.
3. Admin informa email e senha administrativa.
4. Webapp envia credenciais para a API administrativa.
5. Webapp recebe sessao/token administrativo com perfil e permissoes.
6. Webapp redireciona para o painel de usuarios.

#### Backend

1. API valida credenciais contra a tabela de administradores.
2. API verifica se o admin esta ativo.
3. API identifica perfil `Super Admin` ou `Suporte`.
4. API verifica se o email do admin corresponde ao owner configurado por env quando a acao exigir dono principal.
5. API emite token/sessao administrativa separada da sessao de usuario comum.
6. API registra evento de login administrativo na auditoria.

#### Integracoes

1. A autenticacao administrativa usa banco do Emprely, mas tabela separada dos usuarios comuns.
2. A variavel de ambiente do owner principal define o email com privilegio maximo.
3. Logs/auditoria registram IP e user-agent.

### 2. Listagem e filtro de usuarios

#### Frontend

1. Admin abre a tela principal.
2. Webapp exibe metricas resumidas no topo:
   - total de usuarios;
   - trials ativos;
   - contas Fundador;
   - contas suspensas;
   - usuarios bloqueados;
   - usuarios sem conta.
3. Webapp exibe tabela/lista paginada de usuarios.
4. Admin usa filtros completos, incluindo:
   - nome;
   - email;
   - telefone;
   - conta;
   - plano;
   - status comercial;
   - status da conta;
   - email confirmado;
   - usuario bloqueado;
   - usuario sem conta;
   - trial ativo;
   - trial expirado;
   - dias gratis ativo;
   - data de criacao;
   - ultimo email enviado;
   - perfil/papel na conta, quando houver.
5. Admin seleciona um usuario.
6. Webapp abre painel lateral com detalhes.

#### Backend

1. API valida sessao administrativa.
2. API aplica permissoes do perfil.
3. API consulta usuarios comuns, contas, membros, plano, status e resumo de emails.
4. API retorna resultado paginado e totalizadores.
5. API nao registra auditoria para simples consulta, salvo se for necessario por politica futura.

#### Integracoes

1. Consulta usa Identity/usuarios comuns.
2. Consulta usa tabelas de contas, membros, emails transacionais e beneficios de dias gratis.
3. Exportacao CSV usa o mesmo conjunto de filtros.

### 3. Detalhe do usuario

#### Frontend

1. Admin seleciona um usuario na lista.
2. Painel lateral exibe:
   - dados basicos do usuario;
   - email confirmado ou pendente;
   - status bloqueado/desbloqueado;
   - contas vinculadas;
   - papel na conta;
   - plano da conta;
   - status comercial;
   - trial e dias gratis;
   - historico de emails;
   - historico administrativo.
3. Painel mostra acoes permitidas conforme perfil do admin.

#### Backend

1. API busca usuario, membro, conta, plano, beneficios e historico.
2. API calcula status comercial considerando trial, Plano Fundador e dias gratis.
3. API retorna permissoes de acao para o perfil administrativo atual.

#### Integracoes

1. Historico de emails vem do registro transacional atual e novos emails administrativos.
2. Historico administrativo vem da nova auditoria.

### 4. Criacao manual de usuario

#### Frontend

1. Admin clica em criar usuario.
2. Webapp mostra formulario com:
   - nome;
   - email;
   - telefone opcional;
   - criar com conta ou sem conta;
   - se criar com conta: nome da conta e plano inicial;
   - politica de acesso: confirmado pelo admin ou link de definicao de senha/confirmacao.
3. Admin revisa os dados.
4. Webapp envia solicitacao para API.
5. Webapp mostra resultado e abre o detalhe do usuario criado.

#### Backend

1. API valida permissao administrativa.
2. API valida duplicidade de email.
3. API cria usuario comum.
4. Se houver conta, API cria conta e membro owner obrigatorio.
5. Se nao houver conta, API cria usuario sem vinculo de conta.
6. Se admin escolher usuario confirmado, API marca confirmacao conforme regra administrativa.
7. Se admin escolher link, API gera token/link para definicao de senha e confirmacao de acesso.
8. API registra auditoria.
9. API registra email se houver envio.

#### Integracoes

1. Criacao de usuario usa Identity.
2. Criacao de conta usa dominio de contas e membros.
3. Link e email usam servico transacional SES.

### 5. Criacao de conta

#### Frontend

1. Admin inicia criacao de conta.
2. Webapp exige ao menos um usuario owner.
3. Admin pode escolher usuario existente ou criar novo usuario junto.
4. Admin define plano inicial `Trial` ou `Fundador`.
5. Admin confirma a criacao.

#### Backend

1. API valida que toda nova conta tem usuario owner.
2. API cria conta, membro owner e perfil inicial quando necessario.
3. API aplica plano inicial.
4. API registra auditoria.

#### Integracoes

1. Conta e usuario continuam entidades separadas.
2. Usuario pode existir sem conta.
3. Conta nao pode existir sem ao menos um usuario owner.

### 6. Alteracao de plano

#### Frontend

1. Admin seleciona uma conta.
2. Webapp exibe plano atual e status comercial.
3. Admin escolhe `Trial` ou `Fundador`.
4. Webapp exige motivo obrigatorio.
5. Webapp mostra confirmacao com impacto.
6. Admin confirma.

#### Backend

1. API valida perfil.
2. Apenas `Super Admin` pode alterar plano.
3. `Suporte` nao pode alterar plano.
4. API aplica plano.
5. API recalcula status comercial.
6. API registra auditoria.
7. Se houver email de aviso e ele falhar, a alteracao permanece e a falha e registrada.

#### Integracoes

1. Plano usa dominio de contas.
2. Auditoria registra antes/depois.
3. Email opcional usa SES.

### 7. Dias gratis

#### Frontend

1. Admin seleciona uma conta ou usuarios por acao em massa.
2. Webapp permite cadastrar periodo de dias gratis com data inicial e final.
3. Webapp exige motivo.
4. Para acao em massa, webapp mostra tela de revisao final com todos os alvos.
5. Admin confirma.

#### Backend

1. API valida perfil.
2. `Super Admin` pode criar/alterar dias gratis.
3. `Suporte` pode criar/alterar dias gratis.
4. API valida datas.
5. API grava beneficio separado do trial.
6. API registra auditoria para cada alvo.
7. API recalcula status comercial.

#### Integracoes

1. Status comercial deve considerar dias gratis ativos.
2. Se trial expirou mas dias gratis estao ativos, o status exibido deve continuar como `TrialAtivo`.
3. Regras de uso que hoje dependem de trial ativo devem respeitar dias gratis ativos.

### 8. Suspensao e reativacao de conta

#### Frontend

1. Admin seleciona uma conta.
2. Webapp mostra acao de suspender ou reativar.
3. Webapp exige motivo obrigatorio.
4. Ao suspender, webapp oferece opcao de enviar ou nao email automatico.
5. Webapp mostra impacto: usuarios da conta perdem acesso ao produto.
6. Admin confirma.

#### Backend

1. API valida perfil.
2. Apenas `Super Admin` pode suspender ou reativar conta.
3. `Suporte` nao pode suspender conta.
4. Suspensao marca a conta como suspensa, sem apagar dados.
5. Reativacao restaura acesso conforme plano/dias/trial.
6. API registra auditoria.
7. Se email automatico for solicitado e falhar, suspensao permanece e falha e registrada.

#### Integracoes

1. Login/uso do produto deve verificar status da conta.
2. Emails usam SES.
3. Auditoria registra IP, user-agent, motivo e resultado.

### 9. Bloqueio e desbloqueio de usuario

#### Frontend

1. Admin seleciona usuario.
2. Webapp mostra acao de bloquear ou desbloquear.
3. Webapp exige motivo obrigatorio.
4. Webapp mostra impacto.
5. Admin confirma.

#### Backend

1. API valida perfil.
2. `Super Admin` pode bloquear/desbloquear usuario.
3. `Suporte` pode bloquear/desbloquear usuario, mas nao suspender conta.
4. API bloqueia ou desbloqueia usuario.
5. API tenta encerrar sessao ativa assim que possivel, sem solucao de alto custo de performance no MVP.
6. API registra auditoria.

#### Integracoes

1. Bloqueio deve impedir novo login.
2. Tokens/sessoes ativas devem ser invalidados ou deixados de funcionar no primeiro ponto razoavel de validacao.
3. Melhorias de invalidacao em tempo real podem ser evoluidas depois.

### 10. Email personalizado

#### Frontend

1. Admin seleciona usuario ou grupo de usuarios.
2. Webapp abre editor de email.
3. Admin informa assunto.
4. Admin escreve conteudo HTML.
5. Webapp mostra preview.
6. Admin pode adicionar anexos simples.
7. Para acao em massa, webapp mostra revisao final com destinatarios.
8. Admin confirma envio.

#### Backend

1. API valida perfil.
2. `Super Admin` e `Suporte` podem enviar email personalizado.
3. API valida assunto, HTML, destinatario e anexos.
4. API envia via SES.
5. API registra email no historico transacional.
6. API registra auditoria.
7. Falhas de envio ficam registradas por destinatario.

#### Integracoes

1. SES e o canal oficial.
2. Historico de emails deve mostrar status, destinatario, tipo, erro e data.
3. Esta funcionalidade nao deve ser tratada como newsletter ou campanha de marketing no MVP.

### 11. Exportacao CSV

#### Frontend

1. Admin aplica filtros.
2. Admin clica em exportar CSV.
3. Webapp solicita exportacao simples com dados completos.
4. Webapp baixa arquivo.

#### Backend

1. API valida sessao administrativa.
2. API aplica filtros atuais.
3. API gera CSV com dados completos para admin autenticado.
4. API registra auditoria da exportacao.

#### Integracoes

1. CSV usa os mesmos criterios de filtro da listagem.
2. Exportacao deve ser registrada por conter dados sensiveis.

### 12. Administracao de admins

#### Frontend

1. Dono principal acessa area de administradores.
2. Dono principal cria, bloqueia ou altera perfil de outros admins.
3. Admins que nao sao dono principal nao veem ou nao conseguem executar essas acoes.

#### Backend

1. API identifica owner pelo email configurado em variavel de ambiente.
2. API permite administracao de admins apenas ao owner.
3. API registra auditoria de todas as acoes.

#### Integracoes

1. Admins ficam em tabela separada.
2. A env do owner deve existir nos ambientes de deploy.

## Requisitos

- O painel admin deve ficar no mesmo projeto do webapp, mas com login, rotas e estado de sessao separados.
- A area administrativa nao deve aparecer para usuarios comuns.
- A autenticacao administrativa deve usar tabela separada dos usuarios comuns.
- Devem existir perfis `Super Admin` e `Suporte`.
- Deve existir owner principal por variavel de ambiente com email `Bruno.jr.ti@hotmail.com`.
- Apenas o owner principal pode administrar outros admins.
- A lista deve ser paginada.
- A lista deve ter filtros completos desde o inicio.
- A tela deve exibir metricas resumidas no topo.
- O detalhe deve aparecer em painel lateral.
- O sistema deve permitir usuario sem conta.
- O sistema deve impedir conta sem usuario owner.
- Criacao de usuario deve permitir escolher confirmacao pelo admin ou link de definicao de senha/confirmacao.
- Criacao de usuario sem conta nao envia email automaticamente.
- O MVP nao permite editar dados basicos do usuario pelo admin.
- O MVP nao permite trocar usuario de conta.
- `Super Admin` pode alterar plano.
- `Suporte` nao pode alterar plano.
- `Super Admin` e `Suporte` podem alterar dias gratis.
- `Super Admin` e `Suporte` podem bloquear/desbloquear usuario.
- Apenas `Super Admin` pode suspender/reativar conta.
- `Super Admin` e `Suporte` podem enviar email personalizado.
- Toda acao administrativa deve ser auditada.
- Auditoria deve guardar IP e user-agent.
- Acoes criticas devem exigir motivo.
- Acoes em massa devem ter revisao final obrigatoria.
- Exportacao CSV deve conter dados completos para admin autenticado.
- Exportacao CSV deve ser auditada.
- Email personalizado deve usar SES.
- Email personalizado deve ter assunto, HTML, preview e anexos simples.
- Falha de email nao deve desfazer alteracao de plano/acesso ja aplicada.

## Regras de negocio

- Usuario comum e admin sao entidades separadas.
- Admin nao deve acessar painel do cliente como admin automaticamente.
- Usuario comum sem conta nao pode acessar painel normal do cliente; deve receber bloqueio claro de usuario sem conta.
- Conta pode ter mais de um usuario.
- Conta criada pelo admin precisa obrigatoriamente ter um usuario owner.
- Usuario pode existir sem conta.
- Remover acesso, como comportamento padrao, significa suspender a conta.
- Suspender conta nao apaga dados.
- Cancelar/excluir definitivamente conta ou usuario fica fora do MVP.
- Bloquear usuario impede novo login.
- Bloqueio deve encerrar sessao ativa assim que possivel, desde que nao gere custo alto de performance.
- Dias gratis sao beneficio separado do trial.
- Dias gratis possuem data inicial e data final.
- Trial expirado com dias gratis ativos deve aparecer como `TrialAtivo`.
- Planos disponiveis no MVP administrativo sao apenas `Trial` e `Fundador`.
- Billing e pagamento nao devem ser implementados nesta feature.
- `Suporte` pode alterar dias gratis, mas nao plano.
- `Suporte` pode bloquear/desbloquear usuario, mas nao suspender conta.
- `Suporte` pode enviar email personalizado.
- Suspensao de conta deve enviar email automatico por padrao, com opcao de nao enviar.
- Email personalizado e operacional deve usar SES.
- Email personalizado pode conter HTML e anexos simples.
- Email personalizado nao deve ser usado como campanha de marketing nesta fase.
- Se alteracao administrativa for aplicada e email falhar, a alteracao permanece e a falha fica registrada.
- Todas as acoes administrativas devem ser registradas em auditoria.
- Auditoria deve incluir admin, perfil, acao, alvo, motivo quando aplicavel, data/hora, IP, user-agent e resultado.

## Impactos por projeto

### API

- Criar autenticacao administrativa separada da autenticacao do cliente.
- Criar tabela/modelo de admins.
- Criar configuracao de owner principal por variavel de ambiente.
- Criar autorizacao por perfil `Super Admin` e `Suporte`.
- Expandir endpoints administrativos para usuarios, contas, planos, dias gratis, bloqueio, suspensao, emails, CSV e auditoria.
- Criar contratos administrativos para listagem, detalhe, criacao, acoes e exportacao.
- Criar auditoria administrativa completa.
- Criar suporte a dias gratis como beneficio separado do trial.
- Ajustar calculo de status comercial para considerar dias gratis ativos.
- Ajustar verificacoes de acesso para conta suspensa e usuario bloqueado.
- Integrar email personalizado e anexos simples ao servico transacional.
- Registrar falhas de email sem desfazer operacoes ja aplicadas.
- Criar testes de permissao, auditoria, filtros, plano, dias gratis, bloqueio, suspensao e emails.

### Web

- Criar area administrativa separada no mesmo projeto.
- Criar tela de login admin separada.
- Criar gerenciamento de sessao administrativa.
- Criar layout administrativo sem expor para usuarios comuns.
- Criar dashboard/listagem com metricas e filtros completos.
- Criar tabela paginada de usuarios/contas.
- Criar painel lateral de detalhe.
- Criar formularios para:
  - criar usuario;
  - criar conta;
  - alterar plano;
  - cadastrar dias gratis;
  - suspender/reativar conta;
  - bloquear/desbloquear usuario;
  - enviar email personalizado;
  - exportar CSV;
  - executar acoes em massa de email e dias gratis.
- Criar revisao final para acoes em massa.
- Criar historico de emails e auditoria no detalhe.
- Criar controle visual por perfil administrativo.
- Criar validacoes de formulario e mensagens de erro.

### Mobile

- Sem impacto funcional no MVP.
- Mobile futuro deve respeitar bloqueio de usuario, suspensao de conta e dias gratis quando consumir a mesma API.

### Landing

- Sem mudanca obrigatoria.
- Pode futuramente apontar para fluxo de login/cadastro normal, nao para painel admin.
- Painel admin nao deve ser divulgado na landing.

### Packages

- Pode haver necessidade futura de tipos compartilhados para contratos administrativos.
- No MVP, usar padrao atual do monorepo e evitar acoplamento prematuro se o web continuar usando tipos locais.

### Infra

- Adicionar variavel de ambiente do owner principal do painel admin.
- Garantir que secrets administrativos nao sejam versionados.
- Garantir que SES esteja configurado para envio de emails personalizados.
- Avaliar limite/tamanho de anexos simples no provedor.
- Garantir logs suficientes para auditoria e diagnostico.
- Atualizar runbook de deploy/manutencao quando a feature for implementada.

## Criterios de aceitacao

- Existe login administrativo separado do login do cliente.
- Admin comum e usuario comum usam bases/tabelas separadas.
- Owner principal e reconhecido pela variavel de ambiente com email definido.
- Apenas owner principal consegue administrar outros admins.
- Perfis `Super Admin` e `Suporte` funcionam com permissoes diferentes.
- Usuario comum nao consegue acessar area administrativa.
- Admin autenticado consegue listar usuarios/contas com paginacao.
- Filtros completos funcionam.
- Metricas resumidas aparecem no topo.
- Painel lateral mostra detalhe de usuario, conta, plano, acesso, emails e auditoria.
- Admin consegue criar usuario sem conta.
- Admin consegue criar conta com usuario owner obrigatorio.
- Admin consegue escolher entre usuario confirmado pelo admin ou link de definicao de senha/confirmacao.
- Usuario sem conta nao acessa painel normal do cliente.
- `Super Admin` consegue alterar plano entre `Trial` e `Fundador`.
- `Suporte` nao consegue alterar plano.
- `Super Admin` e `Suporte` conseguem criar/alterar dias gratis.
- Dias gratis ativos permitem uso mesmo com trial expirado.
- Trial expirado com dias gratis ativos aparece como `TrialAtivo`.
- `Super Admin` consegue suspender e reativar conta.
- `Suporte` nao consegue suspender conta.
- Suspensao de conta bloqueia uso do produto.
- Suspensao de conta oferece envio de email automatico com opcao de nao enviar.
- `Super Admin` e `Suporte` conseguem bloquear/desbloquear usuario.
- Bloqueio impede novo login e tenta encerrar sessao ativa assim que possivel.
- `Super Admin` e `Suporte` conseguem enviar email personalizado via SES.
- Editor de email permite assunto, HTML, preview e anexos simples.
- Acoes em massa de email e dias gratis funcionam com revisao final.
- Exportacao CSV simples gera dados completos para admin autenticado.
- Todas as acoes administrativas ficam auditadas.
- Auditoria registra IP e user-agent.
- Falha de email fica registrada e nao desfaz alteracao administrativa ja aplicada.
- Billing/pagamento nao aparece como funcionalidade ativa desta feature.

## Estrategia de implementacao

1. Consolidar contratos e modelo administrativo.
   - Definir entidades/tabelas para admin, auditoria e dias gratis.
   - Definir permissoes de `Super Admin`, `Suporte` e owner principal.
   - Definir contratos de listagem, detalhe, criacao e acoes.

2. Implementar base de autenticacao administrativa.
   - Criar login admin separado.
   - Criar validacao de perfil e owner principal.
   - Separar sessao/token admin da sessao do cliente.

3. Implementar auditoria administrativa.
   - Registrar todas as acoes.
   - Incluir IP, user-agent, admin, perfil, alvo, motivo e resultado.
   - Auditar tambem exportacao CSV e envio de email.

4. Implementar consultas administrativas.
   - Listagem paginada.
   - Filtros completos.
   - Metricas resumidas.
   - Detalhe com emails e auditoria.

5. Implementar acoes de usuario e conta.
   - Criacao manual de usuario.
   - Criacao de conta com owner.
   - Bloqueio/desbloqueio.
   - Suspensao/reativacao.
   - Alteracao de plano.
   - Dias gratis.

6. Implementar email personalizado.
   - Envio via SES.
   - HTML, preview e anexos simples.
   - Historico de envio.
   - Tratamento de falha por destinatario.

7. Implementar frontend administrativo.
   - Login admin.
   - Layout do painel.
   - Lista, filtros, metricas e painel lateral.
   - Formularios de acoes.
   - Revisao final para acoes em massa.
   - Historicos e auditoria.

8. Implementar exportacao CSV.
   - Usar filtros atuais.
   - Gerar CSV simples com dados completos.
   - Auditar exportacao.

9. Validar permissoes e regressao.
   - Testar matriz `Super Admin` x `Suporte`.
   - Testar usuario comum sem acesso admin.
   - Testar que plano, trial, dias gratis e bloqueio afetam o uso real.
   - Testar falhas de email e auditoria.

10. Atualizar documentacao operacional.
   - Atualizar runbooks de manutencao quando a feature for implementada.
   - Registrar variaveis de ambiente sem expor secrets.
   - Sincronizar Notion/Obsidian se houver mudanca de decisao operacional.

## Testes

- Testes de API para login administrativo.
- Testes de API para perfis `Super Admin` e `Suporte`.
- Testes de API para owner principal.
- Testes de API para listagem, filtros e detalhe.
- Testes de API para criacao de usuario com e sem conta.
- Testes de API para criacao de conta com owner obrigatorio.
- Testes de API para alteracao de plano.
- Testes de API para dias gratis.
- Testes de API para suspensao/reativacao de conta.
- Testes de API para bloqueio/desbloqueio de usuario.
- Testes de API para email personalizado com sucesso e falha.
- Testes de API para auditoria em todas as acoes.
- Testes de API para exportacao CSV.
- Testes de frontend para login admin.
- Testes de frontend para filtros, painel lateral e formularios.
- Testes de frontend para revisao final de acoes em massa.
- Testes E2E cobrindo fluxo principal do painel admin.
- Teste de regressao garantindo que usuario comum nao acessa admin.
- Teste de regressao garantindo que usuario sem conta nao acessa painel normal.

## Revisao 2026-06-17 - ajustes de administradores e layout

- O login administrativo deve exibir apenas o formulario de entrada.
- O fluxo `Criar owner`/`bootstrap-owner` nao faz parte da UI nem da API publica.
- A criacao do primeiro admin deve ser tratada por processo operacional seguro fora da tela publica.
- A administracao de admins deve ser permitida apenas para administradores com perfil `SuperAdmin`.
- Admin com perfil `Suporte` nao deve listar, criar, bloquear/desbloquear ou alterar perfil de outros admins.
- A tela `/admin` deve usar layout responsivo de manutencao: filtros compactos e legiveis, filtros avancados recolhiveis, tabelas com rolagem horizontal e painel lateral sem esmagar a area principal.
- A landing `emprely.com.br` deve expor o botao `Entrar` para `https://app.emprely.com.br`, sem divulgar o painel administrativo.
