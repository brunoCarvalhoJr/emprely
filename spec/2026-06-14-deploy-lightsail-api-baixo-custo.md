# Spec - Deploy da API em Lightsail baixo custo

## Visao geral

Esta spec substitui a trilha oficial de API em Lambda + API Gateway para o primeiro beta real do Emprely.

A decisao atual e:

- web app React/Vite em S3 + CloudFront, no dominio `app.emprely.com.br`;
- API ASP.NET Core em AWS Lightsail Linux US$7/mes, no dominio `api.emprely.com.br`;
- runtime da API via Docker Compose;
- HTTPS da API via Caddy com certificado automatico;
- banco PostgreSQL em Neon Free;
- arquivos/logos persistentes em S3;
- assets/logos servidos por CloudFront em `https://dz3i7ivpc873w.cloudfront.net` no beta inicial;
- email Zoho para a caixa `contato@emprely.com.br`;
- Lambda mantido apenas como alternativa futura.

O objetivo e evitar cold start e reduzir complexidade operacional no beta, mantendo custo fixo baixo.

## Escopo

Inclui:

- Ajustar API para rodar corretamente atras de Caddy no Lightsail.
- Criar kit de deploy Lightsail com Docker Compose, Caddyfile e env example.
- Criar scripts para build local da imagem, envio via SSH e validacao do env.
- Usar `/opt/emprely/orcamentos` como diretorio remoto da aplicacao, preservando espaco para futuros produtos em `/opt/emprely`.
- Atualizar docs que ainda apontam Lambda como caminho oficial.
- Manter web em S3 + CloudFront usando `VITE_API_BASE_URL=https://api.emprely.com.br`.

Fora do escopo:

- Criar recursos reais na AWS.
- Criar projeto Neon real.
- Configurar DNS real no Route 53.
- Criar bucket S3 real.
- Implementar provedor transacional real.
- Criar CI/CD completo.
- Remover o suporte Lambda do codigo.

## Fluxo ponta a ponta

1. Finalizar email Zoho no DNS.
2. Atualizar specs/docs para Lightsail.
3. Rodar validacao local do MVP.
4. Criar Neon Free e aplicar migrations.
5. Buildar a imagem da API localmente.
6. Enviar a imagem para o Lightsail via SSH/SCP.
7. Carregar a imagem no servidor.
8. Subir `api` + `caddy` com Docker Compose.
9. Apontar `api.emprely.com.br` para o IP estatico do Lightsail.
10. Validar `https://api.emprely.com.br/health/live` e `/health/ready`.
11. Buildar web com `VITE_API_BASE_URL=https://api.emprely.com.br`.
12. Publicar `apps/web/dist` em S3 + CloudFront.
13. Rodar aceite manual do beta.

## Requisitos

- R01: A API deve continuar rodando localmente sem Lambda.
- R02: O suporte Lambda deve ser condicionado a ambiente Lambda e nao afetar Lightsail.
- R03: A API deve aceitar headers de proxy para operar atras do Caddy.
- R04: Caddy deve expor `api.emprely.com.br` em HTTPS e encaminhar para `api:8080`.
- R05: A imagem Docker da API deve ser buildada localmente.
- R06: O Compose Lightsail deve depender de env sem secrets versionados.
- R07: O banco beta deve ser Neon Free e receber migrations EF Core.
- R08: `LogoPerfilStorage__Provider=S3` deve ser o provider recomendado para o beta.
- R09: `EmailTransacional__Provider=Fake` so pode ser usado para smoke tecnico.
- R10: O web deve ser buildado com `VITE_API_BASE_URL=https://api.emprely.com.br`.
- R11: AWS Budgets/alertas devem existir antes de beta real com usuarios.
- R12: `ALLOWED_HOSTS` deve aceitar `api.emprely.com.br`, `localhost` e `127.0.0.1`, para permitir o healthcheck interno do Docker sem relaxar para wildcard.
- R13: O deploy remoto deve usar `sudo docker`, pois o usuario `ubuntu` da Lightsail pode nao estar no grupo `docker`.

## Regras de negocio

- O beta deve priorizar custo controlado e baixa complexidade.
- Cold start nao e aceito como experiencia inicial da API neste momento.
- Plano Fundador continua manual antes de checkout recorrente.
- Mobile continua depois da estabilizacao web/API.
- Nao migrar para RDS/ECS/Fargate/ALB antes de receita ou necessidade tecnica real.

## Impactos por projeto

- API:
  - condicionar Lambda hosting;
  - configurar forwarded headers;
  - usar variaveis de ambiente para Neon, CORS, JWT, admin, S3 e email;
  - manter health checks publicos.

- Web:
  - sem mudanca funcional;
  - build estatico para S3 + CloudFront com base URL da API.

- Mobile:
  - sem implementacao nesta etapa.

- Landing:
  - continua fora do monorepo;
  - depois do deploy web, CTA pode apontar para `https://app.emprely.com.br/suporte`.

- Infra:
  - adicionar `infra/lightsail`;
  - manter `infra/docker` como base de imagem/smoke local;
  - adicionar scripts de build/deploy/validacao.

## Criterios de aceite

- CA01: API compila e testes passam.
- CA02: `AddAWSLambdaHosting` nao roda no caminho Lightsail.
- CA03: `UseForwardedHeaders` roda antes de `UseHttpsRedirection`.
- CA04: `infra/lightsail/docker-compose.api.yml` valida com env example.
- CA05: `infra/lightsail/Caddyfile` roteia `api.emprely.com.br` para a API.
- CA06: Scripts documentam build local e deploy via SSH.
- CA07: Docs principais deixam Lightsail como caminho oficial e Lambda como alternativa futura.
- CA08: Nenhum secret real e adicionado ao repositorio.
- CA09: API publica responde `https://api.emprely.com.br/health/live` com HTTP 200.
- CA10: HTTP em `api.emprely.com.br` redireciona para HTTPS.

## Estrategia de implementacao

1. Criar analise SDD e esta spec.
2. Ajustar `Program.cs` para Lambda condicional e proxy headers.
3. Criar `infra/lightsail`.
4. Criar scripts PowerShell de build/deploy/validacao.
5. Atualizar README, runbook beta, mapa de dominios e checklist.
6. Rodar build/test/config.
7. Atualizar Notion e Obsidian com o novo status.

## Testes

- `dotnet build apps/api/Emprely.sln --no-restore`
- `dotnet test apps/api/Emprely.sln --no-restore`
- `pnpm --dir apps/web build`
- `docker build -f infra/docker/Dockerfile.api -t emprely-api:lightsail .`
- `docker compose -f infra/lightsail/docker-compose.api.yml --env-file infra/lightsail/lightsail.env.example config`
- `powershell -ExecutionPolicy Bypass -File scripts/validate-lightsail-env.ps1 -EnvPath infra/lightsail/lightsail.env.example -AllowPlaceholders`
