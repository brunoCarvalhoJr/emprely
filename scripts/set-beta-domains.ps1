param(
  [string]$EnvPath = "infra/docker/beta.env",
  [string]$ApiPublicUrl = "https://api.emprely.com.br",
  [string]$WebPublicUrl = "https://app.emprely.com.br"
)

$ErrorActionPreference = "Stop"

function Set-EnvArquivoValor {
  param(
    [Parameter(Mandatory = $true)]
    [AllowEmptyString()]
    [string[]]$Lines,
    [Parameter(Mandatory = $true)]
    [string]$Key,
    [Parameter(Mandatory = $true)]
    [string]$Value
  )

  $updated = $false
  $result = foreach ($line in $Lines) {
    if ($line.Trim().StartsWith("$Key=")) {
      $updated = $true
      "$Key=$Value"
    }
    else {
      $line
    }
  }

  if (-not $updated) {
    $result += "$Key=$Value"
  }

  return $result
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$resolvedEnvPath = Join-Path $repoRoot $EnvPath

if (-not (Test-Path $resolvedEnvPath)) {
  throw "Arquivo nao encontrado: $resolvedEnvPath. Execute pnpm beta:env:new antes."
}

$lines = Get-Content -Path $resolvedEnvPath
$lines = Set-EnvArquivoValor -Lines $lines -Key "API_PUBLIC_URL" -Value $ApiPublicUrl
$lines = Set-EnvArquivoValor -Lines $lines -Key "WEB_PUBLIC_URL" -Value $WebPublicUrl

Set-Content -Path $resolvedEnvPath -Value $lines -Encoding UTF8

Write-Host "Dominios aplicados em $resolvedEnvPath"
Write-Host "API_PUBLIC_URL=$ApiPublicUrl"
Write-Host "WEB_PUBLIC_URL=$WebPublicUrl"
