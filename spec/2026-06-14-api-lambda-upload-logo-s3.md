# Spec - API Lambda e upload de logo em S3

> Status: implementada como preparacao tecnica e mantida como alternativa futura.
> Em 2026-06-14 o caminho oficial do beta inicial mudou para `spec/2026-06-14-deploy-lightsail-api-baixo-custo.md`.

## Visao geral

Preparar a API do Emprely para o primeiro beta serverless, removendo a dependencia de disco local para upload de logomarca em Lambda e adicionando o bootstrap de hospedagem ASP.NET Core em AWS Lambda + API Gateway.

## Escopo

Inclui:

- Adicionar pacote e chamada de Lambda hosting na API.
- Configurar Lambda para API Gateway HTTP API.
- Criar configuracao `LogoPerfilStorage`.
- Manter provider `Local` para desenvolvimento/testes.
- Criar provider `S3` para upload persistente de logos.
- Criar provider `Disabled` para desativacao temporaria controlada.
- Impedir provider `Local` quando a API estiver rodando em Lambda.
- Atualizar exemplos de configuracao e docs de deploy.

Fora do escopo:

- Criar bucket S3 real.
- Criar CloudFront/assets domain real.
- Criar IAM Role/policy real.
- Criar pipeline/IaC de deploy Lambda.
- Trocar o target framework da API de `net9.0` para `net8.0`.
- Data Protection keys foram tratadas depois em `spec/2026-06-14-data-protection-keys-postgres.md`.

## Fluxo ponta a ponta

1. Ambiente local usa `LogoPerfilStorage:Provider=Local`.
2. Usuario envia logo no endpoint atual.
3. API valida e converte a imagem para WebP.
4. Em local, API grava em `wwwroot/uploads/account-logos` e serve por static files.
5. Em beta real com S3, API envia o WebP para bucket S3 e retorna URL baseada em `S3PublicBaseUrl`.
6. Em beta real sem bucket pronto, deploy pode usar `Provider=Disabled`, e o endpoint de upload responde erro controlado.
7. Em Lambda, provider `Local` falha na inicializacao.
8. API inicializa com `AddAWSLambdaHosting(LambdaEventSource.HttpApi)`.

## Requisitos

- R01: A API deve ter dependencia `Amazon.Lambda.AspNetCoreServer.Hosting`.
- R02: `Program.cs` deve registrar Lambda hosting para API Gateway HTTP API.
- R03: O upload local deve continuar funcionando nos testes existentes.
- R04: O provider `S3` deve usar `AWSSDK.S3`.
- R05: O provider `S3` deve exigir `S3BucketName` e `S3PublicBaseUrl`.
- R06: O provider `S3` deve salvar objeto com content type `image/webp`.
- R07: O provider `S3` deve retornar URL publica/CDN persistente.
- R08: O provider `Disabled` deve responder erro de negocio claro sem gravar arquivo.
- R09: Em AWS Lambda, `Provider=Local` nao pode ser aceito.
- R10: Static files locais so devem ser habilitados quando `Provider=Local`.
- R11: Nenhum secret AWS deve ser versionado.

## Regras de negocio

- Upload de logo e util para o MVP, mas pode ser desativado temporariamente no beta se storage externo ainda nao estiver pronto.
- O campo `LogoUrl` continua aceitando URL absoluta ou a URL local antiga.
- A imagem continua limitada a 2 MB.
- A imagem continua sendo normalizada para WebP.

## Impactos por projeto

- API:
  - `Emprely.Api.csproj` recebe pacotes AWS;
  - `Program.cs` ganha bootstrap Lambda e DI condicional de storage;
  - upload de logo ganha providers Local/S3/Disabled;
  - appsettings recebem exemplos de `LogoPerfilStorage`.

- Web:
  - sem mudanca de contrato; `LogoUrl` pode ser URL absoluta de CDN.

- Mobile:
  - sem impacto.

- Landing:
  - sem impacto.

- Packages:
  - sem impacto.

- Infra:
  - precisa de bucket S3, dominio/CDN publico para leitura de logos e IAM Role da Lambda com `s3:PutObject`.

## Criterios de aceite

- CA01: A API compila com pacote Lambda.
- CA02: `Program.cs` chama `AddAWSLambdaHosting(LambdaEventSource.HttpApi)`.
- CA03: Upload local existente continua passando nos testes de integracao.
- CA04: Existe provider S3 sem escrita em disco local.
- CA05: Existe provider Disabled para deploy temporario sem upload.
- CA06: Em Lambda, provider Local falha com mensagem explicita.
- CA07: Docs/env vars indicam `LogoPerfilStorage__Provider=S3` e variaveis relacionadas.
- CA08: Nenhum segredo real e adicionado.

## Estrategia de implementacao

1. Adicionar pacotes AWS no projeto da API.
2. Criar `LogoPerfilStorageOptions`.
3. Refatorar processamento da imagem para ser compartilhado por Local e S3.
4. Implementar `S3LogoPerfilStorageService`.
5. Implementar `DisabledLogoPerfilStorageService`.
6. Registrar provider por configuracao no `Program.cs`.
7. Habilitar static files apenas no provider local.
8. Atualizar appsettings, README/runbook/checklist.
9. Rodar build/testes da API.

## Testes

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- Verificar que o teste de upload local continua esperando `/uploads/account-logos/...`.
- Verificar por busca textual que `LogoPerfilStorage__Provider` esta documentado.
