# Analise - Alinhamento Notion dominios AWS

## Contexto

Antes de definir os dominios do beta/staging do SaaS, foi revisada a documentacao do Notion e a documentacao local do projeto. O usuario informou que a landing ja foi comprada/hospedada na AWS no dominio `www.emprely.com.br`.

Fontes revisadas no Notion:

- `Emprely | Central Refatorada do SaaS`
- `18. Arquitetura geral Emprely`
- `16. Design e publicacao da landing`
- `17. Backlog tecnico do MVP`
- `18. Desenvolvimento do nucleo funcional`
- `Decisao de Marca - Emprely`

Fontes locais revisadas:

- `docs/architecture/landing-referenciada.md`
- `docs/architecture/monorepo.md`
- `docs/adr/001-stack-oficial-mvp.md`
- `docs/product/beta-staging-deploy.md`
- `docs/product/checklist-final-beta-mvp.md`
- `apps/api/README.md`
- `apps/web/README.md`
- `apps/landing/README.md`

## Objetivo

Consolidar os dominios e ambientes recomendados antes de configurar beta/staging real:

- landing institucional em `www.emprely.com.br`;
- SaaS web em `app.emprely.com.br`;
- API em `api.emprely.com.br`.

## Projetos impactados

- API: CORS e exemplos de endpoint administrativo.
- Web: `VITE_API_BASE_URL` de beta/staging.
- Mobile: sem impacto.
- Landing: documentacao de dominio ja publicado.
- Packages: sem impacto.
- Infra: `beta.env.example`, scripts de env e documentacao de deploy.
- Docs: mapa de dominios e atualizacao dos placeholders.

## Fluxo atual

Os docs locais ainda usam placeholders como `api-beta.seu-dominio.com` e `app-beta.seu-dominio.com`. O Notion ja registra:

- dominio canônico recomendado da marca: `www.emprely.com.br`;
- aplicacao recomendada: `app.emprely.com.br`;
- landing publicada na AWS com S3 privado, CloudFront, Route 53 e ACM;
- registros DNS A e AAAA para `emprely.com.br` e `www.emprely.com.br`.

Validacao externa feita nesta rodada:

- `https://www.emprely.com.br/` responde 200.
- `https://emprely.com.br/` responde 200.
- ambos resolvem para enderecos CloudFront.

## Fluxo proposto

1. Registrar mapa de dominios em `docs/architecture/dominios-ambientes.md`.
2. Atualizar exemplos de staging para `https://api.emprely.com.br` e `https://app.emprely.com.br`.
3. Manter `www.emprely.com.br` como landing canonica.
4. Criar script para aplicar dominios no `infra/docker/beta.env` privado sem exibir secrets.
5. Validar env privado em modo publico.

## Regras de negocio

- Landing V1 permanece publicada e separada do monorepo.
- Landing V2 so deve ser refinada com prints reais do sistema.
- O SaaS web nao deve usar `www.emprely.com.br`; este dominio e da landing.
- API deve ficar separada do SaaS web.
- Secrets continuam fora do repositorio e fora do chat.

## Impactos tecnicos

- `Cors__OrigensPermitidas__0` deve apontar para `https://app.emprely.com.br`.
- `VITE_API_BASE_URL` deve apontar para `https://api.emprely.com.br`.
- O web precisa ser rebuildado quando `API_PUBLIC_URL` mudar.
- Route 53 ainda precisa criar ou confirmar os registros de `app` e `api` quando o ambiente real existir.

## Riscos

- `app.emprely.com.br` e `api.emprely.com.br` podem ainda nao existir no DNS.
- A escolha de infraestrutura final para web/API ainda precisa ser confirmada: App Runner/RDS/CloudFront/Amplify ou outro arranjo AWS equivalente.
- O compose beta e uma base operacional, nao a arquitetura cloud definitiva.

## Duvidas

- O Notion recomenda AWS App Runner para API inicial, mas o ambiente real ainda nao foi provisionado.
- O Notion nao explicita `api.emprely.com.br`, entao esta e uma inferencia tecnica alinhada ao padrao `app.emprely.com.br` e a separacao web/API.
