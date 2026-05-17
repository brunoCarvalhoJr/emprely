# Analise - Shell fixo, footer e acoes rapidas no menu

## Contexto

O usuario pediu correcoes de layout no SaaS web:

- Sidebar e barra superior devem ficar fixas enquanto apenas a pagina/conteudo rola.
- Footer deve ter logo Emprely, direitos centralizados e suporte/email como botoes com icone e tooltip.
- O menu nao deve ter item separado de "Nova proposta"; Clientes, Servicos/Pacotes e Propostas devem ter um pequeno `+` no proprio item para criar rapidamente.

## Diagnostico

- O shell autenticado usa grid, mas o documento continua sendo a area principal de scroll; isso faz sidebar/header parecerem parte da rolagem.
- O footer atual e textual e compete com o conteudo.
- A navegacao atual trata "Nova proposta" como item proprio, aumentando a lista e separando a acao do dominio correto.

## Decisoes

- Transformar o app autenticado em shell de 100vh com overflow interno apenas na area `app-content`.
- Remover item "Nova proposta" do array de navegacao.
- Adicionar quick action `+` em Clientes, Servicos/Pacotes e Propostas.
- Usar `title`, `aria-label` e tooltip visual via CSS para botoes icon-only.

## Fora de escopo

- Alterar regras de CRUD, APIs ou rotas.
- Mudar identidade visual.
