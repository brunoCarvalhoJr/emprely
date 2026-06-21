# Emprely Landing

Esta pasta e a ponte operacional do monorepo para a landing atual do Emprely Orcamentos.

## Projeto real

```txt
D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp
```

O projeto real continua fora deste monorepo porque possui Git proprio, `package-lock.json`, `node_modules`, `.next` e `out`. Trazer a landing inteira para `apps/landing` deve ser tratado em uma spec separada de migracao fisica.

## Dominios publicados

- `https://www.emprely.com.br`
- `https://emprely.com.br`

## Contato oficial

- WhatsApp comercial/suporte: `+55 (35) 99738-9755` (`https://wa.me/5535997389755`)
- E-mail: `contato@emprely.com.br`

## Comandos pelo workspace

Na raiz do monorepo:

```powershell
pnpm landing:dev
pnpm landing:check
pnpm landing:build
pnpm landing:deploy:prod
```

Esses comandos chamam `npm.cmd --prefix D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp ...`, preservando o gerenciador da landing externa.

## Deploy

O deploy de producao da landing usa o script do projeto externo:

```powershell
npm run deploy:prod
```

Esse script faz build estatico e publica em:

```txt
Bucket S3: emprely-landing-production
CloudFront distribution: E1NWXIL7S19BU1
```

## Manutencao

Antes de alterar copy, visual, SEO, analytics, formulario ou arquitetura da landing:

1. Ler `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\AGENTS.md`.
2. Ler o PRD local da landing em `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\docs\prd-landing-page.md`.
3. Criar analise e spec no projeto da landing.
4. Rodar `pnpm landing:check` antes de deploy.

Manual operacional central:

```txt
docs/operations/manutencao-projetos-emprely.md
```
