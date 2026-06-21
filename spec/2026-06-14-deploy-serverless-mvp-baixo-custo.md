# Spec - Deploy serverless MVP baixo custo

> Status: substituida em 2026-06-14 por `spec/2026-06-14-deploy-lightsail-api-baixo-custo.md`.
> Esta spec fica como historico da decisao anterior de Lambda + API Gateway, mas nao e mais o caminho oficial do beta inicial.

## Visao geral

Esta spec registrou a trilha serverless avaliada para o primeiro deploy real do Emprely Orcamentos com custo minimo antes de validar clientes pagantes.

A decisao anterior era:

- web app React/Vite em AWS S3 + CloudFront, no dominio `app.emprely.com.br`;
- API ASP.NET Core em AWS Lambda + API Gateway, no dominio `api.emprely.com.br`;
- banco PostgreSQL em Neon Free;
- landing atual mantida em S3 + CloudFront;
- evitar RDS, ECS/Fargate, App Runner e ALB no inicio.

O objetivo e abrir beta real gastando o minimo possivel, mantendo caminho simples de migracao para infra mais robusta quando houver receita ou necessidade tecnica.

Atualizacao em 2026-06-14: a preparacao de codigo da API para Lambda e upload de logo S3/Disabled foi detalhada e implementada em `spec/2026-06-14-api-lambda-upload-logo-s3.md`.

Atualizacao em 2026-06-14: o formulario publico de suporte/interesse foi implementado em `spec/2026-06-14-formulario-publico-suporte-leads.md`, com tela `/suporte` e endpoint `POST /api/support/public`.

Atualizacao em 2026-06-14: a persistencia de Data Protection keys foi implementada em `spec/2026-06-14-data-protection-keys-postgres.md`, usando a tabela `data_protection_keys` no Postgres/Neon.

## Escopo

Inclui:

- Documentar arquitetura oficial do beta real.
- Definir ordem de implementacao para web, API, banco, DNS, TLS e alertas.
- Definir variaveis de ambiente e guardrails tecnicos.
- Substituir orientacoes antigas de App Runner/RDS/Docker como caminho principal.
- Manter Docker Compose apenas como validacao local, fallback ou legado.

Fora do escopo:

- Criar recursos reais na AWS.
- Criar projeto Neon real.
- Implementar adaptador Lambda no codigo.
- Migrar upload de logo para S3.
- Configurar SES/Zoho transacional.
- Criar checkout/pagamento recorrente.
- Criar app mobile.

## Fluxo ponta a ponta

1. Finalizar validacao do email Zoho no DNS.
2. Rodar validacao local completa do MVP.
3. Criar projeto Neon Free PostgreSQL.
4. Configurar `ConnectionStrings__EmprelyDb` com a connection string do Neon.
5. Aplicar migrations EF Core no banco Neon.
6. Adaptar API ASP.NET Core para rodar em AWS Lambda com API Gateway.
7. Configurar variaveis da API em ambiente seguro.
8. Confirmar que a migration `DataProtectionKeysPostgres` criou `data_protection_keys`.
9. Remover dependencia de disco local da API para arquivos persistentes; usar S3 para uploads quando necessario.
10. Publicar API em Lambda + API Gateway.
11. Configurar dominio `api.emprely.com.br` com TLS.
12. Buildar web com `VITE_API_BASE_URL=https://api.emprely.com.br`.
13. Publicar `dist` do web em S3 privado com CloudFront.
14. Configurar dominio `app.emprely.com.br` com TLS.
15. Configurar CORS da API para `https://app.emprely.com.br`.
16. Criar AWS Budgets/alertas de custo.
17. Rodar aceite manual do beta com dados reais de teste.
18. Liberar beta assistido para poucos usuarios.

## Requisitos

