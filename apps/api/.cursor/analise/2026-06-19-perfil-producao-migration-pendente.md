# Analise API - Perfil em producao com migration pendente

## Contexto

O usuario reportou que a tela de Configuracoes nao carrega o perfil no app publicado.
O health publico foi investigado e o servidor Lightsail esta com os containers `api` e `caddy` em execucao.
Os logs da API mostram erro PostgreSQL `42703: column p.FormatoArquivoPreferido does not exist` ao chamar `GET /api/account/profile`.

## Objetivo

Restaurar o carregamento do perfil aplicando a migration ja versionada que adiciona `FormatoArquivoPreferido` em `perfis_conta`.

## Endpoints impactados

- `GET /api/account/profile`
- `PUT /api/account/profile`

## Contratos impactados

- Requests: nenhum novo contrato.
- Responses: contrato atual de `PerfilContaResponse` ja espera `formatoArquivoPreferido`.

## Dominio impactado

- Entidade: `PerfilConta`.
- Regra: formato preferido de arquivo deve existir para personalizacao e envio de proposta.

## Persistencia e integracoes

- Banco: aplicar migration `20260619013555_FormatoArquivoPreferidoPerfil` no Neon.
- S3/SES/SQS: sem impacto.
- Auth/Billing: sem impacto.

## Multi-tenancy

Sem alteracao. `AccountId` continua resolvido pelo contexto autenticado.

## Riscos

- Rodar migration em banco de producao exige usar a connection string correta e nao expor secrets.
- A coluna e `NOT NULL` com default na migration, portanto deve ser segura para linhas existentes.
