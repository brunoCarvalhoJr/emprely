# Analise: UI para troca de senha no painel admin

## Contexto

O painel `/admin` permite login administrativo, gestao de usuarios, planos, emails e administradores, mas nao possui uma area de seguranca para o admin logado trocar a propria senha.

## Problema

Depois de receber uma senha temporaria, o admin precisa de uma forma segura e simples de substituir a senha sem depender do desenvolvedor.

## Decisao

Adicionar uma area "Seguranca da conta" no cabecalho/conteudo do painel autenticado com:

- email e perfil do admin atual
- campos de senha atual, nova senha e confirmacao
- validacao local antes de enviar
- mensagem de sucesso e erro
- chamada ao endpoint autenticado `POST /api/admin/auth/password`

## Fora de escopo

- Recuperacao publica de senha admin.
- Convite de admin por email.
- Politica visual de forca de senha alem da regra minima atual.
