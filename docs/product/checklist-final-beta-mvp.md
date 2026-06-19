# Checklist final beta MVP - Emprely Orcamentos

## Objetivo

Este checklist define o estado atual do MVP antes de abrir um beta controlado. Ele nao substitui o runbook local; use este arquivo para decisao de prontidao e use `docs/product/beta-mvp-runbook.md` para execucao operacional.

## Status geral

- [x] Monorepo criado e organizado.
- [x] API em Clean Architecture.
- [x] Web em React, Vite, TypeScript e Tailwind.
- [x] Banco PostgreSQL local via Docker Compose.
- [x] Fluxo SDD documentado.
- [x] Convencao PortuguesIngles documentada.
- [x] Runbook beta local criado.
- [x] Gate automatizado criado em `pnpm validate:beta`.
- [x] Alias de decisao MVP criado em `pnpm validate:mvp`.

## Fluxos funcionais do MVP

- [x] Cadastro de usuario e conta.
- [x] Login com JWT.
- [x] Sessao web persistida com expiracao local.
- [x] Limpeza automatica da sessao em `401`.
- [x] Logout com limpeza de cache e formularios.
- [x] Troca de senha por usuario autenticado.
- [x] Consulta de conta atual.
- [x] Perfil profissional e dados da conta.
- [x] Cadastro e listagem de clientes.
- [x] Validacao de telefone/WhatsApp do cliente.
- [x] Cadastro e listagem de servicos.
- [x] Busca simples em clientes, servicos e propostas.
- [x] Criacao de proposta.
- [x] Cliente rapido durante criacao de proposta.
- [x] Titulo automatico de proposta.
- [x] Numero sequencial de proposta por conta.
- [x] Preview de proposta.
- [x] Geracao de proposta.
- [x] Impressao/PDF pelo navegador.
- [x] Compartilhamento por WhatsApp.
- [x] Historico simples de propostas.
- [x] Duplicacao de proposta.
- [x] Marcar proposta como enviada.
- [x] Marcar proposta enviada como aceita ou recusada.
- [x] Bloqueio de edicao direta para proposta enviada, aceita ou recusada.
- [x] Confirmacao antes de editar proposta gerada, avisando retorno para rascunho.
- [x] Arquivamento logico de propostas fora da listagem principal.

## Regras comerciais

- [x] Trial tecnico inicial de 7 dias para contas novas.
- [x] Trial expirado bloqueia geracao, impressao/PDF, WhatsApp e envio de proposta.
- [x] Trial expirado bloqueia exportacao de imagem e compartilhamento comercial.
- [x] Trial expirado mantem leitura do historico, visualizacao interna, criacao de rascunhos, clientes e servicos.
- [x] Trial expirado permite duplicar proposta, mas a copia nasce como rascunho e nao pode ser gerada/enviada sem ativacao.
- [x] Trial ativo exibe marca d'água discreta.
- [x] Trial expirado exibe marca d'água grande atravessando a proposta.
- [x] Dashboard e tela de propostas exibem banner de trial expirado com CTA “Ativar plano”.
- [x] Plano Fundador remove bloqueios comerciais do MVP.
- [x] Ativacao de Plano Fundador e administrativa, nao pelo usuario final.
- [x] Endpoint antigo de autoativacao de Fundador retorna `403`.
- [x] API retorna `409 Conflict` para conflitos de status de proposta.

## Prontidao tecnica beta

- [x] `GET /health` disponivel.
- [x] `GET /health/live` disponivel.
- [x] `GET /health/ready` valida acesso ao banco.
- [x] Swagger/OpenAPI em ambiente local.
- [x] CORS configuravel por ambiente.
- [x] `VITE_API_BASE_URL` obrigatorio fora de desenvolvimento local.
- [x] Exemplo de configuracao staging documentado.
- [x] Chave admin documentada fora do repositorio.
- [x] Rate limit aplicado em rotas de auth/admin.
- [x] Headers de seguranca basicos na API.
- [x] Docker Compose validado no gate como smoke local/fallback.
- [x] Kit Docker versionado para validacao local, smoke e plano B temporario.
- [x] Build e smoke runtime Docker validados localmente.
- [x] Geracao e validacao local de `infra/docker/beta.env` automatizadas.
- [x] Mapa de dominios definido: landing, app e API.
- [x] Spec SDD de deploy Lightsail baixo custo criada.
- [x] API preparada para rodar atras de Caddy no Lightsail, com Lambda mantido como alternativa futura.
- [x] Upload de logomarca preparado para Local/S3/Disabled, com S3 como provider recomendado no beta.
- [x] Formulario publico de suporte/interesse criado em `/suporte`, com envio para `contato@emprely.com.br`.
- [x] Data Protection keys persistidas no Postgres via `data_protection_keys`, para links de confirmacao/reset sobreviverem a restart/deploy.
- [x] Amazon SES em `us-east-1` configurado para envio transacional por `contato@emprely.com.br`.
- [x] Domínio `emprely.com.br` verificado no SES, com acesso à produção concedido e envio real validado.
- [x] Template central de e-mails transacionais criado/revisado com logo real, botão, fallback e copy pt-BR.
- [x] Build da API validado em 2026-06-17 após revisão dos templates transacionais.
- [x] Banco Neon Free criado e migrations aplicadas.
- [x] Bucket/CDN de assets/logos criado e validado com S3 privado + CloudFront.
- [x] API publicada em Lightsail com Docker Compose + Caddy.
- [x] `https://api.emprely.com.br/health/live` e `/health/ready` validados com HTTP 200.
- [x] E2E web principal com API mockada.
- [x] Testes unitarios da API.
- [x] Testes de integracao da API.
- [x] Lint web validado em 2026-06-16.
- [x] Build beta web validado em 2026-06-16 com `VITE_API_BASE_URL=https://api.emprely.com.br`.
- [x] `dotnet test apps/api/Emprely.sln` validado em 2026-06-16 apos ajuste do logger dos testes de integracao.
- [x] E2E web validado em 2026-06-16 apos ajuste do wrapper `scripts/run-web-e2e.mjs`.
- [x] `pnpm validate:mvp` validado em 2026-06-16.

