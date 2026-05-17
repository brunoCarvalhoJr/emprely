param(
  [string]$OutputPath = "infra/docker/beta.env",
  [string]$ApiPublicUrl = "http://localhost:8080",
  [string]$WebPublicUrl = "http://localhost:8081",
  [int]$PostgresPort = 5432,
  [int]$ApiPort = 8080,
  [int]$WebPort = 8081,
  [switch]$Force
)

$ErrorActionPreference = "Stop"

function New-SegredoBase64Url {
  param([int]$Bytes = 48)

  $bytesArray = [byte[]]::new($Bytes)
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $rng.GetBytes($bytesArray)
  }
  finally {
    $rng.Dispose()
  }

  return [Convert]::ToBase64String($bytesArray).TrimEnd("=").Replace("+", "-").Replace("/", "_")
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$resolvedOutputPath = Join-Path $repoRoot $OutputPath
$outputDirectory = Split-Path -Parent $resolvedOutputPath

if ((Test-Path $resolvedOutputPath) -and -not $Force) {
  throw "Arquivo ja existe: $resolvedOutputPath. Use -Force para sobrescrever."
}

if (-not (Test-Path $outputDirectory)) {
  New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$postgresPassword = New-SegredoBase64Url -Bytes 36
$jwtSigningKey = New-SegredoBase64Url -Bytes 64
$adminOperacoesKey = New-SegredoBase64Url -Bytes 48

$conteudo = @(
  "POSTGRES_DB=emprely",
  "POSTGRES_USER=emprely",
  "POSTGRES_PASSWORD=$postgresPassword",
  "POSTGRES_PORT=$PostgresPort",
  "",
  "API_PORT=$ApiPort",
  "WEB_PORT=$WebPort",
  "API_PUBLIC_URL=$ApiPublicUrl",
  "WEB_PUBLIC_URL=$WebPublicUrl",
  "",
  "JWT_ISSUER=Emprely",
  "JWT_AUDIENCE=Emprely.Web",
  "JWT_SIGNING_KEY=$jwtSigningKey",
  "JWT_EXPIRATION_MINUTES=120",
  "",
  "ADMIN_OPERACOES_KEY=$adminOperacoesKey",
  "",
  "RATE_LIMIT_AUTH_PERMIT_LIMIT=30",
  "RATE_LIMIT_ADMIN_PERMIT_LIMIT=10",
  "RATE_LIMIT_WINDOW_SECONDS=60"
)

Set-Content -Path $resolvedOutputPath -Value $conteudo -Encoding UTF8

Write-Host "Arquivo beta env criado em: $resolvedOutputPath"
Write-Host "Ajuste API_PUBLIC_URL e WEB_PUBLIC_URL antes de usar em beta real."
