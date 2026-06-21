# Spec - Deploy do webapp em S3 + CloudFront

## Visao geral

Esta spec cobre a publicacao do SaaS web React/Vite do Emprely em S3 + CloudFront, usando a API real ja publicada em `https://api.emprely.com.br`.

A decisao atual e:

- webapp em S3 privado + CloudFront;
- dominio oficial do app: `https://app.emprely.com.br`;
- API base do build: `https://api.emprely.com.br`;
- S3 sem acesso publico direto;
- CloudFront com Origin Access Control;
- certificado TLS via ACM em `us-east-1`;
- Route 53 apontando `app.emprely.com.br` para CloudFront.

## Escopo

Inclui:

- Criar documentacao operacional do deploy web.
- Criar script de build beta do web com `VITE_API_BASE_URL`.
- Criar script de upload do `dist` para S3 com cache adequado.
- Atualizar README, runbook beta, mapa de dominios e checklist.
- Atualizar Notion e Obsidian com o novo ponto de continuidade.

Fora do escopo:

- Criar recursos reais na AWS neste momento.
- Executar upload do webapp.
- Configurar CI/CD completo.
- Alterar funcionalidades do app.
- Migrar landing para dentro do monorepo.

## Requisitos

- R01: O build beta do web deve usar `VITE_API_BASE_URL=https://api.emprely.com.br`.
- R02: O bucket S3 do web deve permanecer privado.
- R03: CloudFront deve acessar o S3 por OAC.
- R04: `index.html` deve ser enviado com cache curto/no-cache.
- R05: assets versionados do Vite devem ser enviados com cache longo e imutavel.
- R06: O deploy deve permitir invalidacao CloudFront apos upload.
- R07: `app.emprely.com.br` deve apontar para a distribuicao CloudFront do webapp.
- R08: O refresh de rotas do SPA deve cair em `index.html`.
- R09: A API deve manter CORS permitindo `https://app.emprely.com.br`.

## Fluxo operacional

1. Validar API publica:

```powershell
Invoke-RestMethod https://api.emprely.com.br/health/live
Invoke-RestMethod https://api.emprely.com.br/health/ready
```

2. Buildar web:

```powershell
pnpm web:build:beta
```

3. Publicar `apps/web/dist`:

```powershell
pnpm web:deploy:s3 -- -BucketName "emprely-app-web" -DistributionId "<cloudfront-id>"
```

4. Validar app publico:

```powershell
Invoke-WebRequest https://app.emprely.com.br
```

5. Rodar aceite manual do MVP pelo dominio publico.

## Criterios de aceite

- CA01: `pnpm web:build:beta` gera `apps/web/dist/index.html`.
- CA02: `apps/web/dist` contem assets versionados do Vite.
- CA03: `pnpm web:deploy:s3` sincroniza o bucket e invalida CloudFront quando `-DistributionId` e informado.
- CA04: `https://app.emprely.com.br` carrega o webapp.
- CA05: Refresh de `/suporte` e rotas internas nao quebra.
- CA06: Login/cadastro usa `https://api.emprely.com.br`.
- CA07: `/suporte` envia para `POST /api/support/public`.
- CA08: Nenhum secret real e adicionado ao repositorio.

## Testes

- `pnpm web:build:beta`
- `pnpm --dir apps/web test:e2e`
- `Invoke-WebRequest https://app.emprely.com.br`
- Aceite manual: cadastro, login, conta, cliente, servico, proposta, PDF/impressao, WhatsApp e suporte publico.
