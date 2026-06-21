param(
  [Parameter(Mandatory = $true)]
  [string]$BucketName,

  [string]$DistributionId,

  [string]$DistPath = "apps/web/dist"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$resolvedDistPath = Resolve-Path (Join-Path $repoRoot $DistPath)
$indexPath = Join-Path $resolvedDistPath "index.html"

if (-not (Test-Path $indexPath)) {
  throw "index.html nao encontrado em $resolvedDistPath. Rode pnpm web:build:beta antes."
}

$bucketUri = "s3://$BucketName"

aws s3 sync $resolvedDistPath $bucketUri `
  --delete `
  --exclude "index.html" `
  --cache-control "public,max-age=31536000,immutable"
if ($LASTEXITCODE -ne 0) {
  throw "Falha no sync de assets para $bucketUri."
}

aws s3 cp $indexPath "$bucketUri/index.html" `
  --cache-control "no-cache,no-store,must-revalidate" `
  --content-type "text/html"
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao publicar index.html em $bucketUri."
}

if (-not [string]::IsNullOrWhiteSpace($DistributionId)) {
  aws cloudfront create-invalidation `
    --distribution-id $DistributionId `
    --paths "/*"
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao invalidar CloudFront $DistributionId."
  }
}

Write-Host "Deploy web concluido para $bucketUri."
