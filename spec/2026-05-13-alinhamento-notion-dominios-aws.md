# Spec - Alinhamento Notion dominios AWS

## Visao geral

Atualizar a documentacao e os exemplos de ambiente do Emprely com base na revisao do Notion e na landing ja publicada em `www.emprely.com.br`.

## Escopo

Inclui:

- Documento de mapa de dominios e ambientes.
- Atualizacao de placeholders de beta/staging.
- Script para aplicar dominios reais planejados no `infra/docker/beta.env` privado.
- Validacao publica do env privado.
- Registro de evidencias Notion/local/web.

Fora do escopo:

- Criar DNS no Route 53.
- Provisionar App Runner, RDS, CloudFront ou Amplify.
- Fazer deploy real da API/web.
- Migrar a landing para o monorepo.
- Criar Landing V2.

## Fluxo ponta a ponta

1. Revisar Notion e docs locais.
2. Confirmar landing publicada.
3. Definir mapa de dominios.
4. Atualizar docs e exemplos.
5. Aplicar dominios no env privado local.
6. Validar que o env nao contem placeholders nem localhost para uso publico.

## Requisitos

- Landing canonica: `https://www.emprely.com.br`.
- Apex ativo: `https://emprely.com.br`.
- SaaS web planejado: `https://app.emprely.com.br`.
- API planejada: `https://api.emprely.com.br`.
- CORS da API deve apontar para o host do SaaS web.
- O arquivo privado `infra/docker/beta.env` nao deve aparecer no Git.

## Regras de negocio

- A landing continua institucional ate a Landing V2.
- Prints e imagens continuam adiados ate o fim do MVP.
- Beta assistido depende de ambiente real e aceite manual.

## Impactos por projeto

- API: README e exemplo de CORS/admin endpoint.
- Web: README e `.env.example`.
- Mobile: sem impacto.
- Landing: README e docs de arquitetura.
- Packages: sem impacto.
- Infra: env example, scripts e deploy docs.

## Criterios de aceite

- Existe `docs/architecture/dominios-ambientes.md`.
- Os docs nao usam mais `api-beta.seu-dominio.com` ou `app-beta.seu-dominio.com`.
- `infra/docker/beta.env.example` aponta para `api.emprely.com.br` e `app.emprely.com.br`.
- `scripts/set-beta-domains.ps1` existe.
- `pnpm beta:env:domains` atualiza o env privado sem exibir secrets.
- `pnpm beta:env:validate:public` passa.
- `pnpm validate:mvp` passa.

## Estrategia de implementacao

- Atualizar apenas docs, exemplos e scripts.
- Nao alterar comportamento funcional de API/web.
- Usar scripts para mexer no env privado, evitando expor secrets no patch ou no terminal.

## Testes

- `pnpm beta:env:domains`
- `pnpm beta:env:validate:public`
- `pnpm validate:deploy`
- `pnpm validate:mvp`
- Verificacao de containers/portas ao final.
