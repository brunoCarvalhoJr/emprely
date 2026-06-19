# Analise - Persistencia de Data Protection keys no Postgres

## Contexto

A spec de email transacional e seguranca de conta ja alerta que os tokens de confirmacao de email, reset de senha e alteracao de email dependem de Data Protection keys persistentes em staging/producao.

Com a decisao atual de API em AWS Lambda + API Gateway e banco Neon Free, chaves locais/efemeras podem ser perdidas em restart, cold start, troca de instancia ou redeploy, invalidando links enviados por email antes do prazo.

## Objetivo

Persistir as Data Protection keys da API no banco PostgreSQL para que tokens de confirmacao/reset continuem validos apos deploy/restart e entre instancias da API.

## Projetos impactados

- API: registrar Data Protection usando o DbContext da aplicacao.
- Web: sem impacto direto.
- Mobile: sem impacto.
- Landing: sem impacto.
- Packages: sem impacto.
- Infra: migrations do banco real devem criar a tabela de keys antes do beta.

## Fluxo atual

- ASP.NET Identity usa `.AddDefaultTokenProviders()`.
- Tokens sao gerados/validados usando Data Protection.
- Nao ha persistencia explicita das keys.
- Em ambientes efemeros, a key ring pode mudar entre deploys/instancias.

## Fluxo proposto

1. API inicia.
2. Data Protection usa o mesmo `EmprelyDbContext` da aplicacao.
3. Key ring e salvo na tabela `data_protection_keys`.
4. Depois de restart/deploy, a API le a mesma key ring do banco.
5. Tokens emitidos antes do restart continuam validos ate o prazo configurado.

## Regras de negocio

- Links de confirmacao, reset e alteracao de email devem continuar validos dentro do prazo prometido.
- O beta real nao deve depender de storage local da Lambda para tokens de email.
- A solucao inicial deve reaproveitar o Neon/Postgres para evitar mais um recurso operacional.

## Impactos tecnicos

- Adicionar suporte EF Core para Data Protection keys.
- Implementar `IDataProtectionKeyContext` no `EmprelyDbContext`.
- Configurar `AddDataProtection().SetApplicationName("Emprely").PersistKeysToDbContext<EmprelyDbContext>()`.
- Criar migration para a tabela `data_protection_keys`.
- Atualizar docs/runbooks para aplicar essa migration antes do beta.

## Riscos

- Se migrations nao forem aplicadas no banco real, a API pode falhar ao criar/ler keys em producao.
- Se environments diferentes compartilharem banco e application name, podem compartilhar key ring. No fluxo atual, cada ambiente deve ter banco proprio.
- Se a connection string apontar para banco errado, tokens podem falhar por key ring diferente.

## Duvidas

- No futuro, avaliar S3/Parameter Store se a estrategia de banco mudar.
