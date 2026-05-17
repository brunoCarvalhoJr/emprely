# Spec API - Prontidao staging MVP

## Visao geral

Adicionar configuracao operacional minima para a API do MVP rodar em beta/staging.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/health` | Publica | Health basico ASP.NET Core |
| GET | `/health/live` | Publica | Processo da API esta vivo |
| GET | `/health/ready` | Publica | API consegue conectar no banco |

## Contratos

### Request

```json
{}
```

### Response

```json
{
  "status": "Ready",
  "service": "Emprely.Api",
  "environment": "Development",
  "database": true,
  "checkedAtUtc": "2026-05-12T00:00:00+00:00"
}
```

## Regras de negocio

- Health nao revela dados de usuarios, contas, clientes, servicos ou propostas.
- Health nao exige autenticacao.

## Validacoes

- `Cors:OrigensPermitidas` deve ter ao menos uma origem configurada.
- `Jwt:SigningKey` deve manter minimo de 32 caracteres.
- `ConnectionStrings:EmprelyDb` continua obrigatoria.

## Dados e persistencia

- `/health/ready` usa `EmprelyDbContext.Database.CanConnectAsync`.

## Erros esperados

- `/health/ready` retorna 503 quando o banco nao esta acessivel.
- API falha na inicializacao quando configuracao obrigatoria nao existe.

## Testes

- Unitarios: nao necessario, sem regra de dominio.
- Integracao: validar `/health/live` e `/health/ready`.
