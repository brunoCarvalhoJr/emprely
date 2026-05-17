# Spec - Prontidao staging MVP

## Visao geral

Preparar o MVP para sair do beta local e rodar em um ambiente beta/staging com configuracao segura e verificavel.

## Escopo

Inclui:

- CORS configuravel na API.
- Remocao de segredo dev do `appsettings.json` base.
- Health liveness e readiness com banco.
- Normalizacao da URL da API no web.
- Documentacao das variaveis obrigatorias para staging.

Fora do escopo:

- Deploy cloud real.
- CI/CD definitivo.
- Billing/checkout.
- Prints, imagens e polimento final de layout.

## Fluxo ponta a ponta

1. Operador configura variaveis da API e do web no ambiente beta/staging.
2. API sobe validando connection string, JWT e origens CORS.
3. Load balancer/operador consulta `/health/live` para saber se o processo esta vivo.
4. Load balancer/operador consulta `/health/ready` para saber se a API consegue falar com o banco.
5. Web usa `VITE_API_BASE_URL` configurado para chamar a API correta.

## Requisitos

- API deve ler `Cors:OrigensPermitidas`.
- API deve rejeitar inicializacao sem origem CORS em ambiente nao local.
- API deve expor `/health`, `/health/live` e `/health/ready`.
- Web deve remover barras finais duplicadas da URL base.
- Web deve usar fallback `http://localhost:5262` somente em modo dev.

## Regras de negocio

- Secrets reais nao entram no repositorio.
- O MVP continua com uma unica API.
- Ajustes visuais ficam para a rodada final do MVP.

## Impactos por projeto

- API: `Program.cs`, configuracao CORS, endpoints de health, testes.
- Web: cliente de API e `.env.example`.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: runbook beta/staging.

## Criterios de aceite

- `pnpm validate:beta` continua passando.
- `/health/live` retorna 200.
- `/health/ready` retorna 200 quando o banco esta acessivel.
- `appsettings.json` nao contem segredo JWT dev.
- Documentacao lista variaveis minimas de staging.

## Estrategia de implementacao

- Criar options de CORS na API.
- Extrair health endpoints para extensao pequena.
- Atualizar appsettings base/development e criar exemplo de staging.
- Ajustar helper de URL da API no web.
- Atualizar runbook e READMEs.

## Testes

- `pnpm lint:web`
- `pnpm build:web`
- `pnpm test:e2e:web`
- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln`
- `pnpm validate:beta`
