param(
  [string]$ApiBaseUrl = "https://api.emprely.com.br",
  [string]$WebDirectory = "apps/web"
)

$ErrorActionPreference = "Stop"

if (-not $ApiBaseUrl.StartsWith("https://")) {
  throw "ApiBaseUrl deve usar https para beta/producao."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$resolvedWebDirectory = Resolve-Path (Join-Path $repoRoot $WebDirectory)
$distPath = Join-Path $resolvedWebDirectory "dist"

$pnpm = "pnpm"
if ($env:OS -eq "Windows_NT") {
  $pnpm = "pnpm.cmd"
}

Push-Location $repoRoot
try {
  $env:VITE_API_BASE_URL = $ApiBaseUrl

  & $pnpm --dir $WebDirectory build
  if ($LASTEXITCODE -ne 0) {
    throw "Build do web falhou."
  }

  $indexPath = Join-Path $distPath "index.html"
  if (-not (Test-Path $indexPath)) {
    throw "Build nao gerou index.html em $distPath."
  }

  Write-Host "Web build beta pronto em: $distPath"
  Write-Host "VITE_API_BASE_URL=$ApiBaseUrl"
}
finally {
  Remove-Item Env:\VITE_API_BASE_URL -ErrorAction SilentlyContinue
  Pop-Location
}
