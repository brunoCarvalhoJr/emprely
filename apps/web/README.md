# Emprely Web

SaaS web do Emprely Orçamentos.

## Stack

- React com Vite.
- React.
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
```

## Ambiente

Copie os valores de `.env.example` quando precisar alterar a URL da API:

```txt
VITE_API_BASE_URL=http://localhost:5262
```

## Direção de produto

O web deve começar como ferramenta real para:

- cadastrar perfil/marca;
- cadastrar clientes;
- cadastrar serviços/pacotes;
- criar proposta;
- visualizar proposta;
- exportar PDF/imagem;
- gerar mensagem para WhatsApp.
