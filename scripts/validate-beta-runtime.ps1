param(
  [string]$EnvFile = "infra/docker/beta.env.example",
  [int]$PostgresPort = 15432,
  [int]$ApiPort = 18080,
  [int]$WebPort = 18081,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

function Invoke-NativeChecked {
  param(
    [Parameter(Mandatory = $true)]
    [scriptblock]$Command
  )

  & $Command
  if ($LASTEXITCODE -ne 0) {
    throw "Native command failed with exit code $LASTEXITCODE"
  }
}

function Get-EnvArquivoValor {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [Parameter(Mandatory = $true)]
    [string]$Key
  )

  $line = Get-Content -Path $Path | Where-Object {
    $_.Trim().StartsWith("$Key=")
  } | Select-Object -First 1

  if (-not $line) {
    throw "Variavel obrigatoria nao encontrada em ${Path}: $Key"
  }

  return $line.Substring($line.IndexOf("=") + 1).Trim()
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $repoRoot

$resolvedEnvFile = Resolve-Path $EnvFile

$composeArgs = @(
  "-f", "infra/docker/docker-compose.beta.example.yml",
  "--env-file", $resolvedEnvFile
)

$postgresDb = Get-EnvArquivoValor -Path $resolvedEnvFile -Key "POSTGRES_DB"
$postgresUser = Get-EnvArquivoValor -Path $resolvedEnvFile -Key "POSTGRES_USER"
$postgresPassword = Get-EnvArquivoValor -Path $resolvedEnvFile -Key "POSTGRES_PASSWORD"

$env:POSTGRES_PORT = [string]$PostgresPort
$env:API_PORT = [string]$ApiPort
$env:WEB_PORT = [string]$WebPort
$env:API_PUBLIC_URL = "http://localhost:$ApiPort"
$env:WEB_PUBLIC_URL = "http://localhost:$WebPort"

try {
  if (-not $SkipBuild) {
    Invoke-NativeChecked { docker compose @composeArgs build api web }
  }

  Invoke-NativeChecked { docker compose @composeArgs up -d postgres api web }

  Invoke-NativeChecked { dotnet tool restore }

  $env:ConnectionStrings__EmprelyDb = "Host=localhost;Port=$PostgresPort;Database=$postgresDb;Username=$postgresUser;Password=$postgresPassword"
  Invoke-NativeChecked { dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api }

  $deadline = (Get-Date).AddSeconds(90)
  do {
    try {
      $live = Invoke-RestMethod -Uri "http://localhost:$ApiPort/health/live" -TimeoutSec 5
      $ready = Invoke-RestMethod -Uri "http://localhost:$ApiPort/health/ready" -TimeoutSec 5
      $web = Invoke-RestMethod -Uri "http://localhost:$WebPort/health" -TimeoutSec 5

      Write-Host "api_live=$($live.status) environment=$($live.environment)"
      Write-Host "api_ready=$($ready.status) database=$($ready.database)"
      Write-Host "web_health=$web"
      break
    }
    catch {
      if ((Get-Date) -gt $deadline) {
        throw
      }

      Start-Sleep -Seconds 3
    }
  } while ($true)
}
finally {
  Remove-Item Env:\ConnectionStrings__EmprelyDb -ErrorAction SilentlyContinue

  docker compose @composeArgs down -v --remove-orphans

  Remove-Item Env:\POSTGRES_PORT -ErrorAction SilentlyContinue
  Remove-Item Env:\API_PORT -ErrorAction SilentlyContinue
  Remove-Item Env:\WEB_PORT -ErrorAction SilentlyContinue
  Remove-Item Env:\API_PUBLIC_URL -ErrorAction SilentlyContinue
  Remove-Item Env:\WEB_PUBLIC_URL -ErrorAction SilentlyContinue
}
