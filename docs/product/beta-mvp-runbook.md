# Runbook beta local - Emprely Orcamentos

## Objetivo

Preparar e validar o MVP em ambiente local antes de abrir testes beta. Este runbook nao cobre prints, imagens nem polimento final de layout.

## Pre-requisitos

- .NET SDK 9.
- Node.js com Corepack/pnpm.
- Docker com Compose.
- PostgreSQL local via `docker-compose.yml` da raiz.

## Variaveis e configuracao

### Web

Arquivo: `apps/web/.env`

```txt
VITE_API_BASE_URL=http://localhost:5262
```

O arquivo `apps/web/.env.example` ja contem o valor padrao.

### API

Em desenvolvimento, a API usa `apps/api/src/Emprely.Api/appsettings.Development.json`.

Connection string local padrao:

```txt
Host=localhost;Port=5432;Database=emprely;Username=emprely;Password=emprely_dev
```

A chave JWT atual e somente de desenvolvimento. Nao reutilizar em beta publico ou producao.

Origens CORS locais ficam em `appsettings.Development.json`:

```txt
Cors:OrigensPermitidas = http://localhost:5173, http://127.0.0.1:5173
```

## Configuracao beta/staging

Nao use secrets dev em beta/staging. Configure pelo host ou provedor de deploy:

```txt
ASPNETCORE_ENVIRONMENT=Staging
ASPNETCORE_URLS=http://0.0.0.0:8080
ConnectionStrings__EmprelyDb=Host=<host>;Port=5432;Database=emprely;Username=<usuario>;Password=<senha>
Jwt__Issuer=Emprely
Jwt__Audience=Emprely.Web
Jwt__SigningKey=<chave-com-pelo-menos-32-caracteres>
Jwt__ExpirationMinutes=120
Cors__OrigensPermitidas__0=https://app.emprely.com.br
Cors__OrigensPermitidas__1=https://www.emprely.com.br
Cors__OrigensPermitidas__2=https://emprely.com.br
AdminOperacoes__OperationsKey=<chave-admin-com-pelo-menos-32-caracteres>
AdminPainel__OwnerEmail=Bruno.jr.ti@hotmail.com
RateLimit__AuthPermitLimit=30
RateLimit__AdminPermitLimit=10
RateLimit__WindowSeconds=60
EmailTransacional__Provider=SES
EmailTransacional__FromEmail=contato@emprely.com.br
EmailTransacional__FromName=Emprely
EmailTransacional__SesRegion=us-east-1
EmailTransacional__SuporteDestinoEmail=contato@emprely.com.br
VITE_API_BASE_URL=https://api.emprely.com.br
```

Arquivos de exemplo:

- `apps/api/src/Emprely.Api/appsettings.Staging.example.json`
- `apps/web/.env.example`
- `infra/docker/beta.env.example`
- `infra/lightsail/lightsail.env.example`

Guia de deploy beta/staging:

- `docs/product/beta-staging-deploy.md`
- `docs/product/webapp-s3-cloudfront-deploy.md`

Mapa de dominios:

- `docs/architecture/dominios-ambientes.md`

Geracao do env privado:

```powershell
pnpm beta:env:new
pnpm beta:env:validate
```

## Subir ambiente local

Execute a partir da raiz do monorepo:

```powershell
docker compose up -d postgres
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
dotnet run --project apps/api/src/Emprely.Api/Emprely.Api.csproj --launch-profile http
pnpm --dir apps/web dev --host 127.0.0.1 --port 5173
```

URLs locais:

- Web: `http://localhost:5173`
- API: `http://localhost:5262`
- Health: `http://localhost:5262/health`
- Liveness: `http://localhost:5262/health/live`
- Readiness: `http://localhost:5262/health/ready`

## Reset opcional do banco dev

Este comando apaga os dados locais do PostgreSQL do Docker Compose:

```powershell
docker compose down -v
docker compose up -d postgres
dotnet ef database update --project apps/api/src/Emprely.Infrastructure --startup-project apps/api/src/Emprely.Api
```

Use somente quando quiser recomeçar o ambiente local do zero.

## Validacao automatizada

Execute:

```powershell
pnpm validate:beta
```

Esse comando valida:

- lint do web;
- build do web;
- E2E leve do fluxo web com API mockada;
- build da API;
- testes unitarios e de integracao da API;
- sintaxe do Docker Compose.

Para validar tambem o compose beta/staging:

```powershell
pnpm validate:deploy
```

Para validar build das imagens, runtime temporario, migrations e health checks do beta/staging:

```powershell
pnpm validate:deploy:runtime
```

## Validacao operacional

Antes de liberar um beta/staging:

