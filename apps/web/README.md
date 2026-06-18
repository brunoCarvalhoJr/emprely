# Emprely Web

SaaS web do Emprely Orçamentos.

## Stack

- React com Vite.
- TypeScript.
- Tailwind CSS.
- TanStack Query.
- React Hook Form.
- Zod.
- lucide-react.

## Comandos

```powershell
pnpm --dir apps/web dev
pnpm --dir apps/web lint
pnpm --dir apps/web build
pnpm --dir apps/web test:e2e
pnpm web:build:beta
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web"
```

## Ambiente

Copie os valores de `.env.example` quando precisar alterar a URL da API:

```txt
VITE_API_BASE_URL=http://localhost:5262
```

Em beta/staging, configure `VITE_API_BASE_URL` com a URL publica da API antes do build do web:

```txt
VITE_API_BASE_URL=https://api.emprely.com.br
```

Sem essa variavel, o web so usa fallback local em modo dev.

## Deploy beta

O deploy beta oficial do webapp e S3 privado + CloudFront em:

```txt
https://app.emprely.com.br
```

Runbook completo:

```txt
docs/product/webapp-s3-cloudfront-deploy.md
```

Fluxo resumido:

```powershell
pnpm web:build:beta
powershell -ExecutionPolicy Bypass -File scripts/deploy-web-s3.ps1 -BucketName "emprely-app-web" -DistributionId "<cloudfront-id>"
```

O script de build define `VITE_API_BASE_URL=https://api.emprely.com.br`. O script de deploy envia `index.html` com cache curto e assets versionados com cache longo.

## Direção de produto

O web deve começar como ferramenta real para:

- cadastrar perfil/marca;
- cadastrar clientes;
- cadastrar serviços/pacotes;
- criar proposta;
- visualizar proposta;
- exportar PDF/imagem;
- gerar mensagem para WhatsApp;
- visualizar trial e orientar ativacao de plano quando necessario.
- aplicar regras de ciclo de vida de proposta no frontend.
- exibir formulario publico de suporte/interesse em `/suporte`.

## Regras de proposta no web

- `Rascunho`: pode abrir editor e salvar normalmente.
- `Gerada`: pode abrir editor apos confirmacao; ao salvar, a API retorna a proposta como `Rascunho`.
- `Enviada`, `Aceita` e `Recusada`: nao abrem editor direto; o usuario deve duplicar para criar nova versao.
- Trial ativo permite gerar/exportar/enviar com marca d'água discreta.
- Trial expirado permite visualizar e duplicar, mas bloqueia gerar, imprimir/PDF, imagem e WhatsApp.
- Trial expirado exibe banner com CTA “Ativar plano” e marca d'água grande na visualizacao interna.

## E2E

O E2E leve usa Playwright com API mockada e valida o fluxo principal sem backend real:

```powershell
pnpm --dir apps/web test:e2e
```

O web persiste a sessao em `localStorage` na chave `emprely.authSession`, incluindo `expiresAtUtc`. Sessao vencida ou resposta `401` em chamada autenticada limpa o estado local e volta para login.

Dados atualizados de `/api/me` têm prioridade sobre os dados de conta persistidos na sessao. O web tambem calcula expiração local por `trialEndsAt` para evitar exportacao/compartilhamento quando o trial venceu durante uma sessao aberta.

Recuperacao de senha por email ainda nao entra no MVP porque depende de envio transacional.
