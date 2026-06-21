# Analise - Preview, refresh e botao voltar no app

## Contexto

Durante uso assistido do `app.emprely`, foram identificados tres problemas de UX:

- preview de template precisa abrir com o documento inteiro visivel e permitir zoom;
- refresh da pagina autenticada sempre volta ao dashboard;
- botao voltar do navegador fecha o app em vez de fechar modal, voltar etapa ou permanecer no fluxo.

## Diagnostico tecnico

O webapp centraliza a navegacao em estado React (`appView`, modos CRUD e modais), sem rota por tela. Como `appView` inicia com `"dashboard"` e nao ha restauracao por `sessionStorage`/URL, qualquer reload perde o contexto. Tambem nao existe coordenacao com `window.history`, entao o botao voltar do navegador opera sobre o historico externo do browser e pode sair do app.

Os previews ja possuem parte da estrutura visual de zoom via CSS/radio, mas o preview do template de personalizacao ainda nao tem controles equivalentes ao preview de proposta. O modo "inteiro" tambem depende de escala fixa, o que funciona em mobile mas pode melhorar no desktop.

## Decisoes

- Persistir um snapshot leve de navegacao autenticada em `sessionStorage`, sem salvar dados sensiveis de formularios.
- Restaurar tela, modo CRUD, IDs selecionados e etapa do assistente apos refresh.
- Criar uma guarda de historico para usuarios autenticados e tratar `popstate` dentro do app.
- No `popstate`, fechar modal primeiro; depois voltar etapa/assistente; depois voltar para lista; depois manter o usuario dentro do app.
- Adicionar controles de zoom ao preview de template de personalizacao e abrir sempre em modo "Inteiro".

## Fora de escopo

- Nao alterar contratos de API.
- Nao salvar conteudo digitado em formularios nao persistidos.
- Nao converter o app para roteamento completo por URL nesta rodada.

