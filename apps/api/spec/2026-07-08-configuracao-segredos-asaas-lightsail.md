# Spec - Configuracao de segredos Asaas no Lightsail

Data: 2026-07-08

## Objetivo

Permitir preparar o ambiente privado da API para subir o billing Asaas com Pix hospedado e webhook ativo, usando os arquivos de segredo criados fora do repositorio.

## Escopo

- Script PowerShell para importar segredos Asaas para `lightsail.env`.
- Validacao do `lightsail.env` exigindo Asaas completo.
- `HttpClient` do provider Asaas com `User-Agent` explicito para compatibilidade com producao.
- Documentacao operacional no repo, Notion handoff e Obsidian handoff.

## Fora de escopo

- Versionar chaves Asaas reais.
- Alterar regra de billing, webhook ou checkout.
- Ativar cartao de credito.
- Publicar a API no servidor nesta spec.

## Arquivos privados esperados

Diretorio padrao: `D:\Emprely\Segredos`.

- `ASAAS-SANDBOX-API-KEYY.env`: deve conter `Asaas__BaseUrl` e `Asaas__ApiKey` sandbox.
- `ASAAS-PROD-API-KEYY.env`: deve conter `Asaas__BaseUrl` e `Asaas__ApiKey` producao.
- `ASAAS-TOKEN-WEBHOOK.env`: deve conter `Asaas__WebhookToken`.

## Comportamento

1. O operador escolhe o ambiente `Sandbox` ou `Production`.
2. O script le o arquivo de API key correspondente.
3. O script le o token de webhook.
4. O script atualiza o env privado de deploy com:
   - `Asaas__BaseUrl`
   - `Asaas__ApiKey`
   - `Asaas__WebhookToken`
   - `Asaas__CheckoutSuccessUrl`
   - `Asaas__CheckoutCancelUrl`
   - `Asaas__CheckoutExpiredUrl`
5. O script cria backup do env antes de salvar.
6. A saida do script nao mostra valores secretos.
7. O script escapa `$` em valores secretos para evitar interpolacao indevida do Docker Compose.
8. O script falha se `Production` apontar para URL sandbox ou se `Sandbox` apontar para URL nao sandbox.
9. Chamadas HTTP ao Asaas devem enviar `User-Agent`.
10. A validacao do Lightsail falha se Asaas estiver incompleto em env real.

## Comandos esperados

Sandbox:

```powershell
pnpm lightsail:asaas:sandbox
pnpm lightsail:env:validate
```

Producao:

```powershell
pnpm lightsail:asaas:prod
pnpm lightsail:env:validate
```

## Criterios de aceite

- Script atualiza o arquivo privado sem gravar secrets no repo.
- Validacao real exige `Asaas__BaseUrl`, `Asaas__ApiKey`, `Asaas__WebhookToken` e URLs de retorno.
- Documentacao informa os tres arquivos privados e o fluxo sandbox/producao.
- `pnpm validate:lightsail` continua funcionando com example e placeholders permitidos.
