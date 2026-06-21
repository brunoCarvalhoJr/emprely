# Testes da API

Esta pasta contem as suites xUnit da API do Emprely.

## Estrutura

| Projeto | Papel | Comando |
|---|---|---|
| `Emprely.UnitTests` | regras de dominio puras e comportamento de entidades | `dotnet test apps/api/tests/Emprely.UnitTests/Emprely.UnitTests.csproj` |
| `Emprely.IntegrationTests` | API, DI, EF Core InMemory, controllers, contratos HTTP e fluxos | `dotnet test apps/api/tests/Emprely.IntegrationTests/Emprely.IntegrationTests.csproj` |
| Solution completa | unitarios + integracao | `pnpm test:api` |

## Quando criar unitario

Crie ou ajuste unitarios quando a mudanca tocar:

- entidade de dominio;
- calculo de total/desconto;
- status de proposta, trial, conta ou usuario;
- validacao de cliente, servico, proposta ou perfil;
- regra de permissao que possa ser isolada;
- formatacao ou decisao pura sem I/O.

Unitario deve ser rapido, deterministico e sem banco, rede, clock real ou secret.
Quando precisar de data/hora, prefira valor fixo ou abstracao ja existente.

## Quando criar integracao

Crie ou ajuste integracao quando a mudanca tocar:

- endpoint HTTP;
- serializacao de request/response;
- status code e payload de erro;
- autenticacao/autorizacao;
- persistencia EF;
- migrations ou schema observado pela API;
- envio de email por provider fake;
- upload/download/storage;
- rate limit ou CORS.

`EmprelyApiFactory` usa banco InMemory isolado por instancia e remove providers
de logging do TestHost para rodar no Windows sem depender do Event Log.

## Padroes

- Nomeie testes pelo comportamento esperado, nao pelo metodo interno.
- Cada teste deve montar a propria massa.
- Nao compartilhe usuario/conta mutavel entre testes paralelos.
- Valide status code e corpo relevante.
- Para erro de validacao, teste pelo campo e mensagem essencial.
- Para auth/admin, teste pelo menos caso permitido e negado.
- Nao use secrets reais, URLs reais de producao ou email real.

## Limites do InMemory

EF Core InMemory nao reproduz todas as garantias do PostgreSQL, como constraints,
transacoes e consultas SQL especificas. Quando uma mudanca depender dessas
garantias, registre na spec a necessidade de teste com Postgres real ou smoke em
ambiente de staging.

## Checklist antes de merge

- `pnpm test:api` verde.
- Testes cobrem caminho feliz e erro relevante.
- Mudancas de contrato foram refletidas no web/E2E quando impactam UI.
- Nenhum teste depende da ordem de execucao.
- Nenhum dado sensivel aparece em log, fixture ou snapshot.
