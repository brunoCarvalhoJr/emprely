# Spec - Preparacao deploy beta staging

## Visao geral

Adicionar artefatos de infraestrutura para executar o MVP em um ambiente beta/staging simples e reproduzivel, sem incluir secrets reais e sem depender de um provedor cloud especifico.

## Escopo

Inclui:

- Dockerfile para API.
- Dockerfile para web.
- Nginx para servir SPA React/Vite.
- Compose beta/staging de exemplo com API, web e PostgreSQL.
- Arquivo de exemplo para variaveis de ambiente.
- Guia de deploy beta/staging.
- Scripts de validacao de deploy e MVP.
- Script de smoke runtime local do beta/staging.

Fora do escopo:

- Provisionamento Terraform real.
- CI/CD de provedor especifico.
- TLS/certificado automatizado.
- Billing/checkout real.
- Ajustes visuais, prints e imagens.

## Fluxo ponta a ponta

1. Pessoa responsavel define URLs, portas e secrets reais fora do repositorio.
2. Valida o compose com `pnpm validate:deploy`.
3. Faz build das imagens de API e web.
4. Sobe PostgreSQL, API e web.
5. Aplica migrations no banco beta/staging.
6. Valida `/health/live`, `/health/ready` e o fluxo manual do MVP.

## Requisitos

- API deve expor porta interna `8080`.
- Web deve expor porta interna `8080`.
- Web deve receber `VITE_API_BASE_URL` em build time.
- Compose deve possuir healthchecks basicos.
- Secrets reais devem ficar em arquivo ignorado pelo Git ou no provedor.
- `pnpm validate:mvp` deve incluir validacao do compose beta/staging.

## Regras de negocio

- O deploy nao altera o MVP funcional.
- Ativacao de Plano Fundador segue administrativa.
- Trial, WhatsApp, PDF/impressao e status de proposta seguem as regras ja implementadas.

## Impactos por projeto

- API: empacotamento e variaveis de runtime.
- Web: empacotamento estatico e variavel de build.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: manifests do workspace usados no Dockerfile web.
- Infra: novos arquivos Docker.

## Criterios de aceite

- `infra/docker/Dockerfile.api` existe.
- `infra/docker/Dockerfile.web` existe.
- `infra/docker/nginx.web.conf` existe.
- `infra/docker/docker-compose.beta.example.yml` existe.
- `infra/docker/beta.env.example` existe e nao contem secret real.
- `docs/product/beta-staging-deploy.md` existe.
- `pnpm validate:deploy` passa.
- `pnpm validate:deploy:runtime` passa com Docker ativo.
- `pnpm validate:mvp` passa.
- Portas locais do MVP ficam sem listeners depois da validacao.

## Estrategia de implementacao

- Usar Docker multi-stage para API e web.
- Manter compose beta separado do compose local.
- Usar placeholders seguros em env example.
- Documentar aplicacao de migrations como etapa explicita.

## Testes

- `pnpm validate:deploy`
- `pnpm validate:mvp`
- Conferencia de portas `5173`, `5262`, `7099`, `8080` e `8081`.
