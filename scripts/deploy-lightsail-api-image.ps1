param(
  [Parameter(Mandatory = $true)]
  [string]$SshHost,

  [string]$User = "ubuntu",

  [string]$KeyPath,

  [string]$ImageTarPath = ".artifacts/lightsail/emprely-api-lightsail.tar",

  [string]$EnvFile,

  [string]$RemoteDirectory = "/opt/emprely/orcamentos",

  [switch]$SkipComposeUp
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$resolvedImageTarPath = Resolve-Path (Join-Path $repoRoot $ImageTarPath)
$resolvedComposePath = Resolve-Path (Join-Path $repoRoot "infra/lightsail/docker-compose.api.yml")
$resolvedCaddyfilePath = Resolve-Path (Join-Path $repoRoot "infra/lightsail/Caddyfile")
$imageTarName = Split-Path -Leaf $resolvedImageTarPath
$target = "$User@$SshHost"

$sshArgs = @()
if (-not [string]::IsNullOrWhiteSpace($KeyPath)) {
  $resolvedKeyPath = Resolve-Path $KeyPath
  $sshArgs += @("-i", $resolvedKeyPath)
}

$scpArgs = @()
if (-not [string]::IsNullOrWhiteSpace($KeyPath)) {
  $scpArgs += @("-i", (Resolve-Path $KeyPath))
}

ssh @sshArgs $target "sudo mkdir -p $RemoteDirectory && sudo chown ${User}:${User} $RemoteDirectory"
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao criar diretorio remoto."
}

scp @scpArgs $resolvedImageTarPath $resolvedComposePath $resolvedCaddyfilePath "${target}:$RemoteDirectory/"
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao enviar imagem/compose/Caddyfile."
}

if (-not [string]::IsNullOrWhiteSpace($EnvFile)) {
  $resolvedEnvFile = Resolve-Path $EnvFile
  scp @scpArgs $resolvedEnvFile "${target}:$RemoteDirectory/lightsail.env"
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao enviar lightsail.env."
  }
}

ssh @sshArgs $target "cd $RemoteDirectory && sudo docker load -i $imageTarName"
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao carregar imagem no servidor."
}

if (-not $SkipComposeUp) {
  ssh @sshArgs $target "cd $RemoteDirectory && test -f lightsail.env && sudo docker compose -f docker-compose.api.yml --env-file lightsail.env up -d"
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao subir docker compose. Confirme se lightsail.env existe e esta valido."
  }

  Write-Host "Deploy concluido em $target."
}
else {
  Write-Host "Imagem enviada e carregada. Compose nao foi executado por causa de -SkipComposeUp."
}
