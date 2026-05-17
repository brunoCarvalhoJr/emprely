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
- Trial com marca d'água.
- Plano Fundador sem marca d'água.
- Trial tecnico inicial de 7 dias para contas novas.
- Ativacao manual administrativa do Plano Fundador no MVP, antes de billing real.
- Mensagem pronta para WhatsApp.

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

Grátis = ilimitado com marca d'água. Pago = ilimitado sem marca d'água.

Trial expirado bloqueia gerar, imprimir/PDF, WhatsApp e marcar proposta como enviada, mas mantém leitura de histórico, edição e decisão de propostas já enviadas.