## Bloqueante antes de beta real

- [x] Criar/confirmar DNS de `api.emprely.com.br`.
- [x] Criar banco Neon Free e guardar connection string fora do repositorio.
- [x] Aplicar migrations no banco Neon.
- [x] Criar instancia Lightsail Linux US$7/mes com IP estatico.
- [x] Instalar Docker e Docker Compose plugin no Lightsail.
- [x] Criar arquivo privado `/opt/emprely/orcamentos/lightsail.env` no servidor.
- [x] Criar bucket/CDN de assets para logos e configurar `LogoPerfilStorage__Provider=S3`.
- [x] Configurar credenciais AWS com permissao minima para escrita no bucket/prefixo de logos.
- [x] Buildar imagem da API localmente e enviar para o Lightsail.
- [x] Subir API + Caddy com `infra/lightsail/docker-compose.api.yml`.
- [x] Buildar web beta localmente com `VITE_API_BASE_URL=https://api.emprely.com.br`.
- [x] Criar bucket S3 privado `emprely-app-web`.
- [x] Publicar `apps/web/dist` no bucket S3 `emprely-app-web`.
- [ ] Criar/confirmar DNS de `app.emprely.com.br`.
- [ ] Criar CloudFront/OAC para servir o bucket privado `emprely-app-web`.
- [ ] Configurar certificado TLS/CloudFront para `app.emprely.com.br`.
- [x] Configurar CORS real da API para `https://app.emprely.com.br`.
- [ ] Validar CORS pelo webapp publicado em `https://app.emprely.com.br`.
- [ ] Criar AWS Budgets/alertas de custo.
- [x] Guardar secrets reais fora do repositorio e do chat.
- [x] Configurar e validar email transacional real via SES.
- [ ] Fazer deploy da nova imagem da API com templates transacionais revisados.
- [ ] Revalidar confirmação de e-mail, recuperação de senha e suporte em Gmail e Hotmail após deploy.
- [ ] Rodar aceite manual completo com dados reais de teste.
- [ ] Rodar aceite manual especifico de ciclo de proposta/trial: editar `Gerada`, bloquear `Enviada`/`Aceita`/`Recusada`, duplicar, expirar trial, validar watermark grande e CTA “Ativar plano”.
- [ ] Validar envio de WhatsApp em dispositivo real do usuario beta.
- [ ] Definir processo manual de suporte para ativacao Plano Fundador.
- [ ] Linkar CTA/formulario da landing para `https://app.emprely.com.br/suporte` apos publicar o webapp.
- [ ] Definir lista inicial de usuarios beta e criterio de feedback.

## Adiado para o fim do MVP

- [ ] Ajuste fino de layout.
- [ ] Prints comerciais.
- [ ] Imagens finais.
- [ ] Revisao visual detalhada de PDF/impressao.
- [ ] Polimento de landing.

## Fora do MVP atual

- [ ] Billing/checkout real.
- [ ] CRM completo.
- [ ] ERP.
- [ ] Nota fiscal.
- [ ] Contratos avancados.
- [ ] IA.
- [ ] Mobile Expo implementado.
- [ ] Kubernetes ou microservicos.

## Gate automatizado

Execute na raiz:

```powershell
pnpm validate:mvp
```

O comando deve validar:

- lint do web;
- build do web;
- E2E web;
- build da API;
- testes da API;
- configuracao do Docker Compose local/fallback.

Observacao: se o ambiente nao tiver .NET SDK disponivel, `pnpm validate:mvp`/`dotnet test` nao consegue validar a API. Nesse caso, instalar/restaurar o SDK antes de considerar o gate concluido.

## Decisao atual

Em 2026-06-17, o envio transacional real via SES já funciona com `contato@emprely.com.br`, e a API compila com os templates transacionais revisados. Para beta real, os próximos bloqueios são: publicar a nova imagem da API no Lightsail, revalidar os e-mails reais, criar CloudFront/OAC para o webapp, configurar `app.emprely.com.br`, validar o fluxo completo pelo domínio real e criar alertas de custo. As pendências visuais ficam explicitamente adiadas para a etapa final, conforme decisão atual do projeto.
