# Spec - Ajustes frontend e logo da conta

## Escopo

Implementar os ajustes pedidos:

- footer no fim da pagina/tela;
- logo escura da Emprely para tema escuro;
- upload de logo com limite, conversao WebP e referencia no banco;
- texto `Abrir WhatsApp` substituido por `WhatsApp`.

## Fora do escopo

- Migrar uploads para S3/CDN agora.
- Limpeza automatica de logos antigas.
- Refatorar o app React inteiro.

## Validacao

- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln --no-build`
- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
