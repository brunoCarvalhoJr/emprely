# Analise - Documentacao operacional e manutencao

## Contexto

O usuario pediu uma documentacao para deploy, configuracao, dados e manutencao dos projetos Emprely. A intencao e facilitar pedidos futuros de deploy/manutencao e incluir a Landing Page Emprely no fluxo deste workspace.

Fontes consultadas:

- `README.md`
- `apps/api/README.md`
- `apps/web/README.md`
- `apps/landing/AGENTS.md`
- `docs/product/beta-mvp-runbook.md`
- `docs/product/beta-staging-deploy.md`
- `docs/product/checklist-final-beta-mvp.md`
- `docs/architecture/dominios-ambientes.md`
- `infra/lightsail/README.md`
- `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\README.md`
- `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\package.json`
- `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp\next.config.ts`

## Objetivo

Criar uma referencia operacional unica para manter API, webapp SaaS, landing, banco, infraestrutura, secrets e rotinas de validacao/deploy.

## Projetos impactados

- API: documentar deploy, env, migrations, banco, health checks e operacoes.
- Web: documentar build, env, S3/CloudFront e validacao.
- Mobile: documentar como placeholder sem deploy.
- Landing: incluir a landing externa como projeto operacional acessivel pelo workspace.
- Packages: documentar papel atual dos pacotes compartilhados.
- Infra: documentar Lightsail, Caddy, S3, CloudFront, SES, Zoho, Neon e Docker.

## Fluxo atual

As informacoes existem, mas estao distribuidas entre README raiz, READMEs dos apps, runbooks de produto e documentos da landing externa. A landing ainda aparece no monorepo como placeholder em `apps/landing`, apontando para `D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp`.

## Fluxo proposto

Criar `docs/operations/manutencao-projetos-emprely.md` como manual central. Atualizar o README da raiz e o README/scripts de `apps/landing` para que a landing externa seja um projeto operacional do workspace sem importar fisicamente os artefatos pesados da landing.

## Sincronizacao externa 2026-06-17

O usuario pediu que as documentacoes criadas tambem fossem atualizadas no Notion e no Obsidian. A sincronizacao deve criar ou atualizar uma pagina operacional dedicada no Notion, criar uma nota espelhada no Obsidian e manter o rastreador de proximos passos apontando para essas referencias. A informacao sincronizada deve refletir o estado validado em 2026-06-17: API, webapp e landing respondendo HTTP 200 nos dominios publicos, com proximo passo focado em publicar a nova imagem da API com templates de email revisados e validar os fluxos reais.

## Regras de negocio

- Nao gravar secrets no repositorio.
- Manter a landing V1 externa ao monorepo enquanto nao houver decisao de migracao fisica do codigo.
- Registrar banco remoto por local seguro da connection string, sem expor credenciais.
- Preservar deploy beta baixo custo: web em S3/CloudFront, API em Lightsail, banco Neon, arquivos em S3/CloudFront, SES para transacional e Zoho para caixa manual.

## Impactos tecnicos

- Novo manual em `docs/operations`.
- Novos scripts de conveniencia para a landing externa.
- Atualizacao de documentacao existente para apontar o manual.

## Riscos

- Copiar a landing inteira para `apps/landing` traria `.git`, `node_modules`, `.next`, `out` e outro lockfile para dentro do monorepo. Por isso, a inclusao nesta rodada sera operacional/documental, nao fisica.
- Os dados remotos dependem de secrets fora do repo; o manual deve ensinar onde procurar e como validar, sem registrar valores reais.
- A landing externa usa npm/package-lock, enquanto o monorepo usa pnpm.

## Duvidas

- Se no futuro o usuario quiser migrar fisicamente a landing para `apps/landing`, sera preciso uma spec propria para decidir copia limpa, historico Git, lockfile, scripts e remocao dos artefatos gerados.
