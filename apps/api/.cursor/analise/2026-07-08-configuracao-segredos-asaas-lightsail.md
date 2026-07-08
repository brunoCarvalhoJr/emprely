# Analise - Configuracao de segredos Asaas no Lightsail

Data: 2026-07-08

## Contexto

O billing Asaas ja esta implementado na API e depende das variaveis:

- `Asaas__BaseUrl`
- `Asaas__ApiKey`
- `Asaas__WebhookToken`
- `Asaas__CheckoutSuccessUrl`
- `Asaas__CheckoutCancelUrl`
- `Asaas__CheckoutExpiredUrl`

O webhook ja foi configurado e salvo no painel Asaas. Os segredos foram criados fora do repositorio em `D:\Emprely\Segredos`:

- `ASAAS-SANDBOX-API-KEYY.env`
- `ASAAS-PROD-API-KEYY.env`
- `ASAAS-TOKEN-WEBHOOK.env`

## Estado atual do codigo

- `AsaasOptions` ja mapeia a secao `Asaas`.
- `docker-compose.api.yml` ja injeta `Asaas__BaseUrl`, `Asaas__ApiKey`, `Asaas__WebhookToken` e URLs de retorno na API.
- `lightsail.env.example` ja documenta variaveis Asaas sem secrets reais.
- `validate-lightsail-env.ps1` valida o env do Lightsail, mas ainda nao bloqueia env real sem Asaas completo.

## Riscos

- Copiar secrets reais para o repositorio.
- Subir API com chave sandbox quando a intencao for producao.
- Subir API sem `Asaas__WebhookToken`, fazendo o webhook salvo no painel retornar 401.
- Alterar manualmente `lightsail.env` e esquecer URLs de retorno do checkout.
- Chaves Asaas com `$` serem interpretadas pelo Docker Compose como interpolacao de variavel.
- Misturar chave de producao com `Asaas__BaseUrl` sandbox.
- Asaas producao recusar chamadas sem `User-Agent`.

## Decisao

Criar script operacional versionado que:

- le os tres arquivos privados em `D:\Emprely\Segredos`;
- escolhe sandbox ou producao explicitamente;
- atualiza o `lightsail.env` privado sem imprimir secrets;
- cria backup antes de alterar;
- grava as URLs de retorno padrao do checkout;
- escapa `$` em segredos para o formato aceito pelo Docker Compose;
- bloqueia combinacao de producao apontando para sandbox;
- configura `User-Agent` fixo no `HttpClient` do provider Asaas;
- permite validar o env antes de publicar a API.

Tambem reforcar a validacao do env Lightsail para exigir Asaas completo em ambiente real.

## Duvidas resolvidas por decisao operacional

- Os arquivos de segredo nao entram no repo.
- O repo deve conter apenas script, exemplos e documentacao.
- Para smoke inicial, usar sandbox; para vender de verdade, trocar para producao com o mesmo script.