- `GET /health/live` deve retornar 200.
- `GET /health/ready` deve retornar 200 com banco acessivel.
- Cadastro, login, cliente, servico, proposta, gerar, WhatsApp e aceite comercial devem passar no fluxo manual.
- Proposta `Gerada` deve pedir confirmacao antes de edicao e voltar para `Rascunho` ao salvar.
- Propostas `Enviada`, `Aceita` e `Recusada` nao devem abrir edicao direta; a UI deve orientar duplicacao.
- Chamada direta de `PUT /api/proposals/{id}` para proposta `Enviada`, `Aceita` ou `Recusada` deve retornar `409 Conflict`.
- Trial ativo deve exibir marca d'água discreta no documento/preview.
- Trial expirado deve exibir banner no dashboard e em propostas com CTA “Ativar plano”.
- Trial expirado deve exibir marca d'água grande atravessando a proposta na visualizacao interna.
- Trial expirado deve bloquear gerar, imprimir/PDF, exportar imagem, WhatsApp e envio, mantendo criacao de cliente, servico, rascunho e duplicacao.
- Logout deve limpar a sessao e voltar para o formulario de acesso.
- Sessao expirada deve voltar para login com a mensagem `Sessao expirada. Entre novamente.`.
- Troca de senha logada deve retornar sucesso e permitir login futuro com a nova senha.
- `Cors__OrigensPermitidas__0` deve apontar para a URL real do webapp.
- `Cors__OrigensPermitidas__1` e `Cors__OrigensPermitidas__2` devem permitir a landing publicar contatos via API.
- `VITE_API_BASE_URL` deve apontar para a URL real da API.
- `AdminOperacoes__OperationsKey` deve estar configurada e guardada fora do repositorio.
- `AdminPainel__OwnerEmail` deve apontar para o dono principal do painel admin.
- `RateLimit__AuthPermitLimit`, `RateLimit__AdminPermitLimit` e `RateLimit__WindowSeconds` devem estar definidos para o volume esperado do beta.
- SES deve estar configurado como provedor transacional real para `contato@emprely.com.br`.
- Confirmação de e-mail, recuperação de senha e suporte devem usar o template central revisado em português brasileiro.
- Respostas da API devem conter `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy`.

## Ativar Plano Fundador manualmente

No MVP, o usuario final nao ativa Plano Fundador sozinho. A operacao preferencial agora e pelo painel administrativo em:

```txt
http://localhost:5173/admin
https://app.emprely.com.br/admin
```

O owner principal e definido por `AdminPainel__OwnerEmail`. Se ainda nao existir admin para esse email, usar o bootstrap do owner pela tela admin; depois disso, usar login administrativo normal.

O endpoint legado por chave administrativa continua disponivel para manutencao tecnica:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://api.emprely.com.br/api/admin/accounts/<contaId>/activate-founder" `
  -Headers @{ "X-Emprely-Admin-Key" = "<chave-admin>" }
```

Resultado esperado:

- `plano = Fundador`
- `statusComercial = FundadorAtivo`
- `planoFundadorAtivadoAt` preenchido

## Aceite manual beta

Com API, banco e web rodando:

- Criar conta nova.
- Confirmar e-mail recebido via SES.
- Solicitar recuperação de senha e confirmar recebimento via SES.
- Conferir dashboard, primeiros passos e prontidao beta.
- Configurar perfil da conta.
- Cadastrar cliente com telefone valido.
- Cadastrar servico.
- Criar proposta com item do catalogo.
- Gerar proposta.
- Editar proposta gerada, confirmar aviso e validar retorno para rascunho depois de salvar.
- Gerar novamente a proposta editada.
- Conferir botoes de WhatsApp e marcar enviada.
- Confirmar que proposta enviada nao abre edicao direta e orienta duplicacao.
- Marcar proposta enviada como aceita ou recusada.
- Confirmar que proposta aceita/recusada nao pode ser editada diretamente.
- Duplicar proposta e confirmar que nasce como rascunho.
- Expirar trial de uma conta de teste e confirmar bloqueio de gerar/enviar/exportar, banner “Ativar plano” e marca d'água grande.
- Ativar Plano Fundador pela operacao admin e confirmar remocao de bloqueio comercial.
- Trocar senha do usuario logado e confirmar acesso futuro com a nova senha.
- Acessar `/admin` com admin separado.
- Listar usuarios/contas, abrir detalhe lateral e validar metricas.
- Criar usuario de teste sem conta e confirmar que ele nao acessa o painel normal.
- Criar usuario de teste com conta owner obrigatoria.
- Bloquear usuario de teste e confirmar que novo login retorna bloqueio.
- Desbloquear usuario de teste e confirmar login.
- Adicionar dias gratis em conta de teste e confirmar status comercial.
- Exportar CSV e confirmar que a acao aparece na auditoria.

## Itens fora desta rodada

- Checkout/billing real.
- Teste visual final.
- Ajuste de prints e imagens.
