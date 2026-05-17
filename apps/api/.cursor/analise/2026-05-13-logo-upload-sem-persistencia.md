# Analise API - Upload de logo sem persistencia do perfil

## Contexto

O endpoint `POST /api/account/profile/logo` salva o arquivo e tambem atualiza `PerfilConta.LogoUrl`. Isso faz o cadastro receber a imagem antes da confirmacao do formulario no frontend.

## Fluxo afetado

- `AccountController.UploadLogoPerfil`.
- Contratos publicos em `Emprely.Contracts.Account`.
- Teste de integracao do upload de logo.

## Decisoes

- Manter validacao e otimizacao WebP no endpoint.
- Remover escrita em banco do endpoint de upload.
- Retornar um contrato especifico com `logoUrl`, dimensoes e tamanho original.
- Deixar a persistencia em `PUT /api/account/profile`.

## Duvidas

- Sem bloqueio. O storage local continua sendo suficiente para o MVP.

## Riscos

- Consumidores antigos que esperavam `PerfilContaResponse` no upload precisam usar `LogoPerfilUploadResponse`.
