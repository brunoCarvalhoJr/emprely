# Dominios e ambientes

## Decisao atual

Com base no Notion e na landing ja publicada, a estrategia de dominios do Emprely fica:

| Uso | Dominio | Status |
| --- | --- | --- |
| Landing canonica | `https://www.emprely.com.br` | Publicado |
| Landing apex | `https://emprely.com.br` | Publicado |
| SaaS web | `https://app.emprely.com.br` | Planejado |
| API | `https://api.emprely.com.br` | Publicado |
| Assets/logos | `https://dz3i7ivpc873w.cloudfront.net` | Publicado |
| Email profissional | `contato@emprely.com.br` | Publicado no Zoho |
| Email transacional | `contato@emprely.com.br` via Amazon SES `us-east-1` | Publicado/validado |
| WhatsApp comercial/suporte | `+55 (35) 99738-9755` (`https://wa.me/5535997389755`) | Canal publico oficial para contato, suporte e ativacao de plano |

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

Estado atual em 2026-06-16: API publicada em Lightsail com Docker Compose + Caddy e validada com:

```txt
https://api.emprely.com.br/health/live
https://api.emprely.com.br/health/ready
```

Na API, configure CORS para permitir o SaaS web:

```txt
Cors__OrigensPermitidas__0=https://app.emprely.com.br
Cors__OrigensPermitidas__1=https://www.emprely.com.br
Cors__OrigensPermitidas__2=https://emprely.com.br
```

O formulario publico de contato/interesse existe no webapp em `https://app.emprely.com.br/suporte` e na landing em `https://www.emprely.com.br`. Ambos usam `POST https://api.emprely.com.br/api/support/public`, enviando para `contato@emprely.com.br`.

### E-mail

`contato@emprely.com.br` tem dois papéis:

- Zoho Mail: caixa de entrada profissional para leitura, resposta manual, assinatura e contato com clientes.
- Amazon SES em `us-east-1`: envio transacional automático do SaaS, incluindo confirmação de e-mail, recuperação de senha, boas-vindas e suporte.

O WhatsApp oficial inicial para contato comercial, suporte simples e ativacao de plano e `+55 (35) 99738-9755`. Links publicos devem usar `https://wa.me/5535997389755` com mensagem contextual pre-preenchida quando fizer sentido.

O domínio `emprely.com.br` está verificado no SES, com acesso à produção concedido. Os templates transacionais ficam centralizados na API em `EmailTransacionalTemplateBuilder` e usam a logo pública do webapp em `https://app.emprely.com.br/brand/emprely-logo-dark.png`.

## Arquitetura AWS atual decidida

A decisao atual para o primeiro beta real prioriza custo baixo e pagamento por uso:

- Landing: S3 privado + CloudFront + Route 53 + ACM, ja publicado.
- SaaS web: S3 privado + CloudFront em `app.emprely.com.br`.
- API inicial: AWS Lightsail Linux US$7/mes com Docker Compose + Caddy em `api.emprely.com.br`, ja publicada.
- Banco inicial: Neon Free PostgreSQL, ja criado e migrado.
- Storage de arquivos persistentes: Amazon S3 privado + CloudFront, ja validado para logos.
- Email transacional: Amazon SES em `us-east-1`, ja validado com `contato@emprely.com.br`.
- Email manual/profissional: Zoho Mail em `contato@emprely.com.br`.
- Logs: Docker json-file no Lightsail e/ou mecanismo equivalente de observabilidade.
- Alertas de custo: AWS Budgets antes de liberar beta real.
- Futuro: Lambda/API Gateway, App Runner, Neon pago, RDS PostgreSQL, ECS/Fargate, SQS, SES e Sentry conforme receita ou necessidade tecnica.

Lambda, App Runner, RDS e ECS/Fargate ficam como alternativas futuras, mas nao sao mais a recomendacao inicial para o beta real.

## Pendencias antes do beta real

- Criar ou confirmar registros DNS para `app.emprely.com.br`.
- Emitir/associar certificados TLS para os subdominios.
- Certificado e DNS de `api.emprely.com.br` ja estao operacionais via Caddy/Route 53; falta o webapp.
- Confirmar que o webapp em `app.emprely.com.br` usa certificado CloudFront/ACM em `us-east-1`.
- Publicar web em S3 + CloudFront com `VITE_API_BASE_URL=https://api.emprely.com.br`.
- CORS da API ja esta configurado para `https://app.emprely.com.br`; falta validar pelo webapp publicado.
- Fazer deploy da API com os novos templates transacionais e revalidar confirmação/recuperação em Gmail e Hotmail.
- Criar AWS Budgets/alertas de custo.
- Rodar aceite manual do MVP.
