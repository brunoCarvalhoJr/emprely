param(
  [string]$EnvPath = "infra/lightsail/lightsail.env",
  [switch]$AllowPlaceholders
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
  "EMPRELY_API_IMAGE",
  "EMPRELY_API_DOMAIN",
  "CADDY_ACME_EMAIL",
  "EMPRELY_DB_CONNECTION_STRING",
  "Jwt__Issuer",
  "Jwt__Audience",
  "Jwt__SigningKey",
  "Jwt__ExpirationMinutes",
  "Cors__OrigensPermitidas__0",
  "App__PublicWebUrl",
  "AdminOperacoes__OperationsKey",
  "RateLimit__AuthPermitLimit",
  "RateLimit__AdminPermitLimit",
  "RateLimit__PublicSupportPermitLimit",
  "RateLimit__WindowSeconds",
  "EmailTransacional__Provider",
  "EmailTransacional__FromEmail",
  "EmailTransacional__FromName",
  "EmailTransacional__SesRegion",
  "EmailTransacional__SuporteDestinoEmail",
  "LogoPerfilStorage__Provider",
  "Asaas__BaseUrl",
  "Asaas__ApiKey",
  "Asaas__WebhookToken",
  "Asaas__CheckoutSuccessUrl",
  "Asaas__CheckoutCancelUrl",
  "Asaas__CheckoutExpiredUrl"
)

foreach ($key in $requiredKeys) {
  if (-not $valores.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($valores[$key])) {
    throw "Variavel obrigatoria ausente ou vazia: $key"
  }
}

if (-not $AllowPlaceholders) {
  $placeholderPatterns = @("troque-", "<", ">", "example", "localhost")

  foreach ($entry in $valores.GetEnumerator()) {
    foreach ($pattern in $placeholderPatterns) {
      if ($entry.Key -eq "ALLOWED_HOSTS" -and $pattern -eq "localhost") {
        continue
      }

      if ($entry.Value.Contains($pattern)) {
        throw "Variavel $($entry.Key) contem placeholder: $pattern"
      }
    }
  }
}

if (-not $AllowPlaceholders) {
  if ($valores["Jwt__SigningKey"].Length -lt 32) {
    throw "Jwt__SigningKey deve ter pelo menos 32 caracteres."
  }

  if ($valores["AdminOperacoes__OperationsKey"].Length -lt 32) {
    throw "AdminOperacoes__OperationsKey deve ter pelo menos 32 caracteres."
  }
}

foreach ($urlKey in @(
  "Cors__OrigensPermitidas__0",
  "App__PublicWebUrl",
  "Asaas__BaseUrl",
  "Asaas__CheckoutSuccessUrl",
  "Asaas__CheckoutCancelUrl",
  "Asaas__CheckoutExpiredUrl"
)) {
  $uri = $null
  if (-not [System.Uri]::TryCreate($valores[$urlKey], [System.UriKind]::Absolute, [ref]$uri)) {
    throw "$urlKey deve ser uma URL absoluta."
  }

  if ($uri.Scheme -ne "https") {
    throw "$urlKey deve usar https em beta/producao."
  }
}

if (-not $AllowPlaceholders) {
  foreach ($key in @("Asaas__ApiKey", "Asaas__WebhookToken")) {
    if ($valores[$key].Length -lt 20) {
      throw "$key parece curto demais para um segredo Asaas real."
    }
  }
}

if ($valores["LogoPerfilStorage__Provider"].Equals("S3", [System.StringComparison]::OrdinalIgnoreCase)) {
  foreach ($key in @("LogoPerfilStorage__S3BucketName", "LogoPerfilStorage__S3PublicBaseUrl", "LogoPerfilStorage__S3Region", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY")) {
    if (-not $valores.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($valores[$key])) {
      throw "Variavel obrigatoria para S3 ausente ou vazia: $key"
    }
  }
}

if ($valores["EmailTransacional__Provider"].Equals("Fake", [System.StringComparison]::OrdinalIgnoreCase)) {
  Write-Warning "EmailTransacional__Provider=Fake nao envia email real; use apenas para smoke tecnico."
}

if ($valores["EmailTransacional__Provider"].Equals("SES", [System.StringComparison]::OrdinalIgnoreCase)) {
  foreach ($key in @("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY")) {
    if (-not $valores.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($valores[$key])) {
      throw "Variavel obrigatoria para SES ausente ou vazia: $key"
    }
  }
}

Write-Host "Arquivo Lightsail env valido: $resolvedEnvPath"
