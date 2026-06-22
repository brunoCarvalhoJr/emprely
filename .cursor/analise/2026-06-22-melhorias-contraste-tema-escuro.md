# Analise - Contraste do tema escuro

## Contexto

O tema escuro ainda apresenta blocos com fundo branco/cinza claro em telas centrais do Emprely, principalmente em Perfil da conta, Personalizacao e fluxo de Nova proposta.

## Problemas apontados

- Checklist de perfil aparece com painel branco e textos de baixo contraste.
- Card de logomarca e formatos da logo ficam claros demais no tema escuro.
- Paleta da proposta e aviso de cores estaticas misturam fundo claro com texto pouco legivel.
- Cards de template na personalizacao usam miniaturas claras, mas o entorno precisa ficar escuro e com contraste consistente.
- Sections opcionais da proposta, como `Detalhes opcionais da mensagem`, `Desconto e pagamento` e `Escopo, cronograma e beneficios`, ficam cinza claro/branco no tema escuro.
- Regras mobile no fim do CSS sobrescrevem parte dos overrides dark e reintroduzem fundo branco no fluxo da proposta.
- Modal de preview de template ainda usa toolbar e palco claros no tema escuro, criando um contraste abrupto com o restante do app.

## Decisao tecnica

Corrigir por CSS de tema, sem alterar contratos de API, banco ou estrutura de componentes:

- adicionar overrides `:root[data-theme="dark"]` para cards de conta, logomarca, checklist, paleta, formatos e templates;
- reforcar contraste de texto, helper, badges e bordas no dark;
- corrigir sections opcionais e corpos internos do fluxo de proposta;
- neutralizar overrides mobile que forcam branco quando o tema escuro estiver ativo;
- manter miniaturas dos templates claras quando representam o documento/preview, mas o container ao redor deve estar adequado ao dark.
- escurecer o entorno da modal de preview de template no tema escuro, mantendo apenas a pagina do documento branca para preservar a fidelidade do PDF/proposta.

## Criterios de aceite

- Nenhum painel funcional principal deve ficar com fundo branco puro no tema escuro.
- Textos em cards e detalhes opcionais devem ficar legiveis sem depender de selecao/hover.
- Fluxo de proposta no desktop e mobile deve manter fundo escuro nas sections e details.
- Modal de preview de template deve respeitar o tema escuro no chrome da modal, toolbar, controles e palco; o documento renderizado pode permanecer branco.
- Tema claro nao deve ser alterado visualmente.
- Lint e build do web devem passar.
