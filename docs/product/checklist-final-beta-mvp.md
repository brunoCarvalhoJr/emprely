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

## Regras comerciais

- [x] Trial tecnico inicial de 7 dias para contas novas.
- [x] Trial expirado bloqueia geracao, impressao/PDF, WhatsApp e envio de proposta.
- [x] Trial expirado mantem leitura do historico e edicao basica.
- [x] Plano Fundador remove bloqueios comerciais do MVP.
- [x] Ativacao de Plano Fundador e administrativa, nao pelo usuario final.
- [x] Endpoint antigo de autoativacao de Fundador retorna `403`.

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
- [x] Docker Compose validado no gate.
- [x] Kit Docker beta/staging versionado para API, web e PostgreSQL.
- [x] Build e smoke runtime Docker beta/staging validados localmente.
- [x] Geracao e validacao local de `infra/docker/beta.env` automatizadas.
- [x] Mapa de dominios definido: landing, app e API.
- [x] E2E web principal com API mockada.
- [x] Testes unitarios da API.
- [x] Testes de integracao da API.

## Bloqueante antes de beta real

- [ ] Criar/confirmar DNS de `app.emprely.com.br` e `api.emprely.com.br`.
- [ ] Provisionar ambiente beta/staging real para API, web e banco.
- [ ] Ajustar `infra/docker/beta.env` com URLs reais do beta/staging, se mudarem.
- [ ] Guardar secrets reais fora do repositorio e do chat.
- [ ] Gerar imagens de API/web com as URLs reais do beta.
- [ ] Aplicar migrations no banco beta/staging.
- [ ] Rodar aceite manual completo com dados reais de teste.
- [ ] Validar envio de WhatsApp em dispositivo real do usuario beta.
- [ ] Definir processo manual de suporte para ativacao Plano Fundador.
- [ ] Definir lista inicial de usuarios beta e criterio de feedback.

## Adiado para o fim do MVP

- [ ] Ajuste fino de layout.
- [ ] Prints comerciais.
- [ ] Imagens finais.
- [ ] Revisao visual detalhada de PDF/impressao.
- [ ] Polimento de landing.

## Fora do MVP atual

- [ ] Billing/checkout real.
- [ ] Recuperacao de senha por email.
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
- configuracao do Docker Compose.

## Decisao atual

O MVP esta pronto para consolidacao de beta local/controlado quando `pnpm validate:mvp` passar e os itens bloqueantes de ambiente forem resolvidos. As pendencias visuais ficam explicitamente adiadas para a etapa final, conforme decisao atual do projeto.
