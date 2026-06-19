# Lightsail API - Emprely

Este kit sobe somente a API do Emprely no Lightsail. O webapp continua em S3 + CloudFront e o banco fica no Neon Free.

## Arquivos

- `docker-compose.api.yml`: API ASP.NET Core + Caddy.
- `Caddyfile`: HTTPS automatico para `api.emprely.com.br`.
- `lightsail.env.example`: variaveis esperadas sem secrets reais, incluindo SES e S3.

## Fluxo recomendado

1. Criar instancia Lightsail Linux US$7/mes.
2. Atribuir IP estatico.
3. Apontar `api.emprely.com.br` no Route 53 para esse IP.
4. Instalar Docker e Docker Compose plugin no servidor.
5. Criar `/opt/emprely/orcamentos/lightsail.env` no servidor a partir de `lightsail.env.example`.
6. Buildar a imagem da API localmente:

```powershell
pnpm lightsail:api:build
```

7. Enviar imagem e arquivos de compose para o servidor:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-lightsail-api-image.ps1 `
  -SshHost "<ip-ou-host>" `
  -User "ubuntu" `
  -KeyPath "C:\caminho\chave.pem" `
  -EnvFile "C:\caminho\lightsail.env" `
  -RemoteDirectory "/opt/emprely/orcamentos"
```

O script carrega a imagem no servidor e executa:

```bash
sudo docker compose -f docker-compose.api.yml --env-file lightsail.env up -d
```

## Validacoes

```powershell
Invoke-RestMethod https://api.emprely.com.br/health/live
Invoke-RestMethod https://api.emprely.com.br/health/ready
```

## Observacoes

- Para beta com usuarios reais, use `EmailTransacional__Provider=SES`.
- O SES esta configurado em `us-east-1` com remetente `contato@emprely.com.br`; Zoho fica como caixa manual para leitura e respostas humanas.
- `EmailTransacional__Provider=Fake` nao envia email real. Use apenas para smoke tecnico local.
- `LogoPerfilStorage__Provider=S3` exige credenciais AWS com permissao minima de escrita no bucket/prefixo de logos.
- O envio via SES exige credenciais AWS com permissao minima para `ses:SendEmail`/`ses:SendRawEmail` na regiao `us-east-1`.
- `ALLOWED_HOSTS` deve incluir `localhost` e `127.0.0.1`, porque o healthcheck interno do container chama a API localmente.
- A URL publica inicial dos assets e o dominio padrao do CloudFront `https://dz3i7ivpc873w.cloudfront.net`; `assets.emprely.com.br` fica como melhoria posterior.
- Nao buildar a imagem dentro do Lightsail US$7/mes; o plano tem pouca memoria para build Docker confiavel.

## Estado em 2026-06-17

- Banco Neon criado e migrations aplicadas.
- S3/CloudFront de assets criado para logos em `emprely-assets-beta`.
- Webapp publicado em S3 + CloudFront com dominio `https://app.emprely.com.br`.
- API configurada para rodar no Lightsail em `https://api.emprely.com.br`.
- SES validado em producao para envio real por `contato@emprely.com.br`.
- Templates transacionais foram centralizados na API com HTML responsivo, CTA, fallback de link, textos revisados em pt-BR e logo oficial.

Proximo passo operacional: gerar nova imagem da API, subir no Lightsail e revalidar confirmacao de e-mail, recuperacao de senha e suporte publico em Gmail e Hotmail.
