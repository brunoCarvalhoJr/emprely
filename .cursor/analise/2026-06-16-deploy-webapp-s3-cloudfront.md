# Analise - Deploy do webapp em S3 + CloudFront

## Contexto

Em 2026-06-15 a API do Emprely foi publicada com sucesso em Lightsail:

- dominio publico: `https://api.emprely.com.br`;
- health checks validados: `/health/live` e `/health/ready` com HTTP 200;
- runtime: Docker Compose + Caddy em `/opt/emprely/orcamentos`;
- banco: Neon Free;
- assets/logos: S3 privado + CloudFront em `https://dz3i7ivpc873w.cloudfront.net`.

O proximo passo do beta e publicar o SaaS web React/Vite em `https://app.emprely.com.br`, mantendo S3 privado e CloudFront com Origin Access Control.

## Estado atual do repositorio

- `apps/web` ja builda via Vite.
- `VITE_API_BASE_URL` e obrigatorio fora de desenvolvimento e deve apontar para `https://api.emprely.com.br`.
- O formulario publico de suporte/interesse ja existe em `/suporte`.
- Nao ha script padrao para build beta nem para upload do `dist` para S3.
- A documentacao ainda precisava refletir que a API ja esta publicada e que o proximo bloqueante e o webapp.

## Fluxo proposto

1. Criar bucket S3 privado para o webapp, inicialmente `emprely-app-web`.
2. Buildar `apps/web` com `VITE_API_BASE_URL=https://api.emprely.com.br`.
3. Publicar `apps/web/dist` no bucket S3.
4. Criar distribuicao CloudFront com origem S3 privada e OAC.
5. Associar certificado ACM de `app.emprely.com.br` em us-east-1.
6. Criar registro Route 53 `app.emprely.com.br` apontando para CloudFront.
7. Validar home, login/cadastro, `/suporte` e fluxo principal contra a API publica.
8. Depois do deploy, atualizar landing para apontar CTA/formulario para `https://app.emprely.com.br/suporte`.

## Decisoes

- S3 do webapp deve ficar privado, sem Static Website Hosting.
- CloudFront deve usar OAC, igual aos assets/logos.
- `index.html` deve ser publicado com cache curto/no-cache.
- Assets versionados do Vite podem usar cache longo e imutavel.
- `assets.emprely.com.br` fica como melhoria posterior; nao bloqueia o beta.

## Riscos

- Build sem `VITE_API_BASE_URL=https://api.emprely.com.br` publica um app apontando para API local ou quebrada.
- CloudFront sem fallback de SPA pode retornar 403/404 ao recarregar rotas internas.
- Cache longo em `index.html` pode prender usuarios em versoes antigas.
- CORS da API ja espera `https://app.emprely.com.br`; se testar por dominio CloudFront padrao, chamadas autenticadas podem falhar por CORS.
- Certificado CloudFront precisa estar no ACM de `us-east-1`.

## Duvidas resolvidas

- API publica ja esta pronta para o webapp.
- O primeiro dominio oficial do webapp sera `app.emprely.com.br`.
- O bucket S3 do app sera separado do bucket de assets/logos.
