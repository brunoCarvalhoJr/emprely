# Webapp S3 + CloudFront - Emprely

Este kit documenta o deploy do app React/Vite em S3 + CloudFront.

Runbook completo:

```txt
docs/product/webapp-s3-cloudfront-deploy.md
```

## Build beta

```powershell
pnpm web:build:beta
```

Padrao:

```txt
VITE_API_BASE_URL=https://api.emprely.com.br
```

Para trocar a API:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-web-beta.ps1 `
  -ApiBaseUrl "https://api.emprely.com.br"
```

## Deploy S3

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web"
```

Com invalidacao CloudFront:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web" -DistributionId "<cloudfront-id>"
```

## Observacoes

- O bucket S3 deve ficar privado.
- CloudFront deve usar OAC.
- `index.html` usa cache curto/no-cache.
- Assets versionados do Vite usam cache longo.
- `app.emprely.com.br` deve ser configurado no CloudFront com certificado ACM em `us-east-1`.
