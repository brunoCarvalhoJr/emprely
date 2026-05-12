# Analise API - Cadastro Usuario Validacao

## Contexto

O cadastro de usuario via `POST /api/auth/register` estava retornando erro 500 antes de executar a regra de negocio.

Durante o teste direto na API, o EventLog registrou `InvalidOperationException` informando que os metadados de validacao do record `RegisterUsuarioRequest` estavam associados a propriedades que seriam ignoradas pelo ASP.NET Core.

## Objetivo

Permitir que os contratos de autenticacao sejam validados corretamente pelo model binding do ASP.NET Core, mantendo o fluxo de cadastro funcional.

## Endpoints impactados

- `POST /api/auth/register`
- `POST /api/auth/login`

## Contratos impactados

- Requests:
  - `RegisterUsuarioRequest`
  - `LoginUsuarioRequest`
- Responses:
  - Nenhum contrato de response alterado.

## Dominio impactado

- Entidades:
  - `Usuario`
  - `Conta`
  - `MembroConta`
- Value objects:
  - Nenhum.
- Regras:
  - Manter validacao obrigatoria de nome, email, senha e nome da conta.
  - Manter validacao de email em formato valido.
  - Manter senha com minimo de 8 caracteres no cadastro.

## Persistencia e integracoes

- Banco:
  - Sem alteracao de schema.
- S3/SES/SQS:
  - Nao impactado.
- Auth/Billing:
  - Impacto direto em Auth.
  - Sem impacto em Billing.

## Multi-tenancy

O `conta_id` continua sendo criado no cadastro e retornado no token JWT pelos fluxos ja existentes.

## Riscos

- Baixo risco, pois a alteracao corrige apenas a posicao dos atributos de validacao nos records.
- O cadastro ainda pode falhar corretamente com `400` ou `409` quando os dados forem invalidos ou o email ja existir.

## Duvidas

- Sem duvidas bloqueantes para esta correcao.
