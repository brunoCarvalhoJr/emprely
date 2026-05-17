# Spec - Hardening beta API

## Visao geral

Preparar a API para beta externo com headers de seguranca e rate limit simples nos endpoints sensiveis.

## Escopo

Inclui:

- Headers de seguranca em todas as respostas.
- Rate limit configuravel para `api/auth`.
- Rate limit configuravel para `api/admin`.
- Documentacao de variaveis.
- Teste de integracao para headers.

Fora do escopo:

- WAF/CDN.
- Observabilidade completa.
- Auditoria persistente.
- Captcha.
- Prints, imagens e layout final.

## Fluxo ponta a ponta

1. Requisicao chega na API.
2. Middleware adiciona headers de seguranca.
3. Se rota usa rate limit, ASP.NET Core avalia a policy.
4. Se limite for excedido, API retorna `429`.
5. Caso contrario, fluxo segue para auth/controller.

## Requisitos

- `X-Content-Type-Options = nosniff`.
- `X-Frame-Options = DENY`.
- `Referrer-Policy = no-referrer`.
- `Permissions-Policy` bloqueia recursos sensiveis.
- Auth tem policy `Auth`.
- Admin tem policy `Admin`.

## Regras de negocio

- Limites devem ser configuraveis por ambiente.
- Development deve manter limite alto para testes.

## Impactos por projeto

- API: Program, options, middleware e controllers.
- Web: sem impacto.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: docs.

## Criterios de aceite

- `pnpm validate:beta` passa.
- `/health/live` retorna headers de seguranca.
- Auth/Admin controllers possuem rate limit.
- Docs listam variaveis `RateLimit`.

## Estrategia de implementacao

- Criar `RateLimitAplicacaoOptions`.
- Criar `SecurityHeadersMiddleware`.
- Configurar `AddRateLimiter`.
- Aplicar `[EnableRateLimiting]`.
- Atualizar appsettings e docs.

## Testes

- `dotnet test apps/api/Emprely.sln`
- `pnpm validate:beta`
