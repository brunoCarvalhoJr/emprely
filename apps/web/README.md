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

## Direção de produto

O web deve começar como ferramenta real para:

- cadastrar perfil/marca;
- cadastrar clientes;
- cadastrar serviços/pacotes;
- criar proposta;
- visualizar proposta;
- exportar PDF/imagem;
- gerar mensagem para WhatsApp;
- visualizar trial e ativar Plano Fundador manualmente.
- trocar a propria senha enquanto estiver logado.

## E2E

O E2E leve usa Playwright com API mockada e valida o fluxo principal sem backend real:

```powershell
pnpm --dir apps/web test:e2e
```

O web persiste a sessao em `localStorage` na chave `emprely.authSession`, incluindo `expiresAtUtc`. Sessao vencida ou resposta `401` em chamada autenticada limpa o estado local e volta para login.

A troca de senha fica na area Conta e chama `PUT /api/me/password`. Recuperacao por email ainda nao entra no MVP porque depende de envio transacional.
