# Analise - Deploy da API em Lightsail baixo custo

## Contexto

Em 2026-06-14 a decisao de infraestrutura do beta foi revista. A API deixa de ter Lambda + API Gateway como caminho oficial inicial e passa a usar AWS Lightsail Linux US$7/mes.

A arquitetura decidida e:

- web app React/Vite em S3 + CloudFront;
- API ASP.NET Core em Lightsail Linux US$7/mes;
- runtime da API via Docker Compose;
- HTTPS da API via Caddy com certificado automatico;
- banco PostgreSQL em Neon Free;
- arquivos/logos persistentes em S3;
- assets/logos expostos inicialmente pelo dominio padrao do CloudFront;
- email Zoho para a caixa `contato@emprely.com.br`;
- email transacional real ainda pendente de decisao futura.

O motivo da mudanca e reduzir complexidade operacional e evitar cold start da Lambda no beta, mantendo custo fixo baixo.

## Estado atual do repositorio

- A API ja possui `infra/docker/Dockerfile.api` e consegue rodar como aplicacao ASP.NET Core comum em container.
- A API tambem possui `AddAWSLambdaHosting`, mas isso deve ficar como alternativa futura, nao como caminho oficial.
- A API ja tem health checks em `/health`, `/health/live` e `/health/ready`.
- O web ja exige `VITE_API_BASE_URL` fora de desenvolvimento e e compativel com S3 + CloudFront.
- O upload de logo ja tem providers `Local`, `S3` e `Disabled`.
- Data Protection keys ja persistem no Postgres/Neon via `data_protection_keys`.
- Muitos docs ainda citam Lambda/API Gateway como trilha oficial e precisam ser atualizados.

## Fluxo proposto

1. Criar banco Neon Free e aplicar migrations.
2. Buildar localmente a imagem Docker da API, para nao compilar dentro do Lightsail US$7.
3. Enviar a imagem para o servidor via SSH/SCP.
4. No Lightsail, carregar a imagem com Docker.
5. Subir `api` + `caddy` com Docker Compose.
6. Caddy expõe `api.emprely.com.br` em HTTPS e encaminha para `api:8080`.
7. Web e landing continuam fora do Lightsail.

## Impactos tecnicos

- API:
  - condicionar Lambda hosting para executar apenas em Lambda;
  - aceitar headers de proxy (`X-Forwarded-For` e `X-Forwarded-Proto`) para funcionar atras do Caddy;
  - manter CORS restrito a `https://app.emprely.com.br`;
  - usar S3 para logo no beta.

- Web:
  - sem mudanca funcional;
  - build de producao usa `VITE_API_BASE_URL=https://api.emprely.com.br`.

- Infra:
  - criar `infra/lightsail` com Compose, Caddyfile, env example e runbook;
  - criar scripts de build local, deploy via SSH e validacao de env.

## Riscos

- Lightsail US$7 tem pouca memoria; build da imagem no servidor pode falhar, por isso o build deve ser local.
- Se Caddy nao enviar headers ou API nao confiar neles, pode haver loop/redirect incorreto de HTTPS.
- Se variaveis de S3 estiverem ausentes, upload de logo falha no beta.
- Se `EmailTransacional__Provider=Fake` for usado com usuarios reais, confirmacao/reset nao enviara email real.
- Se migrations nao forem aplicadas no Neon, a API nao estara pronta para beta.
- Se `AllowedHosts` nao incluir `localhost` e `127.0.0.1`, o healthcheck interno do Docker recebe HTTP 400 mesmo com a API rodando.
- Se o deploy remoto usar `docker` sem `sudo`, o usuario `ubuntu` pode falhar ao acessar `/var/run/docker.sock`.

## Duvidas resolvidas

- Runtime no Lightsail: Docker Compose.
- HTTPS: Caddy automatico.
- Lambda no codigo: manter como alternativa futura, mas condicionar/desativar no caminho oficial.
- Deploy da imagem: build local + envio para Lightsail.
- Diretorio remoto: `/opt/emprely/orcamentos`, deixando `/opt/emprely` disponivel para futuros produtos.
- Validacao real em 2026-06-15: API e Caddy subiram na Lightsail, `https://api.emprely.com.br/health/live` respondeu HTTP 200 e HTTP redirecionou para HTTPS.
