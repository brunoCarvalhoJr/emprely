# Analise - Deploy serverless MVP baixo custo

## Contexto

Em 2026-06-13 foi decidido no Notion e no Obsidian que o primeiro deploy real do SaaS Emprely deve priorizar custo baixo e pagamento por uso:

- web app React/Vite em S3 + CloudFront;
- API ASP.NET Core em AWS Lambda + API Gateway;
- banco PostgreSQL em Neon Free;
- landing atual mantida em S3 + CloudFront;
- evitar RDS, ECS/Fargate, App Runner e ALB enquanto nao houver validacao de clientes pagantes.

O repositorio ainda mantinha documentos apontando para Docker Compose, App Runner e RDS como caminho principal do beta/staging. Isso gera risco de seguir a infra antiga por engano.

## Objetivo

Alinhar a documentacao do repositorio com a decisao atual de infraestrutura barata/serverless e criar uma spec SDD para guiar a implementacao futura do deploy real.

## Projetos impactados

- API: precisara ser adaptada para Lambda e variaveis de ambiente reais.
- Web: sera publicado como artefato estatico em S3 + CloudFront.
- Mobile: sem impacto imediato.
- Landing: permanece fora do monorepo; podera ganhar formulario/CTA depois.
- Packages: sem impacto imediato.
- Infra: nova trilha oficial passa a ser Lambda + API Gateway + S3 + CloudFront + Neon Free.

## Fluxo atual

- `README.md` aponta `docs/product/beta-staging-deploy.md` como guia para Docker Compose.
- `docs/architecture/dominios-ambientes.md` recomenda App Runner para API e RDS PostgreSQL para banco.
- `docs/product/beta-staging-deploy.md` descreve Docker Compose como caminho principal de beta/staging.
- `infra/docker` continua util para validacao local e fallback, mas nao representa mais a decisao atual de custo minimo.

## Fluxo proposto

1. Manter Docker Compose como ferramenta local/legado.
2. Documentar serverless como caminho oficial do beta real.
3. Criar spec SDD com escopo, requisitos, riscos, ordem de implementacao e criterios de aceite.
4. Atualizar README e mapa de dominios para apontar para a spec e para o runbook serverless.
5. Registrar pendencias tecnicas antes do deploy: Lambda adapter, Neon, Data Protection keys, S3 para uploads, DNS/TLS e alertas de custo.

## Regras de negocio

- O deploy inicial deve minimizar custo fixo antes de validar clientes pagantes.
- Nao criar microservicos no MVP.
- Nao mover a landing para `apps/landing` sem decisao explicita.
- Nao colocar secrets no repositorio.
- Manter `app.emprely.com.br` e `api.emprely.com.br` como dominios estaveis.

## Impactos tecnicos

- A API precisa continuar portavel como ASP.NET Core normal, com adaptador para Lambda.
- Uploads e arquivos persistentes nao podem depender do disco local da API.
- Tokens de confirmacao/reset precisam sobreviver a restart/deploy por meio de persistencia de Data Protection keys.
- O banco Neon deve receber as migrations versionadas do EF Core.
- O web deve ser buildado com `VITE_API_BASE_URL=https://api.emprely.com.br`.
- CORS deve permitir `https://app.emprely.com.br`.

## Riscos

- Cold start da Lambda e wake-up do Neon Free podem causar atraso no primeiro acesso apos inatividade.
- API atual ainda salva logomarca em disco local, incompatibilizando deploy serverless sem ajuste.
- Documentos antigos podem continuar confundindo Docker/App Runner/RDS com caminho oficial se nao forem atualizados.
- Se Data Protection keys nao forem persistidas, links de confirmacao e recuperacao podem invalidar depois de deploy.
- Se os custos AWS nao tiverem budgets/alertas, pode haver surpresa de cobranca.

## Duvidas

- Nenhuma duvida bloqueante para alinhar a documentacao.
- Antes da implementacao da infra, ainda decidir o mecanismo exato de IaC/deploy: manual guiado, AWS SAM, Terraform ou outro.
- Antes do beta real, decidir se email transacional usara SES, Zoho SMTP/API ou outro provedor, mantendo a caixa `contato@emprely.com.br` no Zoho.
