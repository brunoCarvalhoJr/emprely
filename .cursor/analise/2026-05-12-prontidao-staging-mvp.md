# Analise - Prontidao staging MVP

## Contexto

Depois da validacao do beta local com `pnpm validate:beta`, o proximo risco funcional do MVP e conseguir rodar API e web fora da maquina local sem depender de `localhost`, CORS fixo ou secrets dev versionados.

## Objetivo

Preparar o monorepo para um primeiro ambiente beta/staging com configuracao explicita, health/readiness e documentacao operacional.

## Projetos impactados

- API: CORS configuravel, health/readiness e appsettings sem segredo dev no arquivo base.
- Web: URL da API normalizada por ambiente.
- Mobile: nao impactado.
- Landing: nao impactada.
- Packages: nao impactados.
- Infra: documentacao de variaveis e checks.

## Fluxo atual

- API aceita CORS somente em origens locais hardcoded no `Program.cs`.
- `appsettings.json` contem connection string e chave JWT dev.
- Health existe em `/health`, mas nao separa liveness e readiness com banco.
- Web usa fallback local para API, mesmo quando o build for usado fora do ambiente dev.

## Fluxo proposto

1. API carrega `Cors:OrigensPermitidas` por configuracao.
2. Ambiente Development mantem valores locais no `appsettings.Development.json`.
3. Arquivo base deixa claro que connection string e JWT devem vir de ambiente/secret.
4. API expoe `/health/live` e `/health/ready`.
5. Web normaliza `VITE_API_BASE_URL` e so usa fallback local em modo dev.
6. Runbook documenta variaveis minimas para staging.

## Regras de negocio

- Nenhum dado de producao ou segredo real deve ser versionado.
- O MVP continua monolitico, sem microservicos.
- Prints, imagens e ajustes visuais ficam fora desta rodada.

## Impactos tecnicos

- Programacao defensiva na subida da API para falhar cedo sem CORS/JWT/DB configurados.
- Readiness deve validar conectividade do banco.
- Validacao automatizada deve continuar passando com ambiente local.

## Riscos

- Remover valores dev do appsettings base pode quebrar execucoes sem `ASPNETCORE_ENVIRONMENT=Development`; isso e desejado para staging/producao.
- Readiness depende do provider atual do EF em teste e desenvolvimento.

## Duvidas

- Sem duvidas bloqueantes. Assumo que o primeiro staging usara variaveis de ambiente, nao arquivos com secrets no repositorio.
