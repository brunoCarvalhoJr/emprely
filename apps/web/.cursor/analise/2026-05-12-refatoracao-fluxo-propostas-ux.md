# Analise Web - Refatoracao do fluxo de propostas e usabilidade

## Contexto

Clientes, servicos e propostas ja estao sendo cadastrados e salvos. O problema relatado esta no fluxo posterior: propostas salvas no historico nao oferecem as mesmas acoes de imprimir/PDF e WhatsApp que a proposta recem montada no formulario.

## Objetivo da tela/fluxo

Permitir que uma proposta salva e gerada seja reutilizada a partir do historico sem depender do estado atual do formulario. O usuario deve conseguir gerar, imprimir/salvar PDF pelo navegador e abrir WhatsApp diretamente no card da proposta salva.

## Rotas impactadas

- App autenticado em `appView === "propostas"`.
- Atalhos de `dashboard`, `clientes` e `servicos` que afetam a criacao de proposta.

## Componentes impactados

- `App`
- `DashboardContent`
- `PreviewPropostaVisual`
- Lista de clientes
- Lista de servicos
- Lista de propostas

## Formulario e validacao

- O formulario de proposta continua sendo a fonte de edicao.
- Propostas salvas e geradas passam a ter acoes diretas no historico.
- O preview impresso deve usar snapshot salvo quando a acao vier de uma proposta salva.
- Ao selecionar/limpar fluxos com alteracoes locais, a interface deve pedir confirmacao antes de descartar.

## Dados e chamadas de API

- `POST /api/proposals/{id}/generate` continua sendo usado para gerar proposta.
- `GET /api/proposals` ja retorna dados suficientes para imprimir e compartilhar.
- Nao ha necessidade de alterar API nesta etapa.

## Achados da analise

- Dashboard abre fluxos sem limpar selecao anterior.
- Lista de propostas salvas exibe apenas `Editar` e `Arquivar`, escondendo `Imprimir/PDF` e `WhatsApp`.
- WhatsApp usa a proposta salva, enquanto impressao usa o preview do formulario.
- `isDirty` pode bloquear acoes de proposta salva mesmo quando a proposta remota esta gerada.
- Arquivamento ocorre sem confirmacao e sem avisar impacto.
- Clientes nao possuem caminho direto para criar proposta.
- Itens selecionados nao ficam visualmente destacados na lista.

## Decisoes

- Criar um snapshot de proposta para acao de impressao, independente do formulario.
- Adicionar `Gerar`, `Imprimir/PDF` e `WhatsApp` diretamente no historico de propostas.
- Usar `window.print()` sincronizado com o snapshot salvo.
- Renomear a acao visual para `Abrir WhatsApp`, deixando claro que nao marca envio automatico.
- Adicionar confirmacao simples para arquivar cliente, servico e proposta.
- Adicionar atalho `Criar proposta` no card de cliente.
- Limpar selecao ao abrir fluxos pelo dashboard.

## Perguntas

Nao ha duvida bloqueante. Exportacao PDF server-side, link publico e status `Enviada` ficam para incremento futuro.

## Riscos

- `window.print()` depende do navegador e do destino de impressao escolhido pelo usuario.
- Cliente ou servico arquivado ainda pode exigir regra de dominio mais forte em uma etapa futura.
