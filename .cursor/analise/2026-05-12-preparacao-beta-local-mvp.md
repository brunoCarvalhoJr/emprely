# Analise - Preparacao beta local do MVP

## Contexto

O MVP ja possui fluxos principais, testes de API e E2E leve do web. Ainda falta consolidar um caminho operacional para preparar, validar e subir o produto em ambiente local/beta sem depender de conhecimento espalhado.

## Objetivo

Criar um runbook de beta local e scripts oficiais de validacao para garantir que o MVP possa ser testado de ponta a ponta antes do polimento visual final.

## Escopo

- Atualizar scripts do monorepo para validar API, web, E2E e Docker Compose.
- Documentar pre-requisitos, variaveis, banco local, migrations, subida da API e web.
- Documentar checklist de aceite beta.
- Atualizar READMEs que ficaram defasados.

## Fora do escopo

- Deploy em cloud.
- CI/CD real.
- Billing real.
- Prints, imagens ou polimento de layout.
- Secrets de producao.

## Riscos

- Documentar comando destrutivo de reset de banco sem aviso claro.
- README divergir dos scripts reais.
- Validacao beta esquecer E2E web.

## Decisao

Centralizar o checklist em `docs/product/beta-mvp-runbook.md` e expor `pnpm validate:beta` como comando oficial de verificacao local.
