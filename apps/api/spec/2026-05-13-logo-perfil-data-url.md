# Spec API - Logo do perfil via upload WebP

## Visao geral

Permitir que a conta anexe sua logomarca sem gravar base64 no banco. A API recebe o arquivo, valida, converte para WebP otimizado, salva em `wwwroot/uploads/account-logos/<contaId>/` e atualiza `PerfilConta.LogoUrl` com a referencia publica.

## Endpoints

- `GET /api/account/profile`
- `PUT /api/account/profile`
- `POST /api/account/profile/logo`

## Requests/Responses

- `POST /api/account/profile/logo`
  - `multipart/form-data`
  - campo `file`: imagem da logo.
  - resposta: `PerfilContaResponse`.
- `LogoUrl` permanece `string?`, mas deve ser uma URL HTTP(S) ou caminho relativo publico.

## Validacoes

- Rejeitar arquivo vazio.
- Rejeitar arquivo acima de 2 MB.
- Rejeitar content types que nao sejam `image/png`, `image/jpeg`, `image/jpg` ou `image/webp`.
- Rejeitar imagem invalida ou impossivel de decodificar.
- Redimensionar para maximo de 512px no maior lado.
- Salvar em WebP com qualidade equilibrada.

## Persistencia

- Banco salva apenas `/uploads/account-logos/<contaId>/<nome>.webp`.
- `perfis_conta.logo_url` deve ter tamanho limitado, nao `text`.
- Se o perfil ainda nao existir, o upload cria o perfil com dados padrao da conta e email do usuario.

## Seguranca

- Endpoint exige usuario autenticado.
- Conta vem de `ICurrentContaContext`.
- Nome fisico do arquivo deve ser gerado pela API.
- A API nao deve confiar em extensao enviada pelo usuario.

## Criterios de aceite

- Upload de PNG/JPG/WebP ate 2 MB salva arquivo `.webp` em `wwwroot`.
- `GET /api/account/profile` retorna a referencia salva.
- `PUT /api/account/profile` nao aceita `data:image/...` como `LogoUrl`.
- API compila e testes passam.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
