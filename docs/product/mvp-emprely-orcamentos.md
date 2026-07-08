# MVP Emprely Orçamentos

## Objetivo

Criar uma primeira versão funcional capaz de gerar propostas profissionais, prints reais e validação do fluxo comercial.

## Entra no MVP

- Cadastro/login.
- Conta/organização.
- Perfil profissional e marca.
- Clientes.
- Validacao de telefone/WhatsApp do cliente.
- Serviços e pacotes.
- Criação guiada de proposta.
- Criacao rapida de cliente dentro da proposta.
- Primeiros passos no dashboard para conta nova.
- Resumo de prontidao beta no dashboard.
- E2E leve do fluxo web principal com API mockada.
- Sessao web robusta com expiração local, logout limpo e limpeza automatica em `401`.
- Troca de senha para usuario autenticado.
- Hardening beta da API com headers de seguranca e rate limit em auth/admin.
- Runbook beta local e validacao `pnpm validate:beta`.
- Prontidao beta/staging com CORS configuravel, readiness de banco e variaveis por ambiente.
- Titulo automatico na criacao da proposta.
- Numero automatico por conta para cada proposta.
- Preview visual.
- Histórico simples.
- Busca simples em clientes, servicos e propostas.
- Exportação PDF/imagem.
- Trial ativo com marca d'água discreta.
- Trial expirado com marca d'água grande na visualização interna.
- Plano Fundador sem marca d'água.
- Trial tecnico inicial de 7 dias para contas novas.
- Ativacao manual administrativa do Plano Fundador foi substituida por billing Asaas e credito manual temporario via Super Admin.
- Mensagem pronta para WhatsApp.
- Regras de ciclo de vida de proposta aplicadas no frontend e na API.
- Bloqueio de edicao direta para propostas enviadas, aceitas ou recusadas.
- Duplicacao de propostas travadas para criar nova versao como rascunho.

## Fora do MVP

- CRM completo.
- ERP.
- Nota fiscal.
- Contratos avançados.
- IA.
- Checkout complexo antes do produto demonstrável.
- Microserviços.
- Kubernetes.

## Regra central

Trial ativo = ilimitado com marca d'água discreta. Plano ativo = ilimitado sem marca d'água.

Trial expirado bloqueia gerar, imprimir/PDF, exportar imagem, WhatsApp e marcar proposta como enviada. Mantem leitura de historico, visualizacao interna com marca d'água grande, criacao de clientes, servicos e rascunhos, alem de duplicacao de propostas.

## Regras de proposta V1

- `Rascunho`: editavel.
- `Gerada`: editavel; ao salvar volta para `Rascunho` e precisa ser gerada novamente.
- `Enviada`, `Aceita` e `Recusada`: nao sao editaveis diretamente; usuario deve duplicar para criar nova versao.
- `Aceita` e `Recusada`: decisoes finais na V1.
- `Arquivada`: sai da listagem principal e nao aceita novas acoes comerciais.
- A API retorna `409 Conflict` para acoes bloqueadas por regra de status.
- O CTA publico de upgrade deve usar “Ativar plano”; o nome interno `Fundador` pode permanecer no dominio/API nesta etapa.
