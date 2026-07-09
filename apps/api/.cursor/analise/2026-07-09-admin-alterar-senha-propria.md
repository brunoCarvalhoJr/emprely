# Analise: troca de senha do admin logado

## Contexto

O reset da senha do usuario admin foi feito de forma operacional fora do painel. O painel `/admin` nao possui menu ou formulario para o proprio administrador redefinir a senha depois de logar.

## Problema

Sem uma troca de senha autenticada, qualquer senha temporaria precisa ser alterada via banco, script ou intervencao tecnica. Isso aumenta risco operacional e dificulta manutencao do acesso administrativo.

## Decisao

Criar fluxo autenticado para o admin logado alterar a propria senha:

- `POST /api/admin/auth/password`
- corpo com `senhaAtual`, `novaSenha` e `confirmarNovaSenha`
- exigir token admin valido
- validar senha atual antes de trocar
- validar politica minima da nova senha
- gravar hash com o mesmo `IPasswordHasher<AdminUsuario>`
- auditar a acao sem registrar senha em logs ou detalhes

## Fora de escopo

- Recuperacao publica de senha admin por email.
- Alteracao de senha de outro admin por SuperAdmin.
- Rotacao automatica de todos os admins.
