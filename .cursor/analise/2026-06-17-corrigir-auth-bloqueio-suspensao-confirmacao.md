# Correcao do fluxo de bloqueio, suspensao e confirmacao de email

## Contexto

O fluxo atual de login pode exibir a etapa de confirmacao de email para usuarios cuja conta foi suspensa, porque a validacao de email nao confirmado acontece antes da validacao da conta. Tambem existe risco de uma sessao encerrada permanecer visualmente em telas auxiliares de autenticacao, como confirmacao de email.

Na tela de confirmacao de email, os botoes primarios devem seguir o padrao visual das demais telas de autenticacao, com texto branco sobre fundo azul.

## Objetivo

Garantir que usuarios bloqueados ou contas suspensas sejam tratados como sem acesso antes de qualquer fluxo de confirmacao de email, desde que a senha informada esteja correta. Ao encerrar sessao por invalidacao, o usuario deve voltar para login.

## Fluxo

1. Usuario informa email e senha.
2. API valida se o email existe.
3. API valida a senha.
4. Com senha correta, API verifica bloqueio administrativo do usuario.
5. Com usuario nao bloqueado, API verifica a conta vinculada e seu status.
6. Se bloqueado, retorna 403 com "Conta Bloqueada".
7. Se suspensa, retorna 403 com "Conta Suspensa".
8. Somente depois disso a API verifica email nao confirmado.
9. Frontend exibe a mensagem retornada pela API.
10. Em invalidacao de sessao autenticada por 401 ou 403 de acesso, frontend limpa a sessao e volta para login.

## Regras

- Senha incorreta continua retornando erro generico de credenciais.
- Usuario bloqueado nao pode confirmar email por link.
- Usuario com conta suspensa nao pode confirmar email por link.
- Sessao encerrada nao deve cair automaticamente na tela de confirmacao de email.
- Botoes azuis da tela de confirmacao devem ter fonte branca.

## Impactos

- API de autenticacao: ordem das validacoes de login e validacao extra na confirmacao de email.
- API `/api/me`: passa a negar acesso quando usuario estiver bloqueado ou conta estiver suspensa.
- Cliente web: tratamento de 403 autenticado para encerrar sessao quando o backend indicar bloqueio ou suspensao.
- Tela de autenticacao: mensagem de erro do login passa a usar diretamente a mensagem da API.

## Dependencias

- `UsuarioAplicacao.BloqueadoAdministrativamenteAt`
- `UsuarioAplicacao.LockoutEnd`
- `MembroConta`
- `Conta.Status`
- `StatusConta.Suspensa`
- Eventos de sessao invalida no cliente web.

## Riscos

- Mudanca na ordem de validacao pode alterar mensagens esperadas por testes existentes.
- Tokens JWT ja emitidos continuam existindo, entao a derrubada depende de chamadas autenticadas que consultem o backend.
- Usuarios sem conta devem continuar recebendo resposta de conta inativa/sem acesso, sem quebrar criacao administrativa de usuarios.

## Duvidas

- Nenhuma duvida bloqueante para esta correcao. A regra de produto foi definida: bloqueio/suspensao tem prioridade sobre confirmacao de email quando a senha estiver correta.
