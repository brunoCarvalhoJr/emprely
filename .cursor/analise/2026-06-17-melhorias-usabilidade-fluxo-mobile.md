# Analise - Melhorias de usabilidade do fluxo mobile

## Contexto

Teste mobile em 390x844 percorreu dashboard, cadastro de cliente, cadastro de servico, criacao de proposta, selecao de cliente, adicao de servico, revisao, salvamento e geracao.

## Achados principais

- A selecao de template nao aparece como etapa explicita do fluxo.
- Formularios de cliente e servico usam escala visual grande demais no mobile.
- Stepper da proposta ocupa muito espaco vertical.
- Na revisao, a acao final fica distante e exige rolagem longa.
- Toasts empilhados cobrem o preview no mobile.

## Direcao de melhoria

- Adicionar etapa explicita `Template` no wizard de proposta.
- Compactar stepper e cabecalhos no mobile.
- Fixar a area de acoes da revisao no rodape do painel em mobile.
- Exibir apenas o toast mais recente no mobile.

## Fora de escopo

- Reescrever a arquitetura do wizard.
- Alterar API.
- Criar app nativo.
