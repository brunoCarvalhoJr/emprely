param(
  [string]$ImageTag = "emprely-api:lightsail",
  [string]$OutputPath = ".artifacts/lightsail/emprely-api-lightsail.tar",
  [switch]$NoSave
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$resolvedOutputPath = Join-Path $repoRoot $OutputPath
$outputDirectory = Split-Path -Parent $resolvedOutputPath

Push-Location $repoRoot
try {
  docker build -f infra/docker/Dockerfile.api -t $ImageTag .
  if ($LASTEXITCODE -ne 0) {
    throw "docker build falhou."
  }

  if (-not $NoSave) {
    if (-not (Test-Path $outputDirectory)) {
      New-Item -ItemType Directory -Path $outputDirectory | Out-Null
    }

    docker save -o $resolvedOutputPath $ImageTag
    if ($LASTEXITCODE -ne 0) {
      throw "docker save falhou."
    }

    Write-Host "Imagem salva em: $resolvedOutputPath"
  }

  Write-Host "Imagem pronta: $ImageTag"
}
finally {
  Pop-Location
}
