# Spec API - Upload de logo sem persistencia do perfil

## Visao geral

Alterar o endpoint de upload de logomarca para nao atribuir a logo ao perfil. O endpoint apenas processa e salva o arquivo, retornando a referencia para ser usada no `PUT /api/account/profile`.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| POST | `/api/account/profile/logo` | Bearer JWT | Recebe imagem, converte para WebP e retorna URL sem gravar perfil |
| PUT | `/api/account/profile` | Bearer JWT | Grava dados do perfil, incluindo `logoUrl` enviada |

## Contratos

### Response upload

```json
{
  "logoUrl": "/uploads/account-logos/{contaId}/{arquivo}.webp",
  "tamanhoOriginalBytes": 120000,
  "largura": 512,
  "altura": 256
}
```

## Regras de negocio

- Upload nao cria `PerfilConta`.
- Upload nao altera `PerfilConta.LogoUrl`.
- `LogoUrl` so muda no `PUT /api/account/profile`.

## Validacoes

- Arquivo obrigatorio.
- PNG, JPG/JPEG ou WebP.
- Maximo de 2 MB.
- Conteudo deve ser imagem processavel.

## Dados e persistencia

- Persistir apenas o arquivo otimizado em `wwwroot/uploads/account-logos`.
- Nao chamar `SaveChangesAsync` no upload.

## Erros esperados

- `400` para arquivo ausente, tipo invalido, tamanho excedido ou imagem ilegivel.
- `404` para conta inexistente no contexto autenticado.

## Testes

- Integracao: upload retorna URL WebP, arquivo fica acessivel e perfil permanece sem `LogoUrl` ate o `PUT`.
