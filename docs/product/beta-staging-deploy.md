# Deploy beta/staging - Emprely Orcamentos

## Objetivo

Subir o MVP em um ambiente beta/staging simples com Docker Compose, mantendo secrets reais fora do repositorio. Este guia e neutro de provedor: funciona como base para uma VM, servidor Docker ou pipeline inicial.

## Arquivos

- `infra/docker/Dockerfile.api`: publica a API .NET em container.
- `infra/docker/Dockerfile.web`: builda o web React/Vite e serve com Nginx.
- `infra/docker/nginx.web.conf`: fallback SPA e healthcheck do web.
- `infra/docker/docker-compose.beta.example.yml`: API, web e PostgreSQL.
- `infra/docker/beta.env.example`: variaveis de exemplo sem secrets reais.

## Pre-requisitos

- Docker Engine ou Docker Desktop ativo com suporte a containers Linux.
- Docker Compose disponivel no terminal.
- .NET SDK instalado na maquina que aplicar migrations pelo `dotnet ef`.
- Valores reais de secrets configurados fora do repositorio.

## Validar configuracao

Na raiz do monorepo:

```powershell
pnpm validate:deploy
```

Esse comando valida a sintaxe do compose beta/staging usando os placeholders de exemplo.

Para validar build das imagens, subida temporaria dos containers, migrations e health checks locais:

```powershell
pnpm validate:deploy:runtime
```

O script usa portas alternativas `15432`, `18080` e `18081`, aplica migrations em um banco temporario do compose beta e derruba os containers com volume ao final.

Para rodar o mesmo smoke com o arquivo privado gerado:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/validate-beta-runtime.ps1 -EnvFile infra/docker/beta.env
```

## Variaveis obrigatorias

Configure valores reais fora do Git:

```txt
POSTGRES_PASSWORD=<senha-forte>
API_PUBLIC_URL=https://api.emprely.com.br
WEB_PUBLIC_URL=https://app.emprely.com.br
JWT_SIGNING_KEY=<chave-com-pelo-menos-32-caracteres>
ADMIN_OPERACOES_KEY=<chave-admin-com-pelo-menos-32-caracteres>
```

O web usa `VITE_API_BASE_URL` em tempo de build. No compose beta essa variavel vem de `API_PUBLIC_URL`. Se a URL publica da API mudar, gere uma nova imagem do web.

## Gerar arquivo privado

Para gerar `infra/docker/beta.env` com secrets fortes:

```powershell
pnpm beta:env:new
```

Para sobrescrever um arquivo existente:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/new-beta-env.ps1 -Force
```

Para gerar ja com dominios reais:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/new-beta-env.ps1 `
  -ApiPublicUrl "https://api.emprely.com.br" `
  -WebPublicUrl "https://app.emprely.com.br"
```

Ou aplique os dominios oficiais planejados no arquivo privado ja existente:

```powershell
pnpm beta:env:domains
pnpm beta:env:validate:public
```

Valide antes de subir:

```powershell
pnpm beta:env:validate
```

`infra/docker/beta.env` e ignorado pelo Git. Mantenha esse arquivo fora de commits, prints e compartilhamentos.

## Subir beta/staging

Exemplo usando um arquivo privado `infra/docker/beta.env`:

```powershell
docker compose `
  -f infra/docker/docker-compose.beta.example.yml `
  --env-file infra/docker/beta.env `
  build

docker compose `
  -f infra/docker/docker-compose.beta.example.yml `
  --env-file infra/docker/beta.env `
  up -d
```

## Aplicar migrations

Para o beta com PostgreSQL exposto localmente pela porta definida em `POSTGRES_PORT`, aplique as migrations a partir da maquina com SDK .NET:

```powershell
dotnet tool restore
$env:ConnectionStrings__EmprelyDb="Host=localhost;Port=5432;Database=emprely;Username=emprely;Password=<senha-forte>"
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
Remove-Item Env:\ConnectionStrings__EmprelyDb
```

Em provedor gerenciado, use a connection string do banco beta/staging e aplique a migration antes de liberar usuarios.

## Health checks

Depois do deploy:

```powershell
Invoke-RestMethod http://localhost:8080/health/live
Invoke-RestMethod http://localhost:8080/health/ready
Invoke-RestMethod http://localhost:8081/health
```

Em beta real, troque `localhost` pelos dominios publicos.

## Aceite manual minimo

- Criar conta nova.
- Fazer login.
- Configurar conta.
- Cadastrar cliente com WhatsApp valido.
- Cadastrar servico.
- Criar e gerar proposta.
- Testar imprimir/PDF.
- Testar WhatsApp em dispositivo real.
- Marcar proposta como enviada.
- Marcar proposta enviada como aceita ou recusada.
- Ativar Plano Fundador via endpoint administrativo.
- Confirmar que o Plano Fundador remove o bloqueio comercial esperado.

## Rollback manual

Para parar o ambiente sem apagar dados:

```powershell
docker compose `
  -f infra/docker/docker-compose.beta.example.yml `
  --env-file infra/docker/beta.env `
  down
```

Para apagar tambem o banco beta local do compose:

```powershell
docker compose `
  -f infra/docker/docker-compose.beta.example.yml `
  --env-file infra/docker/beta.env `
  down -v
```

Use `down -v` somente quando quiser descartar os dados desse ambiente.
