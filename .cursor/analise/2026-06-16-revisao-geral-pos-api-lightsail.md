# Analise - Revisao geral apos API no Lightsail

## Contexto

Em 2026-06-16, o projeto Emprely Orcamentos ja tinha:

- email Zoho `contato@emprely.com.br` configurado e testado;
- banco Neon Free criado e migrations aplicadas;
- bucket/CDN de assets/logos em S3 privado + CloudFront;
- API publicada no Lightsail em `https://api.emprely.com.br`;
- health checks da API validados com HTTP 200;
- scripts e runbooks iniciais para publicar o webapp em S3 + CloudFront.

Esta revisao foi feita antes do proximo passo de infraestrutura, que e publicar o webapp em `https://app.emprely.com.br`.

## Evidencias verificadas

- `pnpm.cmd --dir apps/web lint` passou.
- `powershell -ExecutionPolicy Bypass -File scripts/build-web-beta.ps1` passou e gerou `apps/web/dist` com `VITE_API_BASE_URL=https://api.emprely.com.br`.
- `dotnet build apps/api/Emprely.sln` passou sem erros.
- `dotnet test apps/api/Emprely.sln` passou apos ajuste no logger da factory de testes de integracao.
- `pnpm.cmd test:e2e:web` passou apos ajuste do wrapper E2E.
- `pnpm.cmd validate:mvp` passou.
- Arquivos sensiveis locais como `infra/docker/beta.env` aparecem ignorados pelo Git.
- Uploads locais em `apps/api/src/Emprely.Api/wwwroot/uploads/` aparecem ignorados pelo Git.

## Correcoes feitas durante a revisao

1. Testes de integracao no Windows
   - Problema: `dotnet test --no-build` falhava tentando escrever no Windows Event Log sem permissao.
   - Causa confirmada: com `Logging__EventLog__LogLevel__Default=None`, os testes passavam.
   - Correcao aplicada: `EmprelyApiFactory` agora limpa os providers de logging no TestHost.
   - Resultado: `dotnet test apps/api/Emprely.sln` passou com 47 unitarios e 13 de integracao.

2. Ruido local no Git
   - `.codex/` e `debug.log` foram adicionados ao `.gitignore`.
   - Objetivo: evitar commit acidental de artefatos locais da ferramenta.

3. Wrapper E2E web
   - Problema: os 5 testes Playwright apareciam como `ok`, mas `pnpm test:e2e:web` terminava com exit code 1 por timeout do wrapper.
   - Causa: `scripts/run-web-e2e.mjs` esperava o resumo `N passed`, mas a saida observada mostrava `ok N [chromium]`.
   - Correcao aplicada: o wrapper agora detecta o total em `Running N tests` e encerra com sucesso quando recebe o ultimo `ok N`.
   - Resultado: `pnpm.cmd test:e2e:web` e `pnpm.cmd validate:mvp` passaram.

## Achados principais

### P0 - Nada bloqueando build/teste local neste momento

Nao foi encontrado bloqueio tecnico novo em lint/build/testes locais depois das correcoes dos testes de integracao e do wrapper E2E.

Gate agregado validado:

```powershell
pnpm.cmd validate:mvp
```

### P1 - Webapp ainda nao publicado

O maior bloqueio real para beta continua sendo publicar o app web:

1. criar bucket S3 privado `emprely-app-web`;
2. subir `apps/web/dist`;
3. criar CloudFront com OAC;
4. configurar fallback SPA para `/suporte` e rotas internas;
5. configurar ACM/Route 53 para `app.emprely.com.br`;
6. validar login/cadastro/fluxo de proposta pelo dominio real.

Sem isso, a API ja esta no ar, mas o usuario final ainda nao tem a aplicacao SaaS publicada.

### P1 - Email transacional ainda esta como fake

`EmailTransacional__Provider=Fake` e aceitavel para smoke tecnico, mas nao para beta com usuario real se cadastro, confirmacao de email, recuperacao de senha ou suporte dependerem de envio real.

Decisao pendente:

- SES para transacional e Zoho apenas como caixa de entrada; ou
- outro provedor simples de envio; ou
- fallback operacional temporario sem confirmacao automatica.

### P1 - Falta aceite manual completo em ambiente real

Mesmo com testes locais passando, ainda falta validar manualmente no ambiente publicado:

- cadastro/login;
- perfil e upload de logo S3;
- cliente;
- servico;
- proposta;
- gerar PDF no navegador;
- WhatsApp;
- suporte publico `/suporte`;
- CORS real entre `app.emprely.com.br` e `api.emprely.com.br`;
- health checks apos restart do container.

### P1 - Falta AWS Budgets antes de liberar beta

Antes de chamar usuarios reais, criar alertas de custo na AWS, pelo menos US$ 5, US$ 10 e US$ 20.

### P2 - Muitos arquivos reais ainda estao nao versionados

O workspace tem muitos arquivos novos de specs, analises, migrations e implementacoes recentes ainda nao commitados.

Isso nao bloqueia o proximo passo tecnico, mas e risco operacional: antes de abrir beta ou continuar uma frente grande, revisar o `git status`, separar artefatos locais de mudancas reais e fazer commit organizado.

### P2 - Bundle web grande

O build Vite avisa que um chunk passa de 500 kB. Isso e esperado porque o app inclui geracao de PDF/imagem, mas fica registrado para futura otimizacao com code splitting.

Nao bloqueia beta inicial.

### P2 - Documentacao tem trechos antigos e alguns textos com encoding ruim

Ha documentos antigos ainda mencionando caminhos anteriores, Lambda ou fallback Docker em contexto historico. Os docs principais ja apontam para Lightsail + S3 + CloudFront, mas vale fazer uma rodada futura de limpeza editorial.

Tambem existem trechos com caracteres quebrados em alguns Markdown antigos. Nao bloqueia deploy, mas reduz qualidade da documentacao.

## Ordem recomendada a partir daqui

1. Publicar o webapp em S3 + CloudFront.
2. Validar CORS e fluxo MVP pelo dominio real.
3. Criar AWS Budgets.
4. Definir e implementar email transacional real ou fallback operacional.
5. Fazer aceite manual completo.
6. Revisar landing e apontar CTA/formulario para `https://app.emprely.com.br/suporte`.
7. Organizar commits do trabalho acumulado.
8. Depois disso, iniciar pagamentos/Plano Fundador e mobile.

## Decisao

Seguir com o deploy do webapp como proximo passo. Nao iniciar pagamentos, mobile ou grandes refatoracoes antes de publicar e validar o SaaS web em ambiente real.