- R01: Historicamente, o caminho avaliado era S3 + CloudFront, Lambda + API Gateway e Neon Free.
- R02: A landing V1 continua em `www.emprely.com.br` e fora deste monorepo.
- R03: O SaaS web deve usar `app.emprely.com.br`.
- R04: A API deve usar `api.emprely.com.br`.
- R05: A API deve ser configurada por variaveis de ambiente, sem secrets versionados.
- R06: O web deve ser buildado com `VITE_API_BASE_URL=https://api.emprely.com.br`.
- R07: A API deve permitir CORS para `https://app.emprely.com.br`.
- R08: O banco real inicial deve ser Neon Free PostgreSQL.
- R09: Migrations EF Core devem ser aplicadas no Neon antes de liberar usuarios.
- R10: Links de confirmacao, recuperacao e alteracao de email devem continuar validos apos restart/deploy.
- R11: Arquivos persistentes da API nao devem depender de disco local em Lambda.
- R12: Logs operacionais devem ir para CloudWatch ou mecanismo equivalente do runtime.
- R13: Custos AWS devem ter budgets/alertas antes do beta real.
- R14: Docker Compose nao deve ser tratado como caminho principal do beta real.

## Regras de negocio

- O MVP deve priorizar custo baixo ate haver receita ou uso real que justifique infra fixa.
- Uma lentidao eventual no primeiro acesso apos inatividade e aceitavel no beta, desde que o app continue funcional.
- O Plano Fundador continua sendo venda/ativacao manual antes de checkout completo.
- Mobile fica depois de web/API/banco estabilizados.
- Billing completo fica depois da validacao do beta e do Plano Fundador manual.

## Impactos por projeto

- API:
  - adicionar adaptacao para Lambda;
  - revisar `UseHttpsRedirection` atras de API Gateway;
  - confirmar `data_protection_keys` aplicada no Neon;
  - trocar storage local de uploads por S3 ou desativar upload no beta;
  - configurar `ConnectionStrings__EmprelyDb`, JWT, CORS, admin key, rate limit e email.

- Web:
  - build estatico para S3/CloudFront;
  - usar `VITE_API_BASE_URL=https://api.emprely.com.br`;
  - validar rotas SPA com fallback;
  - validar fluxo principal em desktop e ao menos um smoke mobile.

- Mobile:
  - sem implementacao nesta etapa;
  - manter como placeholder ate estabilizar beta web.

- Landing:
  - manter projeto atual fora do monorepo;
  - linkar CTA de contato/interesse para `https://app.emprely.com.br/suporte` depois do deploy do webapp.

- Packages:
  - sem impacto imediato.

- Infra:
  - criar runbook/IaC para S3, CloudFront, Lambda, API Gateway, Route 53, ACM, budgets e secrets;
  - manter `infra/docker` como legado/local.

## Criterios de aceite

- CA01: Historicamente, `README.md` apontava serverless como caminho do beta real.
- CA02: `docs/architecture/dominios-ambientes.md` nao recomenda mais App Runner/RDS como caminho inicial.
- CA03: Historicamente, `docs/product/beta-staging-deploy.md` descrevia S3 + CloudFront, Lambda + API Gateway e Neon Free como caminho.
- CA04: A spec SDD existe em `spec/`.
- CA05: A analise SDD existe em `.cursor/analise/`.
- CA06: Docker Compose fica documentado apenas como local/fallback/legado.
- CA07: Pendencias de Lambda, Neon, aplicacao de migrations, S3 para uploads, DNS/TLS e budgets ficam explicitadas.
- CA08: Nenhum secret real e adicionado ao repositorio.

## Estrategia de implementacao

1. Atualizar documentacao do repo para alinhar a decisao historica.
2. Criar branch/commit separado apenas para docs/spec, se a frente for versionada.
3. Adaptacao Lambda da API e upload de logo S3/Disabled: concluido no codigo, pendente de recursos reais AWS.
4. Em uma proxima tarefa, criar o caminho de deploy web para S3/CloudFront.
5. Em uma proxima tarefa, criar Neon Free e aplicar migrations.
6. Em uma proxima tarefa, configurar DNS, TLS, IAM, bucket/CDN de assets e budgets.
7. Somente depois rodar aceite real e abrir beta assistido.

## Testes

- Rodar verificacao textual para garantir que App Runner/RDS nao aparecem como recomendacao atual.
- Rodar `pnpm validate:mvp` antes de qualquer deploy real.
- Depois da implementacao serverless, validar:
  - `GET https://api.emprely.com.br/health/live`;
  - `GET https://api.emprely.com.br/health/ready`;
  - abertura de `https://app.emprely.com.br`;
  - cadastro, confirmacao de email, login, criacao de proposta, PDF/print e WhatsApp;
  - CORS real entre web e API;
  - migrations aplicadas no Neon;
  - logs e alertas de custo ativos.
