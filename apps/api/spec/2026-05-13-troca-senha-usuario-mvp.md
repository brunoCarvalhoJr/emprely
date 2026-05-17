# Spec API - Troca senha usuario MVP

## Visao geral

Adicionar troca de senha do usuario atual.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| PUT | `/api/me/password` | Bearer | Troca a senha do usuario atual |

## Contratos

### Request

```json
{
  "senhaAtual": "Senha123",
  "novaSenha": "NovaSenha123",
  "confirmarNovaSenha": "NovaSenha123"
}
```

### Response

Sucesso: `204 No Content`.

## Regras de negocio

- Usuario troca apenas a propria senha.
- Confirmacao precisa bater com nova senha.
- Senha nova precisa respeitar politica Identity.

## Validacoes

- Senha atual obrigatoria.
- Nova senha obrigatoria e minimo 8 caracteres.
- Confirmacao obrigatoria.

## Dados e persistencia

- `UserManager.ChangePasswordAsync`.

## Erros esperados

- `401` sem token.
- `400` senha atual incorreta, senha fraca ou confirmacao divergente.

## Testes

- Integracao: senha incorreta falha, senha correta troca e login novo funciona.
