# Spec API - Perfil em producao com migration pendente

## Visao geral

Aplicar a migration pendente do campo `FormatoArquivoPreferido` no banco beta/producao para corrigir o erro da tela de perfil.

## Endpoints

| Metodo | Rota | Autenticacao | Descricao |
| --- | --- | --- | --- |
| GET | `/api/account/profile` | Bearer | Deve voltar a carregar o perfil da conta. |
| PUT | `/api/account/profile` | Bearer | Deve continuar salvando o perfil com formato preferido. |

## Contratos

Sem alteracao de contrato nesta correcao.

## Regras de negocio

- O formato preferido deve ter valor padrao seguro para contas existentes.
- A aplicacao nao deve tentar ler coluna inexistente no banco publicado.

## Validacoes

- Confirmar health publico da API.
- Confirmar que a migration consta em `__EFMigrationsHistory`.
- Confirmar que a coluna existe em `perfis_conta`.

## Dados e persistencia

- Aplicar migration `20260619013555_FormatoArquivoPreferidoPerfil`.

## Erros esperados

- Se a migration nao for aplicada, `GET /api/account/profile` falha com PostgreSQL `42703`.

## Testes

- Build/testes automatizados nao sao necessarios para o hotfix operacional porque a migration ja esta versionada.
- Validacao principal: consulta de schema e health publico apos aplicar a migration.
