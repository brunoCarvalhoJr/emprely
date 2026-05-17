# Dominios e ambientes

## Decisao atual

Com base no Notion e na landing ja publicada, a estrategia de dominios do Emprely fica:

| Uso | Dominio | Status |
| --- | --- | --- |
| Landing canonica | `https://www.emprely.com.br` | Publicado |
| Landing apex | `https://emprely.com.br` | Publicado |
| SaaS web | `https://app.emprely.com.br` | Planejado |
| API | `https://api.emprely.com.br` | Planejado |

## Evidencias

- O Notion define `www.emprely.com.br` como dominio canonico recomendado da marca.
- O Notion registra a Landing V1 publicada na AWS com S3 privado, CloudFront, Route 53 e ACM.
- O Notion registra `app.emprely.com.br` como aplicacao recomendada.
- Validacao local em 2026-05-13: `https://www.emprely.com.br/` respondeu 200.
- Validacao local em 2026-05-13: `https://emprely.com.br/` respondeu 200.
- DNS de `www.emprely.com.br` e `emprely.com.br` resolveu para enderecos CloudFront.

## Separacao por papel

### Landing

`www.emprely.com.br` e `emprely.com.br` pertencem a Landing V1. Ela permanece fora deste monorepo, no projeto:

```txt
D:\Emprely\Projetos\LandingPage\EmprelyLandingPage-WebApp
```

A Landing V2 deve vir depois de prints reais do sistema, exemplos reais de proposta e fluxo comercial mais maduro.

### SaaS web

`app.emprely.com.br` deve hospedar o app React/Vite do SaaS.

No build do web, configure:

```txt
VITE_API_BASE_URL=https://api.emprely.com.br
```

### API

`api.emprely.com.br` deve hospedar a API ASP.NET Core.

Na API, configure CORS para permitir o SaaS web:

```txt
Cors__OrigensPermitidas__0=https://app.emprely.com.br
```

Se a landing passar a enviar formulario diretamente para a API, adicionar `https://www.emprely.com.br` como segunda origem CORS apenas para os endpoints necessarios.

## AWS recomendada pelo Notion

- Landing: S3 privado + CloudFront + Route 53 + ACM, ja publicado.
- API inicial: AWS App Runner para container ASP.NET Core.
- Banco: Amazon RDS PostgreSQL.
- Storage: Amazon S3.
- Logs: CloudWatch.
- Futuro: ECS Fargate, SQS, SES e Sentry conforme necessidade.

## Pendencias antes do beta real

- Criar ou confirmar registros DNS para `app.emprely.com.br`.
- Criar ou confirmar registros DNS para `api.emprely.com.br`.
- Emitir/associar certificados TLS para os subdominios.
- Provisionar banco beta/staging.
- Provisionar API e web em AWS.
- Rebuildar a imagem web depois de definir `API_PUBLIC_URL=https://api.emprely.com.br`.
- Aplicar migrations no banco real.
- Rodar aceite manual do MVP.
