# Spec: admin altera a propria senha

## Objetivo

Permitir que um administrador autenticado no `/admin` troque a propria senha sem intervencao manual no banco ou arquivo secreto.

## API

### Endpoint

`POST /api/admin/auth/password`

### Autenticacao

Obrigatorio token JWT administrativo valido.

### Request

```json
{
  "senhaAtual": "Senha atual",
  "novaSenha": "Nova senha",
  "confirmarNovaSenha": "Nova senha"
}
```

## Regras

- `senhaAtual`, `novaSenha` e `confirmarNovaSenha` sao obrigatorias.
- `novaSenha` deve ter pelo menos 8 caracteres.
- `novaSenha` e `confirmarNovaSenha` devem ser iguais.
- `senhaAtual` deve conferir com o hash atual do admin logado.
- Admin inexistente ou bloqueado nao pode alterar senha.
- A senha nunca deve ser registrada em auditoria, log, resposta ou documento.
- A acao deve registrar auditoria `AdminAlterarSenhaPropria` com alvo `AdminUsuario`.

## Respostas

- `204 No Content` quando a senha for alterada.
- `400 Bad Request` para campos invalidos ou senha atual incorreta.
- `401 Unauthorized` para sessao administrativa invalida.
- `403 Forbidden` para admin bloqueado.

## Testes obrigatorios

- Deve bloquear troca sem senha atual correta.
- Deve permitir troca com senha atual correta.
- Apos a troca, a senha antiga nao deve logar.
- A nova senha deve logar.
