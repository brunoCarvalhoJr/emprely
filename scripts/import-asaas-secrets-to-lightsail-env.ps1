param(
  [ValidateSet("Sandbox", "Production")]
  [string]$Environment = "Sandbox",
  [string]$SecretsDirectory = "D:\Emprely\Segredos",
  [string]$EnvPath = "D:\Emprely\Segredos\lightsail.env",
  [string]$TemplatePath = "infra/lightsail/lightsail.env.example"
)

$ErrorActionPreference = "Stop"

function Read-EnvFile {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Arquivo nao encontrado: $Path"
  }

  $values = [ordered]@{}
  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) {
      return
    }

    $separatorIndex = $line.IndexOf("=")
    if ($separatorIndex -le 0) {
      throw "Linha invalida em ${Path}: esperado KEY=value."
    }

    $key = $line.Substring(0, $separatorIndex).Trim()
    $value = $line.Substring($separatorIndex + 1).Trim()
    $values[$key] = $value
  }

  return $values
}

function Assert-EnvValue {
  param(
    [hashtable]$Values,
    [string]$Key,
    [string]$SourcePath
  )

  if (-not $Values.Contains($Key) -or [string]::IsNullOrWhiteSpace($Values[$Key])) {
    throw "Variavel obrigatoria ausente em ${SourcePath}: $Key"
  }
}

function Set-EnvValues {
  param(
    [string]$Path,
    [hashtable]$Values
  )

  $lines = New-Object System.Collections.Generic.List[string]
  if (Test-Path -LiteralPath $Path) {
    Get-Content -LiteralPath $Path | ForEach-Object { $lines.Add($_) }
  }

  $updatedKeys = New-Object System.Collections.Generic.HashSet[string]

  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $trimmed = $line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed.StartsWith("#")) {
      continue
    }

    $separatorIndex = $line.IndexOf("=")
    if ($separatorIndex -le 0) {
      continue
    }

    $key = $line.Substring(0, $separatorIndex).Trim()
    if ($Values.Contains($key)) {
      $lines[$i] = "$key=$($Values[$key])"
      [void]$updatedKeys.Add($key)
    }
  }

  foreach ($key in $Values.Keys) {
    if (-not $updatedKeys.Contains($key)) {
      $lines.Add("$key=$($Values[$key])")
    }
  }

  Set-Content -LiteralPath $Path -Value $lines -Encoding utf8
}

function ConvertTo-ComposeEnvValue {
  param([string]$Value)

  return $Value.Replace('$', '$$')
}

$apiKeyFileName = if ($Environment -eq "Production") {
  "ASAAS-PROD-API-KEYY.env"
} else {
  "ASAAS-SANDBOX-API-KEYY.env"
}

$apiKeyPath = Join-Path $SecretsDirectory $apiKeyFileName
$webhookTokenPath = Join-Path $SecretsDirectory "ASAAS-TOKEN-WEBHOOK.env"

$apiValues = Read-EnvFile -Path $apiKeyPath
$webhookValues = Read-EnvFile -Path $webhookTokenPath

Assert-EnvValue -Values $apiValues -Key "Asaas__BaseUrl" -SourcePath $apiKeyPath
Assert-EnvValue -Values $apiValues -Key "Asaas__ApiKey" -SourcePath $apiKeyPath
Assert-EnvValue -Values $webhookValues -Key "Asaas__WebhookToken" -SourcePath $webhookTokenPath

$baseUrlNormalizada = $apiValues["Asaas__BaseUrl"].Trim().TrimEnd("/")
if ($Environment -eq "Production" -and $baseUrlNormalizada -match "sandbox") {
  throw "Ambiente Production nao pode usar Asaas__BaseUrl de sandbox."
}

if ($Environment -eq "Sandbox" -and $baseUrlNormalizada -notmatch "sandbox") {
  throw "Ambiente Sandbox deve usar Asaas__BaseUrl de sandbox."
}

$repoRoot = Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "..")
$resolvedTemplatePath = Join-Path $repoRoot $TemplatePath
$resolvedEnvPath = $EnvPath

if (-not (Test-Path -LiteralPath $resolvedEnvPath)) {
  if (-not (Test-Path -LiteralPath $resolvedTemplatePath)) {
    throw "Env privado nao existe e template nao foi encontrado: $resolvedTemplatePath"
  }

  Copy-Item -LiteralPath $resolvedTemplatePath -Destination $resolvedEnvPath
  Write-Host "Env privado criado a partir do template: $resolvedEnvPath"
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "$resolvedEnvPath.bak-asaas-$timestamp"
Copy-Item -LiteralPath $resolvedEnvPath -Destination $backupPath

$updates = [ordered]@{
  "Asaas__BaseUrl" = $baseUrlNormalizada
  "Asaas__ApiKey" = ConvertTo-ComposeEnvValue -Value $apiValues["Asaas__ApiKey"]
  "Asaas__WebhookToken" = ConvertTo-ComposeEnvValue -Value $webhookValues["Asaas__WebhookToken"]
  "Asaas__CheckoutSuccessUrl" = "https://app.emprely.com.br/billing/sucesso"
  "Asaas__CheckoutCancelUrl" = "https://app.emprely.com.br/billing/cancelado"
  "Asaas__CheckoutExpiredUrl" = "https://app.emprely.com.br/billing/expirado"
}

Set-EnvValues -Path $resolvedEnvPath -Values $updates

Write-Host "Segredos Asaas importados para o env privado da API."
Write-Host "Ambiente selecionado: $Environment"
Write-Host "Arquivo atualizado: $resolvedEnvPath"
Write-Host "Backup criado: $backupPath"
Write-Host "Chaves atualizadas: $($updates.Keys -join ', ')"
Write-Host "Valores secretos nao foram exibidos."
