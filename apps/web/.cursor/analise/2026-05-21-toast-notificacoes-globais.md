# Analise - Toast de notificacoes globais

## Contexto

As mensagens de sucesso do sistema apareciam como banners dentro das telas. No fluxo de proposta, a mesma mensagem podia aparecer no topo do painel e novamente no fim do formulario, gerando duplicidade e ocupando espaco do conteudo principal.

## Decisao

Centralizar notificacoes transientes em um toast flutuante no canto superior direito:

- mensagens somem automaticamente em 3 segundos;
- cada toast tem barra visual de tempo;
- o usuario pode fechar manualmente pelo botao X;
- banners de sucesso deixam de ser renderizados dentro das telas;
- mensagens de erro de formulario continuam inline, porque ajudam a corrigir campos ou acoes especificas.

## Fora de escopo

- Nao alterar regras de negocio das mutacoes.
- Nao alterar os textos atuais das notificacoes.
- Nao transformar erros de campo em toast.
