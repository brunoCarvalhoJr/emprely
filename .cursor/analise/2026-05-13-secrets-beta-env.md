# Analise - Secrets beta env

## Contexto

O kit Docker beta/staging ja esta versionado e validado em build/runtime. A proxima pendencia pratica e criar um caminho seguro para gerar o arquivo privado `infra/docker/beta.env`, sem colocar secrets reais no repositorio e sem depender de copiar placeholders manualmente.

## Objetivo

Automatizar a geracao e validacao do arquivo privado de ambiente beta/staging, garantindo que senhas e chaves fortes sejam criadas localmente e que placeholders nao sejam usados por engano em beta real.

## Projetos impactados

- API: consome JWT, connection string, CORS, admin key e rate limit pelo compose.
- Web: consome URL publica da API em build time pelo compose.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: scripts de geracao/validacao de env e documentacao.
- Docs: guia de deploy e checklist.

## Fluxo atual

Existe `infra/docker/beta.env.example` com placeholders. O arquivo real `infra/docker/beta.env` deve ficar fora do Git, mas ainda precisa ser criado manualmente.

## Fluxo proposto

1. Criar `scripts/new-beta-env.ps1`.
2. Criar `scripts/validate-beta-env.ps1`.
3. Adicionar scripts npm/pnpm de conveniencia.
4. Atualizar documentacao de deploy.
5. Gerar um `infra/docker/beta.env` local ignorado pelo Git para uso da maquina atual.
6. Validar que o arquivo gerado nao contem placeholders.

## Regras de negocio

- Secrets reais nunca entram no Git.
- URLs e portas podem ser ajustadas por parametro.
- O script nao sobrescreve `beta.env` existente sem `-Force`.
- O web precisa ser rebuildado se `API_PUBLIC_URL` mudar.

## Impactos tecnicos

- `POSTGRES_PASSWORD`, `JWT_SIGNING_KEY` e `ADMIN_OPERACOES_KEY` sao gerados com aleatoriedade criptografica.
- `validate-beta-env.ps1` bloqueia placeholders, campos ausentes e chaves curtas.
- `infra/docker/beta.env` permanece ignorado por `.gitignore`.

## Riscos

- Se a pessoa trocar a URL publica da API depois de buildar o web, precisa rebuildar a imagem.
- O arquivo privado local deve ser protegido pela maquina/servidor onde for criado.

## Duvidas

- Dominio e provedor ainda nao estao definidos. Assumido: gerar env local com URLs localhost, permitindo sobrescrever via parametros.
