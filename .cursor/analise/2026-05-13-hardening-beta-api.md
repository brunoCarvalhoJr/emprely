# Analise - Hardening beta API

## Contexto

O MVP ja possui auth JWT, CORS configuravel, readiness e ativacao administrativa. Antes de abrir beta fora do local, falta hardening leve na API para reduzir superficie de abuso e respostas com headers basicos de seguranca.

## Objetivo

Adicionar headers de seguranca e rate limit configuravel para endpoints sensiveis sem mudar fluxo funcional ou layout.

## Projetos impactados

- API: middleware de headers e rate limiter.
- Web: nao impactado.
- Mobile: nao impactado.
- Landing: nao impactada.
- Packages: nao impactados.
- Infra: documentacao de variaveis.

## Fluxo atual

- API nao define headers como `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy`.
- Auth e endpoint admin nao possuem limitacao de tentativas por IP/cliente.

## Fluxo proposto

1. Toda resposta da API recebe headers basicos de seguranca.
2. Auth usa policy de rate limit configuravel.
3. Admin usa policy de rate limit configuravel.
4. Limites default sao altos em dev/teste para nao atrapalhar validacao.
5. Staging/producao podem configurar limites por variavel.

## Regras de negocio

- Rate limit nao deve bloquear uso normal do MVP.
- Rate limit deve proteger login/cadastro e operacoes admin.
- Sem introduzir servico externo no MVP.
- Sem prints, imagens ou polimento visual nesta rodada.

## Impactos tecnicos

- Usar rate limiter nativo do ASP.NET Core.
- Aplicar policies por controller.
- Adicionar configuracao `RateLimit`.
- Adicionar teste de integracao para headers.

## Riscos

- Limites muito baixos em beta podem bloquear testes reais; documentar configuracao.
- Headers muito restritivos podem afetar Swagger/OpenAPI se aplicados a UI futura; hoje so ha OpenAPI JSON.

## Duvidas

- Sem duvidas bloqueantes. Assumo que limites finais de staging serao ajustados depois de observar uso real.
