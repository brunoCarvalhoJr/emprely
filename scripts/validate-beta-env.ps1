param(
  [string]$EnvPath = "infra/docker/beta.env",
  [switch]$RequirePublicUrls
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$resolvedEnvPath = Join-Path $repoRoot $EnvPath

if (-not (Test-Path $resolvedEnvPath)) {
  throw "Arquivo nao encontrado: $resolvedEnvPath"
}

$valores = @{}
Get-Content -Path $resolvedEnvPath | ForEach-Object {
  $line = $_.Trim()
  if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) {
    return
  }

  $separatorIndex = $line.IndexOf("=")
  if ($separatorIndex -le 0) {
    throw "Linha invalida em ${resolvedEnvPath}: $line"
  }

  $key = $line.Substring(0, $separatorIndex).Trim()
  $value = $line.Substring($separatorIndex + 1).Trim()
  $valores[$key] = $value
}

$requiredKeys = @(
  "POSTGRES_DB",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_PORT",
  "API_PORT",
  "WEB_PORT",
  "API_PUBLIC_URL",
  "WEB_PUBLIC_URL",
  "JWT_ISSUER",
  "JWT_AUDIENCE",
  "JWT_SIGNING_KEY",
  "JWT_EXPIRATION_MINUTES",
  "ADMIN_OPERACOES_KEY",
  "RATE_LIMIT_AUTH_PERMIT_LIMIT",
  "RATE_LIMIT_ADMIN_PERMIT_LIMIT",
  "RATE_LIMIT_WINDOW_SECONDS"
)

foreach ($key in $requiredKeys) {
  if (-not $valores.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($valores[$key])) {
    throw "Variavel obrigatoria ausente ou vazia: $key"
  }
}

$placeholderPatterns = @(
  "troque-",
  "<",
  ">",
  "seu-dominio.com"
)

foreach ($entry in $valores.GetEnumerator()) {
  foreach ($pattern in $placeholderPatterns) {
    if ($entry.Value.Contains($pattern)) {
      throw "Variavel $($entry.Key) contem placeholder: $pattern"
    }
  }
}

if ($valores["POSTGRES_PASSWORD"].Length -lt 32) {
  throw "POSTGRES_PASSWORD deve ter pelo menos 32 caracteres."
}

if ($valores["JWT_SIGNING_KEY"].Length -lt 32) {
  throw "JWT_SIGNING_KEY deve ter pelo menos 32 caracteres."
}

if ($valores["ADMIN_OPERACOES_KEY"].Length -lt 32) {
  throw "ADMIN_OPERACOES_KEY deve ter pelo menos 32 caracteres."
}

foreach ($urlKey in @("API_PUBLIC_URL", "WEB_PUBLIC_URL")) {
  $uri = $null
  if (-not [System.Uri]::TryCreate($valores[$urlKey], [System.UriKind]::Absolute, [ref]$uri)) {
    throw "$urlKey deve ser uma URL absoluta."
  }

  if ($uri.Scheme -notin @("http", "https")) {
    throw "$urlKey deve usar http ou https."
  }

  if ($RequirePublicUrls -and ($uri.Host -in @("localhost", "127.0.0.1") -or $uri.Host.EndsWith(".local"))) {
    throw "$urlKey deve apontar para um dominio publico quando -RequirePublicUrls for usado."
  }
}

foreach ($portKey in @("POSTGRES_PORT", "API_PORT", "WEB_PORT")) {
  $portValue = 0
  if (-not [int]::TryParse($valores[$portKey], [ref]$portValue) -or $portValue -lt 1 -or $portValue -gt 65535) {
    throw "$portKey deve ser uma porta valida."
  }
}

Write-Host "Arquivo beta env valido: $resolvedEnvPath"
