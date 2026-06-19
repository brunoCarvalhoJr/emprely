# Correcao de autenticacao para usuarios bloqueados, contas suspensas e confirmacao de email

## Visao geral

A feature corrige o comportamento de autenticacao quando um usuario e bloqueado administrativamente ou quando sua conta e suspensa. Nesses casos, o sistema deve direcionar o usuario para login e exibir a mensagem correta, sem permitir que o fluxo de confirmacao de email continue liberando acesso.

## Escopo

- Ajustar login do app web para exibir "Conta Bloqueada" ou "Conta Suspensa" quando aplicavel.
- Impedir confirmacao de email de usuarios bloqueados ou vinculados a conta suspensa.
- Encerrar sessao autenticada no frontend em respostas 401 ou em respostas 403 especificas de bloqueio/suspensao.
- Garantir que a invalidacao de sessao volte para modo login.
- Corrigir cor do texto dos botoes azuis da tela de confirmacao de email.

Fora do escopo:

- Criar novo mecanismo realtime para derrubar sessoes instantaneamente.
- Alterar regras de planos, trials, admins ou pagamentos.
- Alterar conteudo dos emails transacionais.

## Fluxo ponta a ponta

1. Frontend envia login para `POST /api/auth/login`.
2. Backend localiza usuario e valida senha.
3. Backend verifica se o usuario esta bloqueado.
4. Backend carrega membro e conta principal do usuario.
5. Backend verifica se a conta esta ativa.
6. Backend verifica confirmacao de email apenas se o acesso administrativo/comercial estiver liberado.
7. Backend retorna token em caso de sucesso ou 403 com mensagem de negocio em caso de bloqueio/suspensao.
8. Frontend exibe a mensagem retornada no formulario de login.
9. Em chamadas autenticadas, se a API retornar 401 ou 403 com bloqueio/suspensao, o frontend limpa a sessao e mostra login.
10. Links de confirmacao de email chamam `POST /api/auth/confirm-email`; backend rejeita bloqueados/suspensos.

## Requisitos

- Login com senha errada deve continuar generico.
- Login com senha correta e usuario bloqueado deve retornar 403 com `code = UsuarioBloqueado` e `message = Conta Bloqueada`.
- Login com senha correta e conta suspensa deve retornar 403 com `code = ContaSuspensa` e `message = Conta Suspensa`.
- Email nao confirmado so deve ser comunicado quando usuario e conta estiverem aptos ao acesso.
- Confirmacao de email deve retornar 403 para usuario bloqueado ou conta suspensa.
- Frontend deve usar a mensagem real da API no login.
- Frontend deve trocar para `authMode = login` ao encerrar sessao.
- Botao azul de confirmacao de email deve manter texto branco.

## Regras de negocio

- Bloqueio de usuario tem prioridade sobre suspensao de conta.
- Suspensao de conta tem prioridade sobre confirmacao de email.
- Confirmacao de email nao reativa ou desbloqueia acesso.
- Conta suspensa e usuario bloqueado nao devem poder usar link de confirmacao como caminho alternativo.

## Impactos por projeto

- `apps/api`: altera `AuthController` e `MeController`.
- `apps/web`: altera `App.tsx` e `lib/api.ts`.
- `spec` e `.cursor/analise`: registra a decisao SDD.

## Criterios de aceitacao

- Usuario bloqueado que informa email e senha corretos ve "Conta Bloqueada".
- Usuario de conta suspensa que informa email e senha corretos ve "Conta Suspensa".
- Usuario suspenso/bloqueado nao consegue confirmar email por link.
- Sessao encerrada por bloqueio/suspensao volta para tela de login.
- Tela de confirmar email exibe botoes azuis com texto branco.
- Testes de integracao cobrem mensagens de bloqueio/suspensao no login.

## Estrategia de implementacao

- Centralizar verificacoes de acesso no backend do auth para evitar divergencia entre login e confirmacao de email.
- Manter mensagens explicitas apenas depois da validacao de senha no login.
- Reaproveitar o evento de sessao invalida do frontend, expandindo o disparo para 403 de bloqueio/suspensao.
- Fazer ajuste visual minimo no botao de confirmacao para preservar o tema atual.
