# Spec - Secrets beta env

## Visao geral

Adicionar automacao para gerar e validar `infra/docker/beta.env`, reduzindo erro operacional antes de subir beta/staging.

## Escopo

Inclui:

- Script de geracao de env privado.
- Script de validacao de env privado.
- Comandos `pnpm beta:env:new` e `pnpm beta:env:validate`.
- Documentacao no guia beta/staging.
- Geracao local do arquivo privado ignorado pelo Git.

Fora do escopo:

- Provisionar secrets em provedor cloud.
- Criar CI/CD com secrets remotos.
- Escolher dominio definitivo.
- Configurar TLS.

## Fluxo ponta a ponta

1. Executar `pnpm beta:env:new`.
2. O script cria `infra/docker/beta.env` com secrets fortes.
3. Executar `pnpm beta:env:validate`.
4. Ajustar `API_PUBLIC_URL` e `WEB_PUBLIC_URL` quando houver dominio real.
5. Rodar `pnpm validate:deploy:runtime` ou comandos de deploy com `--env-file infra/docker/beta.env`.

## Requisitos

- O arquivo gerado nao deve ser versionado.
- O script de geracao nao deve sobrescrever sem `-Force`.
- A validacao deve falhar se encontrar placeholders.
- A validacao deve exigir chaves com pelo menos 32 caracteres.
- A documentacao deve explicar como gerar env local e como passar URLs reais.

## Regras de negocio

- O deploy beta nao altera regras de trial, Plano Fundador, proposta, WhatsApp ou PDF.
- Ativacao do Plano Fundador continua administrativa.

## Impactos por projeto

- API: nenhum codigo funcional.
- Web: nenhum codigo funcional.
- Mobile: nenhum.
- Landing: nenhum.
- Packages: nenhum.
- Infra: scripts e docs.

## Criterios de aceite

- `scripts/new-beta-env.ps1` existe.
- `scripts/validate-beta-env.ps1` existe.
- `pnpm beta:env:new` gera `infra/docker/beta.env`.
- `pnpm beta:env:validate` passa com o arquivo gerado.
- `infra/docker/beta.env` e ignorado pelo Git.
- `pnpm validate:mvp` continua passando.

## Estrategia de implementacao

- Usar `RandomNumberGenerator` do .NET/PowerShell para secrets.
- Validar arquivo por pares `KEY=VALUE`.
- Manter placeholders apenas no `.example`.

## Testes

- `pnpm beta:env:new`
- `pnpm beta:env:validate`
- `git check-ignore -v infra/docker/beta.env`
- `pnpm validate:deploy`
- `pnpm validate:mvp`
