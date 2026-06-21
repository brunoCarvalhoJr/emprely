# Spec - Admin emails no painel administrativo

## Escopo

Mover a ferramenta de emails administrativos do app comum para o painel `/admin`.

## Comportamento

- O app comum nao deve ter `adminEmails` como item de navegacao ou tela principal.
- O painel `/admin` deve exibir um bloco de "Emails administrativos" para administradores `SuperAdmin`.
- O bloco deve conter:
  - formulario para reenviar confirmacao de email;
  - botao para atualizar historico;
  - lista responsiva com os ultimos emails.
- O backend deve aceitar token administrativo valido para `GET /api/admin/emails` e `POST /api/admin/emails/resend-confirmation`.
- A chave operacional antiga pode continuar funcionando para compatibilidade.

## Fora de escopo

- Criar novo app ou rota separada.
- Alterar o fluxo de envio de emails transacionais.
- Criar novos tipos de email.

## Validacao

- `npm.cmd run build` em `apps/web`.
- `npm.cmd run lint` em `apps/web`.
- `dotnet build` no projeto API.
