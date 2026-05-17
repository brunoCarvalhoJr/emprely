# Analise API - Logo do perfil via upload WebP

## Contexto

A abordagem de salvar a logomarca como `data:image/...` no campo `LogoUrl` foi descartada. Para uma logo de marca, a melhor abordagem no MVP e receber o arquivo na API, validar o tamanho, converter para WebP otimizado no servidor e salvar no banco apenas a referencia publica da imagem.

## Camadas impactadas

- API: novo endpoint autenticado para upload da logo do perfil.
- Contracts: `LogoUrl` volta a representar uma URL/referencia curta.
- Infrastructure: `LogoUrl` deve permanecer com tamanho limitado, nao `text`.
- Static files: API precisa expor a pasta de uploads salvos localmente.

## Endpoints impactados

- `POST /api/account/profile/logo`
- `PUT /api/account/profile`
- `GET /api/account/profile`

## Contratos

- `LogoUrl` continua opcional, mas deve receber URL ou caminho publico gerado pela API.
- Upload usa `multipart/form-data` com campo `file`.
- Resposta do upload retorna o `PerfilContaResponse` ja atualizado.

## Banco de dados

- `perfis_conta.logo_url` armazena apenas a referencia, por exemplo `/uploads/account-logos/<contaId>/<arquivo>.webp`.
- Nao armazenar binario nem base64 no banco.

## Regras de negocio

- Logo e opcional.
- Upload deve aceitar apenas imagens (`image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/svg+xml` nao deve ser processado como bitmap no MVP).
- Limite recomendado para anexar logo: 2 MB antes do upload.
- Imagem final deve ser redimensionada para no maximo 512px no maior lado e salva em WebP.
- A API resolve a conta pelo token, nunca por input do frontend.

## Riscos

- Storage local e suficiente para MVP/local, mas em producao multi-instancia deve migrar para S3/CDN mantendo a mesma coluna `LogoUrl`.
- Arquivos antigos podem ficar orfaos se a logo for trocada muitas vezes; limpeza periodica fica fora deste ajuste.

## Duvidas

- Nenhuma duvida bloqueante para o MVP.
