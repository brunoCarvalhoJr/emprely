# Analise - Ajustes nos templates para aprovacao e PDF com link

## Pedido

Aplicar em todos os templates:

- Usar logo da Emprely na marca d'agua em vez de texto simples.
- Padronizar CTA como `Aprovar`.
- Tornar o CTA um link para a pagina publica de aprovacao.
- Remover o CTA da exportacao em imagem.
- Garantir que cada template/exportacao PDF caiba em uma unica pagina.
- Reverter a camada de texto selecionavel do PDF e manter apenas o botao `Aprovar` clicavel.
- Remover textos que limitem um template a uma area de atuacao especifica.
- Usar logo/foto de perfil em PNG nos testes, sem moldura branca artificial ao redor da imagem.
- Adicionar links clicaveis nos contatos exibidos nos templates: WhatsApp, email, Instagram e site.
- Corrigir o modelo 6 para evitar sombra/blur do painel lateral sobrepondo o conteudo e parecendo um quadro embaçado.
- Corrigir o modelo 2 para a tabela de itens usar melhor o espaco horizontal e evitar que o texto quebre excessivamente enquanto o card de total fica sobrando.
- Corrigir borda externa dos templates para fechar na base do PDF, inclusive modelos 1 e 2.
- Manter a marca d'agua no topo, com opacidade reduzida e sem nitidez total, tomando cuidado para nao disputar leitura com as informacoes do orcamento.
- Corrigir o total final do modelo 2 para nao quebrar ou sair do quadro.

- Remover nomes de estilos de template impressos no documento, como `Emprely Orcamentos`, `Executivo editorial`, `Board comercial` e `Institucional clean`.

## Contexto tecnico

- Os templates visuais ficam em `apps/web/src/App.tsx` e estilos `.doc-*` em `apps/web/src/styles.css`.
- `PropostaResponse` ja possui `publicApprovalUrl`.
- A API publica de aprovacao ja existe no contrato, mas a experiencia publica sera refinada depois.
- A exportacao PNG usa `html-to-image`.
- A exportacao PDF usa uma imagem PNG do template dentro de `jsPDF`.
- A selecao de texto no PDF nao e mais requisito nesta etapa.
- A logo da conta e renderizada pelo componente `DocumentoLogoMarca`; o fundo branco e padding aplicados no `img` criavam moldura visual indesejada.
- O PDF e uma imagem, entao links de contato precisam virar anotacoes `pdf.link` calculadas pela posicao real dos elementos no DOM.
- O template `InstagramPremium` tinha painel lateral com `backdrop-filter` e sombra ampla, o que pode gerar artefato retangular na rasterizacao do PDF.
- O template `OrcamentoSimplificado` usa grid de duas colunas; a tabela detalhada ficava estreita demais em comparacao com o card de total.

## Decisao

- Manter o visual restaurado dos templates.
- Alterar `DocumentoFooter` para renderizar CTA `Aprovar` como link quando houver `publicApprovalUrl`.
- Adicionar `publicApprovalUrl` ao modelo visual da proposta.
- Na exportacao PNG, aplicar temporariamente uma classe CSS que oculta o CTA.
- Na exportacao PDF, preservar o layout HTML de cada template como imagem de base visual.
- A area clicavel do PDF deve ser calculada a partir da posicao real do CTA no DOM renderizado, para manter o layout original e ainda gerar uma anotacao de link funcional.
- Remover a camada textual selecionavel adicionada sobre o PDF.
- Usar logo Emprely do app na marca d'agua/selo, sempre em versao visualmente escura, com a palavra `Orcamentos` abaixo para formar `Emprely Orcamentos`.
- A verificacao visual dos templates deve usar uma logo de teste PNG da conta para confirmar que `perfilConta.logoUrl` aparece no documento sem borda branca.
- Os textos fixos impressos nos templates devem ser genericos e ligados ao conteudo do orcamento; nomes de estilos visuais devem ficar apenas como metadados internos/opcoes de escolha no app.
- Os contatos devem ser renderizados como anchors no HTML e identificados por `data-pdf-link-url` para gerar anotacoes clicaveis no PDF.
- Instagram e site devem ser renderizados como contatos independentes quando ambos existirem, sem escolher apenas um deles.
- Qualquer contato de marca exibido no cabecalho ou rodape do documento deve usar link quando representar telefone/WhatsApp, email, Instagram ou site.
- No modelo 6, o painel lateral deve ser opaco, sem blur de fundo, com sombra contida e sem sobrepor a coluna de texto.
- No modelo 2, a primeira grade deve priorizar largura para a tabela e compactar o card de total, com colunas internas da tabela balanceadas.
- A folha visual deve ter altura fixa proporcional ao A4, mas sem borda externa global enquanto o visual sem moldura e avaliado.
- A borda externa global deve ser removida dos templates para validacao visual; cards e secoes internas mantem suas bordas proprias.
- A marca d'agua deve voltar para a posicao superior, menor, um pouco apagada e atras do conteudo.
- A marca d'agua no topo precisa continuar discreta, mas com opacidade suficiente para leitura de `Emprely Orcamentos`.
- A marca d'agua deve usar uma variante PNG da logo com escrita preta para melhorar leitura mantendo a transparencia atual.
- O modelo 9 (`CorporativoBoard`) estava cortando o rodape no PDF; precisa ser compactado para caber sempre em uma pagina.
- O modelo 6 (`DarkGrowth`) tambem estava cortando a parte inferior; precisa de compactacao especifica para preservar CTA/rodape em uma pagina.
- O modelo 5 (`InstagramPremium`) tambem estava cortando a parte inferior; precisa compactar header, resumo, cards, grade de entregas, investimento e rodape sem remover links.
- O modelo 4 (`LunaSocialStudio`) tambem estava cortando a parte inferior; precisa compactar hero, beneficios, escopo, listas, cadencia, investimento e observacoes mantendo o PDF em uma pagina.
- O modelo 9 (`CorporativoBoard`) ainda precisava melhorar o rodape: a caixa azul deve ter margem interna inferior uniforme em relacao ao conteudo, sem contato encostar na base.

- Nomes de estilos visuais nao devem ser renderizados no documento final, mesmo que continuem existindo como classes CSS, labels internos ou opcoes da galeria.

## Riscos

- Conteudo muito longo precisa ser truncado para preservar o limite de uma pagina.
- O link do PDF depende da posicao real do botao no DOM; se o template nao renderizar CTA, usa uma area fallback.
- O logo da conta pode falhar se a API nao servir o arquivo enviado com acesso publico/CORS adequado; no fluxo de teste local, usar asset same-origin.
- Textos de exemplo do preview tambem precisam ser genericos para nao dar a impressao de que o produto e exclusivo de social media.
- Telefones sem quantidade minima de digitos nao devem gerar link de WhatsApp.
- Sombras amplas e blur em areas sobrepostas devem ser evitados nos templates exportados como imagem.
- A tabela do modelo 2 precisa manter leitura confortavel sem forcar quebras letra-a-letra ou palavras pequenas empilhadas.
- Valores monetarios em cards estreitos precisam manter o texto dentro do quadro, com tamanho e grid internos adequados.
