# Spec Web - Correcoes UX/layout do fluxo completo Chrome

## Visao geral

Aplicar correcoes apontadas pela vistoria Chrome do Emprely para melhorar confianca do fluxo comercial, usabilidade administrativa e testabilidade da UI.

## Rotas

- `/`
- `/admin`

## Estados da interface

- Carregando: admin deve manter estado explicito enquanto consulta dados.
- Vazio: admin/listagens devem diferenciar lista vazia de falha.
- Erro: admin deve mostrar mensagem acionavel quando consulta falhar.
- Sucesso: formularios continuam exibindo toast, mas com proximo passo mais claro quando aplicavel.

## Componentes

- Campos monetarios de servico, proposta, item livre e desconto.
- Wizard de proposta.
- Listagens de clientes/servicos/propostas.
- Formularios administrativos.
- Painel admin de usuarios/admins.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Preco | moeda | sim | entrada natural em reais, maximo atual |
| Valor unitario | moeda | sim | entrada natural em reais, maximo atual |
| Desconto | moeda | nao | nao pode exceder subtotal |
| Senha temporaria/admin | password | sim quando criar | sem autofill de senha pessoal |

## Integracao com API

- Sem alteracao de contrato.
- Admin deve expor erro de query quando API falhar.

## Criterios de aceite

- Digitar `1500` em campo monetario resulta em `R$ 1.500,00`.
- Digitar `500` em item livre resulta em `R$ 500,00`.
- Digitar `5` em desconto resulta em `R$ 5,00`.
- Wizard mostra 6 etapas de forma consistente.
- Stepper inicial da nova proposta fica em uma unica linha no desktop.
- Textos `Condicoes`, `copia`, `items`, `Filtros avancados`, `Ultimo login`, `acoes` aparecem corrigidos.
- Formularios admin usam autocomplete seguro.
- Listagens nao expandem excessivamente com observacoes longas.
- Admin mostra estado vazio/erro compreensivel.
- Templates de propostas tipicas dos roteiros de QA cabem em uma pagina A4 ao baixar PDF, sem cortar conteudo.
- Cabecalho dos templates nao destaca identificadores longos desnecessarios; titulos longos quebram de forma controlada.
- No template `Proposta comercial completa`, um unico beneficio aparece como linha horizontal, nao como card estreito.
- Menu de acoes de propostas com muitas opcoes fica agrupado por contexto: principal, fluxo comercial, gerenciar e perigo.
- Modais de confirmacao, preview, compartilhamento e cadastro rapido ficam mais legiveis, com header e acoes mais claras.
- Clicar em `Gerar proposta` sem salvar rascunho manualmente exibe apenas o toast final de proposta gerada.
- Preview de template no desktop ocupa quase toda a area util da tela sem cortar o documento no modo `Inteiro`.
- Preview de template permite navegar entre templates com `Anterior` e `Proximo` sem fechar a modal.
- Botao `Usar` aplica o template atualmente visivel no preview.
- Logo salva no perfil aparece no preview dos templates quando a URL é acessivel.
- Se a logo falhar, o template mostra fallback com iniciais da marca em vez de icone de imagem quebrada.
- No desktop, clicar em `Mensagem inicial + anexo` fecha a modal, baixa o PDF,
  abre o WhatsApp e informa que a proposta está na pasta Downloads para ser
  anexada manualmente.
- Elementos não editáveis, como botões, cards, tabelas e paginação, não devem
  exibir seleção/caret como se fossem campos de digitação.
- Formulários e detalhes de entidades devem destacar a entidade principal com
  ícone, cabeçalho visual e cards de metadados, em vez de usar apenas texto
  maior.
- Tooltips de ações não devem ser cortados por bordas da tela, modais ou
  containers de tabela.

## Testes

- Lint: `pnpm --filter web lint`
- Build: `pnpm --filter web build`
- E2E: `pnpm --filter web test:e2e`
- Manual: repetir fluxo principal via Chrome/Playwright.
