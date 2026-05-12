# Analise API - Perfil Conta Marca

## Contexto

A base de autenticacao, conta e JWT esta funcional. O proximo passo do MVP e permitir que cada conta configure a identidade profissional usada futuramente em propostas, previews, PDF/imagem e mensagem de WhatsApp.

## Objetivo

Criar o perfil profissional e de marca da conta autenticada, com leitura e atualizacao via API protegida por JWT.

## Endpoints impactados

- `GET /api/account/profile`
- `PUT /api/account/profile`

## Contratos impactados

- Requests:
  - `UpdatePerfilContaRequest`
- Responses:
  - `PerfilContaResponse`

## Dominio impactado

- Entidades:
  - `PerfilConta`
  - `Conta`
- Value objects:
  - Nenhum nesta entrega.
- Regras:
  - Cada conta pode ter no maximo um perfil.
  - O perfil pertence sempre ao `conta_id` do token.
  - Campos comerciais sao opcionais para nao bloquear o onboarding.
  - Cores devem seguir formato hexadecimal `#RRGGBB`.
  - Logo entra como `LogoUrl` opcional nesta etapa; upload fica fora do escopo.

## Persistencia e integracoes

- Banco:
  - Nova tabela `perfis_conta`.
  - Relacao 1:1 com `contas`.
- S3/SES/SQS:
  - Upload real de logo para S3 fica fora do escopo.
- Auth/Billing:
  - Endpoint exige JWT.
  - Plano/trial nao impactado nesta entrega.

## Multi-tenancy

O `ContaId` sera sempre lido de `ICurrentContaContext`. O request nao aceita `contaId`, evitando atualizacao cruzada entre contas.

## Riscos

- Validacao de URL e documento sera simples neste primeiro incremento.
- Dados existentes de contas antigas podem nao ter linha em `perfis_conta`; o GET deve retornar um perfil padrao derivado da conta.

## Duvidas

- Logo sera URL manual por enquanto ou upload? Decisao atual: URL manual, upload futuro.
- Documento sera CPF/CNPJ validado? Decisao atual: texto opcional, validacao formal futura.
- Cores terao preset de design tokens? Decisao atual: aceitar hex para validar fluxo do MVP.
