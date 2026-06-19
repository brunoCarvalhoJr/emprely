# Analise - Ajustes mobile do fluxo de nova proposta

## Contexto

No mobile, o fluxo de criacao de proposta ficou com excesso de controles persistentes: barra superior de etapas em formato horizontal/sticky, formulario dentro de cards sucessivos e uma barra inferior recolhivel/expansivel com acoes gerais.

## Problema

A tela pequena passa a competir pela atencao do usuario:

- o stepper horizontal ocupa area nobre e parece flutuar sobre o formulario;
- a barra inferior mistura acao primaria, preview, salvar e controle de recolher;
- o usuario precisa decidir entre `Proximo`, `Salvar`, `Preview` e `Recolher` antes de terminar a etapa;
- o conteudo do formulario fica visualmente comprimido por molduras e elementos fixos.

## Decisoes

- No mobile, o stepper completo deve virar um resumo compacto da etapa atual com barra de progresso.
- A lista completa de etapas deve ficar em painel expansivel, acionado por `Ver etapas`.
- O rodape mobile deve priorizar navegacao da etapa: `Voltar` e `Proximo`.
- `Salvar rascunho` e `Preview` devem virar acoes secundarias no topo/linha compacta, nao uma barra recolhivel.
- No desktop, preservar o stepper horizontal e a rail lateral existentes tanto quanto possivel.

## Fora do escopo

- Alterar API.
- Alterar regras de validacao de proposta.
- Remover funcionalidades de gerar, enviar, aceitar ou recusar propostas.

