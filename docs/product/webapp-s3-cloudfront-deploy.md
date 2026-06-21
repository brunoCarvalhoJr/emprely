# Deploy webapp S3 + CloudFront - Emprely Orcamentos

## Objetivo

Publicar o SaaS web em `https://app.emprely.com.br`, apontando para a API real em `https://api.emprely.com.br`.

## Estado atual antes deste deploy

- API publicada no Lightsail e validada:
  - `https://api.emprely.com.br/health/live`
  - `https://api.emprely.com.br/health/ready`
- Banco Neon Free com migrations aplicadas.
- Assets/logos em S3 privado + CloudFront:
  - `https://dz3i7ivpc873w.cloudfront.net`
- Email Zoho `contato@emprely.com.br` funcionando.
- Bucket S3 privado `emprely-app-web` criado.
- Build do webapp publicado no bucket `emprely-app-web`.

Proximo bloqueio: criar CloudFront/OAC e ligar `app.emprely.com.br`.

## Arquitetura

- Bucket S3 privado para o webapp.
- CloudFront com Origin Access Control.
- ACM em `us-east-1` para `app.emprely.com.br`.
- Route 53 com alias A/AAAA para CloudFront.
- Build Vite com `VITE_API_BASE_URL=https://api.emprely.com.br`.

## Criar bucket S3

Configuracao recomendada:

```txt
Bucket name: emprely-app-web
Region: us-east-1
Bucket type: General purpose
Object ownership: ACLs disabled
Block all public access: enabled
Versioning: disabled inicialmente
Static website hosting: disabled
```

O bucket deve ficar privado. O acesso publico deve acontecer apenas pelo CloudFront.

## Build do web

Execute na raiz do repo:

```powershell
pnpm web:build:beta
```

Esse comando define:

```txt
VITE_API_BASE_URL=https://api.emprely.com.br
```

e gera:

```txt
apps/web/dist
```

## Upload para S3

Depois de criar o bucket e configurar AWS CLI local:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web"
```

Depois de criar CloudFront, use tambem o ID da distribuicao para invalidar cache:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web" -DistributionId "<cloudfront-id>"
```

O script publica:

- `index.html` com cache curto/no-cache;
- assets versionados com cache longo e imutavel;
- demais arquivos do `dist`;
- invalidacao `/*` no CloudFront quando `-DistributionId` e informado.

## CloudFront

Criar distribuicao:

- Origin type: Amazon S3.
- Origin: bucket `emprely-app-web`.
- Origin path: vazio.
- Allow private S3 bucket access to CloudFront: habilitado.
- Origin Access Control: criar novo OAC.
- Viewer protocol policy: redirect HTTP to HTTPS.
- Default root object: `index.html`.
- WAF: nao habilitar por enquanto para manter custo baixo.
- Price class: North America/Europe quando disponivel no plano.

## Bucket policy OAC

A AWS pode gerar a policy automaticamente. Se precisar montar manualmente, use este formato e troque `<ACCOUNT_ID>` e `<DISTRIBUTION_ID>`:

```json
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::emprely-app-web/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
        }
      }
    }
  ]
}
```

## SPA fallback

Para o React Router funcionar ao atualizar `/suporte` ou rotas internas:

- Configure custom error response no CloudFront:
  - HTTP error code: 403
  - Response page path: `/index.html`
  - HTTP response code: 200
  - TTL: 0 ou baixo
- Repita para 404 se necessario.

## Dominio e certificado

1. Criar certificado ACM em `us-east-1` para:

```txt
app.emprely.com.br
```

2. Validar por DNS no Route 53.
3. Adicionar `app.emprely.com.br` como alternate domain name na distribuicao CloudFront.
4. Criar registro Route 53:

```txt
Record name: app
Type: A
Alias: CloudFront distribution
```

Adicionar AAAA tambem se o CloudFront oferecer IPv6.

## Validacao

```powershell
Invoke-WebRequest https://app.emprely.com.br
Invoke-RestMethod https://api.emprely.com.br/health/live
Invoke-RestMethod https://api.emprely.com.br/health/ready
```

Validar manualmente:

- carregar login/cadastro;
- criar conta de teste;
- cadastrar cliente;
- cadastrar servico;
- criar proposta;
- gerar/imprimir PDF pelo navegador;
- abrir WhatsApp;
- acessar `/suporte`;
- enviar formulario publico;
- recarregar `/suporte` diretamente no navegador.

## Depois do deploy

- Atualizar landing para apontar CTA/formulario para `https://app.emprely.com.br/suporte`.
- Criar AWS Budgets/alertas antes de liberar beta para usuarios reais.
- Decidir email transacional real antes de depender de confirmacao/reset por email.
