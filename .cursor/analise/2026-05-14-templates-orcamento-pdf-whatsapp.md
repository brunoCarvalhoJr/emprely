# Analise - Templates de orcamento, PDF/imagem e WhatsApp

## Ideia / US

Como usuario autenticado da Emprely, quero escolher um template visual para a
proposta/orcamento antes de gerar o documento, para que o cliente receba o
orcamento com layout profissional, cores da minha marca, minha logomarca e o
formato escolhido.

## Objetivo

Permitir que a proposta gerada use um template selecionado pelo usuario e que o
mesmo layout seja usado em:

- preview dentro do app;
- impressao/salvar como PDF;
- arquivo PDF ou imagem compartilhavel;
- fluxo de WhatsApp, com comportamento adequado para desktop e mobile.

Esta analise nao implementa codigo. Ela prepara a spec e a decisao tecnica da
feature.

## Atualizacao 2026-05-15 - visualizacao em modal

A visualizacao de proposta nao deve mais abrir uma tela propria com grande area
vazia, toolbar extensa e acoes misturadas com exportacao. Ao clicar em visualizar
na listagem, o usuario deve continuar no contexto da lista e ver a proposta em
uma modal dedicada.

Regras da modal:

- mostrar apenas a proposta renderizada no template escolhido;
- manter a visualizacao em area rolavel e centralizada;
- esconder o cabecalho tecnico de preview usado internamente pelo componente;
- exibir somente uma acao primaria textual: `Editar`;
- o botao `Editar` redireciona para o fluxo de edicao da proposta;
- acoes como PDF, imagem, WhatsApp, envio e decisao de status permanecem fora da
  modal, acionadas pela listagem ou pelos fluxos ja existentes.

## Atualizacao 2026-05-15 - edicao focada e barra lateral

A tela de criacao/edicao de proposta deve ser uma superficie focada em campos:
cliente, validade, mensagem, itens, desconto, condicoes e blocos comerciais. O
preview lateral, a selecao aberta de templates e a barra de cliente rapido
ocupavam area demais e competiam com a edicao.

Nova organizacao:

- o preview deixa de ocupar a coluna direita e passa a abrir em modal pelo botao
  `Preview`;
- as acoes de salvar, gerar, compartilhar, status, template, novo cliente e
  voltar ficam em uma barra lateral direita;
- a barra lateral inicia recolhida com icones verticais e tooltip;
- ao expandir, a barra mostra os labels mantendo um botao por linha;
- o controle de expandir/recolher deve usar icone de painel lateral, nao icone
  de menu/hamburguer, para comunicar que a barra esta sendo aberta ou fechada;
- `Novo Cliente` abre uma modal de cadastro rapido e seleciona o cliente criado;
- a selecao de template abre em modal propria;
- PDF, imagem, impressao, copiar texto, WhatsApp e compartilhamento nativo ficam
  agrupados em uma modal aberta pela acao `Compartilhar`;
- o componente visual da proposta continua montado em buffer oculto para manter
  exportacao PDF/PNG/impressao sem exigir preview visivel na tela.

## Atualizacao 2026-05-15 - modal de templates e fechamento

- A modal de escolha de templates precisa exibir cards com altura estavel,
  descricao legivel e botoes sempre visiveis.
- As miniaturas dos cards devem representar melhor o layout real do template,
  diferenciando cabecalho claro, cabecalho escuro, painel lateral, seções,
  rodape e estilos estaticos.
- Ao abrir o preview de um template a partir da selecao, o usuario precisa
  conseguir voltar para a lista de templates ou usar o template e fechar o fluxo.
- As modais do sistema devem fechar ao clicar fora do dialogo, mantendo o clique
  dentro da modal sem efeito de fechamento acidental.

## Contexto atual

### App web

- O app web e React/Vite, concentrado hoje em `apps/web/src/App.tsx`, com estilos
  em `apps/web/src/styles.css`.
- O fluxo de propostas ja possui formulario, listagem, preview, status comercial
  e acoes de gerar, imprimir/PDF e WhatsApp.
- O preview atual e um unico componente, `PreviewPropostaVisual`, que renderiza
  uma proposta visual compacta.
- O preview atual ja usa:
  - `perfilConta.corPrimaria`;
  - `perfilConta.corSecundaria`;
  - `perfilConta.logoUrl`;
  - nome comercial e contatos do perfil;
  - dados da proposta e itens.
- A impressao atual usa `window.print()` e CSS `@media print` para mostrar apenas
  `.print-proposta`.
- O WhatsApp atual usa link `wa.me` com texto pre-preenchido. Esse mecanismo nao
  anexa arquivo.
- O frontend ja possui validacao de proposta com:
  - cliente;
  - titulo;
  - introducao;
  - observacoes;
  - validade;
  - itens;
  - total calculado.

### API, dominio e contratos

- `Proposta` esta no dominio `Emprely.Domain/Propostas`.
- A API publica rotas em ingles sob `/api/proposals`.
- `Proposta` hoje armazena:
  - `ContaId`;
  - `Numero`;
  - `ClienteId`;
  - `Titulo`;
  - `Introducao`;
  - `Observacoes`;
  - `ValidadeDias`;
  - `Status`;
  - itens com snapshot de nome, descricao, quantidade e valor unitario.
- `StatusProposta` ja cobre `Rascunho`, `Gerada`, `Enviada`, `Aceita`,
  `Recusada` e `Arquivada`.
- `GenerateProposta` muda a proposta para `Gerada`.
- `SendProposta` muda de `Gerada` para `Enviada`.
- Editar proposta gerada/enviada volta para `Rascunho`.
- O perfil da conta (`PerfilConta`) ja possui identidade de marca:
  - nome comercial;
  - email;
  - telefone;
  - site;
  - Instagram;
  - documento;
  - cor primaria;
  - cor secundaria;
  - logo.
- O upload de logo ja segue o fluxo correto: upload/processamento separado e
  atribuicao ao perfil somente ao salvar.

## Templates anexados

Os templates enviados sao referencias visuais para layouts codados, nao
devem ser usados como imagem fixa de fundo.

Atualizacao de refatoracao em 2026-05-14:

- O primeiro corte implementado gerou variacoes visuais genericas demais.
- A necessidade correta e renderizar layouts distintos por template, com
  estrutura fiel aos anexos.
- O usuario reenviou seis referencias: orcamento simplificado, comercial
  minimalista, proposta completa, Luna/social studio, dark growth e Instagram
  premium.
- O usuario decidiu remover o template visual `PadraoEnxuto`. Ele deve ficar
  apenas como valor legado, normalizado para `ComercialMinimalista`.
- A lista operacional passa a ter oito templates: seis referencias anexadas,
  `Claymorphism` e `Emprely`.
- Os cards de template nao podem ser apenas informativos; precisam selecionar o
  template e oferecer visualizacao ampliada antes da escolha.

Atualizacao de refatoracao em 2026-05-15:

- Os templates estavam usando degrade em excesso, principalmente quando as cores
  da conta eram fortes.
- A nova direcao visual limita degrade a no maximo dois templates e prioriza
  cores solidas, bordas, contraste e composicao moderna.
- Deve existir um template `Claymorphism`, com volume suave, sombras internas e
  externas, e sem depender de degrade.
- Deve existir um template `Emprely`, com a cara do sistema: layout limpo,
  header escuro institucional, cards claros e hierarquia operacional.
- Campos opcionais vazios nao devem aparecer no documento; nao deve ser exibido
  texto de fallback como "nao informado".
- O template `InstagramPremium` deve usar icone do Instagram no resumo.
- O template legado `PadraoEnxuto` tambem deve ser normalizado no backend para
  `ComercialMinimalista`, evitando novas gravacoes com valor removido da UI.
- Desconto igual a zero deve ser omitido dos blocos financeiros do documento,
  para nao parecer informacao comercial preenchida.

### Template 1 - Orcamento simplificado com cartoes

Caracteristicas:

- cabecalho com logo e marca;
- titulo grande;
- resumo de cliente, data, validade e tipo;
- texto de contexto;
- tabela de servicos;
- card de subtotal/desconto/total;
- condicoes de pagamento;
- rodape com contatos;
- visual claro, com acentos em turquesa/roxo/azul.

Viabilidade:

- bom candidato para MVP apos o template minimalista;
- usa quase todos os dados atuais;
- desconto, subtotal separado e condicoes de pagamento ainda nao existem de
  forma estruturada.

### Template 2 - Proposta comercial completa

Caracteristicas:

- documento mais editorial e completo;
- resumo executivo;
- objetivos e beneficios;
- escopo e entregaveis;
- incluidos e nao incluidos;
- cronograma e condicoes;
- investimento;
- observacoes finais.

Viabilidade:

- precisa de campos extras para ser fiel;
- se implementado apenas com dados atuais, ficara artificial ou repetitivo;
- melhor para uma segunda fase com blocos comerciais estruturados.

### Template 3 - Conteudo Instagram premium

Caracteristicas:

- cabecalho lateral com informacoes do cliente;
- foco em plano mensal de conteudo;
- cards de beneficios;
- escopo detalhado com entregaveis;
- inclusos, nao inclusos, cronograma e investimento;
- barra final de CTA e contatos.

Viabilidade:

- forte para propostas de social media;
- precisa de dados extras de inclusos/nao inclusos/cronograma;
- pode funcionar bem quando houver templates orientados por tipo de servico.

### Template 4 - Orcamento comercial minimalista

Caracteristicas:

- layout limpo, A4, com pouca decoracao;
- cabecalho simples com logo e titulo;
- metadados de cliente, data, validade e tipo;
- texto introdutorio;
- tabela de servicos;
- card de total;
- condicoes de pagamento e rodape.

Viabilidade:

- melhor candidato para primeiro MVP;
- mais resiliente a textos longos e muitos itens;
- depende pouco de campos ainda inexistentes;
- pode substituir o preview atual com menor risco.

### Template 5 - Proposta comercial dark/growth

Caracteristicas:

- hero escuro com identidade forte;
- cards de beneficios;
- tabela de escopo;
- inclusos/nao inclusos;
- cronograma visual;
- investimento e observacoes.

Viabilidade:

- visualmente forte, mas mais arriscado para impressao e contraste;
- precisa de blocos extras;
- melhor para fase posterior com QA visual mais rigoroso.

## Dados atuais x dados necessarios

### Dados ja disponiveis

- Nome da marca.
- Logo salva no perfil.
- Cor primaria e cor secundaria.
- Email, telefone, site e Instagram.
- Cliente da proposta.
- Telefone do cliente para WhatsApp.
- Numero sequencial da proposta.
- Titulo.
- Introducao.
- Observacoes.
- Validade em dias.
- Itens com nome, descricao, quantidade, valor unitario e total.
- Total geral.
- Status da proposta.
- Datas de criacao/atualizacao.

### Dados parcialmente disponiveis

- Data exibida no template: pode usar data de criacao, data de geracao ou data
  atual de exportacao. Hoje nao ha `GeneratedAt` separado.
- Tipo da proposta: pode ser inferido pelo primeiro item/categoria, mas nao ha
  campo dedicado.
- Condicoes de pagamento: poderia usar `observacoes`, mas isso misturaria
  campos com semanticas diferentes.

### Dados ausentes para templates completos

- Desconto.
- Subtotal antes do desconto.
- Condicoes de pagamento estruturadas.
- Forma de pagamento.
- Prazo de execucao.
- Vigencia/recorrencia.
- Revisoes.
- Objetivos e beneficios.
- Itens incluidos.
- Itens nao incluidos.
- Cronograma.
- Observacoes finais separadas das observacoes internas/comerciais.
- CTA customizavel.
- Snapshot de identidade da marca no momento da geracao.
- Arquivo gerado persistido.

## Restricao importante do WhatsApp

### Desktop/web

`wa.me` ou links de WhatsApp Web permitem abrir conversa e pre-preencher texto.
Eles nao permitem anexar automaticamente PDF ou imagem no WhatsApp Web.

Fluxo viavel sem WhatsApp Business API:

1. Gerar o PDF/imagem no template escolhido.
2. Baixar ou abrir o arquivo para o usuario.
3. Abrir WhatsApp Web com texto pronto, por exemplo:
   "Segue abaixo o orcamento detalhado em PDF."
4. Usuario anexa manualmente o arquivo baixado/aberto.

Isso precisa ser explicado de forma clara no sistema.

### Mobile web

No celular, e possivel usar Web Share API quando o navegador/sistema suportar
compartilhamento de arquivos.

Fluxo viavel:

1. Gerar o PDF/imagem como `File`.
2. Testar suporte com `navigator.canShare({ files })`.
3. Chamar `navigator.share({ files, text, title })`.
4. O usuario escolhe WhatsApp na folha de compartilhamento do sistema.

Mesmo no mobile, nao se deve prometer envio automatico: o sistema abre o
compartilhamento nativo, e o usuario confirma o destino/envio.

### Envio automatico real

Enviar texto + PDF/imagem automaticamente, sem acao manual de anexo, exige
WhatsApp Business Cloud API ou provedor oficial equivalente. Isso envolve:

- conta WhatsApp Business;
- numero habilitado;
- tokens e secrets no backend;
- politica de opt-in;
- possivel uso de templates aprovados;
- upload/publicacao do PDF/imagem;
- logs e tratamento de falhas.

Recomendacao: deixar fora do MVP de templates e tratar como integracao futura.

## Regras

### Regras de negocio

- O usuario deve escolher um template visual para a proposta antes de gerar o
  documento final.
- A proposta deve ter um template default quando o usuario nao escolher
  explicitamente.
- O template escolhido deve ser persistido junto da proposta.
- O preview deve sempre refletir o template atualmente selecionado.
- O documento impresso, o PDF/imagem gerado e o compartilhamento devem usar o
  mesmo template exibido no preview da proposta gerada.
- As cores usadas nos templates devem vir de `PerfilConta.CorPrimaria` e
  `PerfilConta.CorSecundaria`.
- A logo exibida no template deve vir de `PerfilConta.LogoUrl`.
- Se a conta nao tiver logo, o template deve usar fallback definido pela spec:
  iniciais/nome comercial ou marca padrao Emprely.
- Alterar o template de uma proposta ja `Gerada`, `Enviada`, `Aceita` ou
  `Recusada` deve voltar a proposta para `Rascunho`, pois o documento final foi
  alterado.
- O usuario nao deve conseguir imprimir, gerar arquivo ou iniciar envio pelo
  WhatsApp quando houver alteracoes locais nao salvas.
- Propostas arquivadas nao devem permitir geracao/exportacao.
- Contas bloqueadas por plano/trial devem continuar impedidas de gerar,
  imprimir ou compartilhar proposta.
- O sistema nao deve prometer anexo automatico no WhatsApp Web.
- No desktop, o sistema deve explicar que o arquivo sera preparado para anexo
  manual no WhatsApp.
- No mobile, o sistema deve abrir o compartilhamento nativo quando o navegador
  suportar envio de arquivos.
- Quando o navegador nao suportar compartilhamento de arquivo, o fluxo deve cair
  para download/abertura do PDF e link `wa.me` com mensagem pronta.
- O status `Enviada` nao deve ser marcado automaticamente apenas porque o
  WhatsApp foi aberto; deve continuar sendo uma acao explicita do usuario no
  MVP.

### Regras visuais

- Templates devem ser implementados como componentes/layouts, nao como imagens
  estaticas de fundo.
- O layout deve preservar a estrutura visual do template escolhido, mas adaptar
  cores e logomarca para a marca da conta.
- Texto principal deve manter contraste adequado mesmo quando a cor escolhida
  pelo usuario for clara ou escura demais.
- Os templates precisam aceitar conteudo real, inclusive nomes longos, itens com
  descricoes grandes e listas com muitos itens.
- O documento deve ter comportamento previsivel em A4 para impressao/PDF.
- Elementos decorativos nao devem cortar informacoes comerciais.
- Tabelas e secoes devem evitar quebra visual ruim entre paginas.
- O template nao deve inventar conteudo ausente; secoes sem dados estruturados
  devem ser omitidas ou ficar fora do MVP.

### Regras tecnicas

- A fonte de verdade para exportacao deve ser a proposta salva/gerada, nao o
  rascunho local do formulario.
- O frontend deve detectar suporte a compartilhamento com APIs do navegador,
  nao apenas por largura de tela.
- O fluxo de exportacao deve ter fallback para `window.print()` enquanto a
  geracao de arquivo nao estiver disponivel ou falhar.
- O PDF/imagem gerado localmente nao deve ser persistido no backend sem decisao
  explicita de storage e privacidade.
- Qualquer futura integracao WhatsApp Business deve ser backend-driven e nao
  expor tokens no frontend.

## Decisoes recomendadas

1. Recriar os templates em React/CSS, nao usar PNG como fundo fixo.
2. Separar dados da proposta de layout visual.
3. Criar um `TemplateVisualProposta` persistido na proposta.
4. Usar o template escolhido tanto no preview quanto na impressao/exportacao.
5. Aplicar sempre as cores do perfil nas areas de acento do template.
6. Substituir a logo do mockup pela `logoUrl` salva no perfil.
7. Se nao houver logo, usar fallback com iniciais/nome da marca ou logo padrao
   Emprely, conforme regra da spec.
8. Usar PDF como formato primario de compartilhamento de orcamento.
9. Permitir imagem/PNG como formato opcional depois, se for util para social
   media ou envio rapido.
10. No desktop, usar fallback honesto: abrir WhatsApp com texto e preparar o
    arquivo para anexo manual.
11. No mobile, usar compartilhamento nativo quando suportado.
12. Detectar capacidade por API do navegador, nao apenas por tamanho de tela.
13. Explicar o comportamento no proprio sistema, com texto curto dentro da acao
    de envio.
14. Manter WhatsApp Business API fora do MVP inicial.

## Decisoes fechadas para a spec

- O MVP deve incluir os seis templates anexados pelo usuario.
- O sistema deve adicionar os templates `Claymorphism` e `Emprely`.
- O template `ComercialMinimalista` deve ser o template inicial do sistema.
- A exportacao deve gerar PDF e imagem.
- A imagem exportada deve ser PNG.
- Campos avancados entram no MVP:
  - desconto;
  - condicoes de pagamento;
  - itens inclusos;
  - itens nao inclusos;
  - cronograma;
  - beneficios.
- Todos os campos avancados devem ser opcionais.
- Quando faltar conteudo para uma secao do template, a secao deve ser ocultada.
- O desconto no MVP deve aceitar valor fixo em reais.
- O usuario deve poder definir template padrao da conta e tambem trocar o
  template por proposta.
- Se o usuario alterar o template de uma proposta gerada, o sistema deve pedir
  confirmacao antes de voltar a proposta para `Rascunho`.
- A proposta gerada deve usar sempre a marca atual da conta, sem snapshot de
  marca nesta entrega.
- O escopo mobile inclui web app no celular e app nativo em `apps/mobile`.
- A proposta continua sendo marcada como `Enviada` manualmente pelo usuario.
- No desktop, o fluxo de WhatsApp deve oferecer opcoes para baixar, abrir ou
  copiar mensagem.
- WhatsApp Business API nao entra nesta entrega.
- O backend deve salvar apenas os dados da proposta e do template.
- PDF e PNG nao devem ser salvos no backend no MVP; quando o usuario quiser o
  arquivo, ele deve ser gerado novamente a partir dos dados salvos no backend.
- Todos os seis templates anexados e os dois templates adicionais devem entrar
  no primeiro release com fidelidade alta.

### Revisao visual apos uso real - 15/05/2026

- As primeiras renderizacoes mostraram titulos longos quebrando a hierarquia,
  cards apertados, selo trial invadindo o conteudo, CTAs com contraste fraco e
  templates densos ficando pequenos demais no PDF.
- Proposta comercial de social media precisa comunicar processo, escopo,
  previsibilidade e proximo passo antes de parecer apenas uma arte bonita.
- A refatoracao visual deve priorizar: titulo adaptativo por tamanho, largura
  fixa do papel com scroll no preview, exportacao PDF multipagina, blocos
  financeiros com contraste garantido e fallbacks textuais profissionais.

### Segunda revisao visual - 15/05/2026

- O usuario decidiu remover o template `PadraoEnxuto` da escolha visual.
- Para evitar quebra de propostas antigas, `PadraoEnxuto` deve ser normalizado
  para `ComercialMinimalista` no frontend ate existir migracao de dados.
- Todos os templates devem respeitar as cores configuradas pelo usuario. A
  identidade visual do template pode mudar composicao e estrutura, mas acentos,
  decoracoes, CTAs e destaques comerciais devem derivar de `corPrimaria` e
  `corSecundaria`, com neutros fixos apenas para contraste.
- O preview precisa parecer uma mesa/canvas profissional, com folha centralizada,
  zoom/scroll aceitavel e acao clara para usar o template.
- Benchmarks externos reforcam uma estrutura modular: capa, resumo, escopo,
  inclusos/nao inclusos, processo, investimento e proximo passo.

## Arquitetura proposta

### Camada de apresentacao no web

Criar uma camada de renderizacao de documentos de proposta com estes conceitos:

- `PropostaDocumentoViewModel`: objeto normalizado para renderizar qualquer
  template.
- `TemplatePropostaDefinition`: metadados do template.
- `TemplatePropostaRenderer`: componente que recebe o view model e renderiza o
  layout.
- `TemplatePropostaSelector`: seletor visual dentro do fluxo de proposta.
- `PropostaExportService`: servico client-side para gerar PDF/imagem a partir do
  template renderizado.
- `PropostaShareService`: servico client-side para decidir entre Web Share,
  download e `wa.me`.

Beneficio:

- a tela de proposta nao fica acoplada a cinco componentes grandes;
- novos templates entram no registry;
- preview, print e exportacao usam a mesma fonte visual;
- testes podem validar template por template.

### Camada de dominio/API

Para persistencia minima:

- adicionar `TemplateVisual` em `Proposta`;
- incluir `TemplateVisual` em `CreatePropostaRequest`,
  `UpdatePropostaRequest` e `PropostaResponse`;
- usar valor default para propostas existentes;
- editar template de proposta gerada deve voltar para `Rascunho`, pois altera o
  documento final.

Para uma fase completa:

- adicionar campos comerciais estruturados ou um value object de blocos do
  template;
- considerar snapshot de marca no momento da geracao;
- considerar entidade `PropostaDocumentoGerado` para arquivo/versao.

### Camada de infraestrutura

Impactos provaveis:

- migration para nova coluna `TemplateVisual`;
- migration futura para campos de desconto/condicoes/blocos;
- ajuste de EF Core para enum/string ou string controlada;
- possivel configuracao de CORS/static files para logo em exportacao por canvas;
- possivel armazenamento futuro de PDF/imagem em S3 ou storage local.

## Fluxo proposto entre sistemas

### 1. Configuracao da marca

1. Usuario configura nome, cores, contatos e logo.
2. Logo continua usando o fluxo atual: preview local, upload no salvar perfil e
   `logoUrl` persistida no perfil.
3. Templates usam `PerfilContaResponse` como fonte de identidade.

### 2. Criacao/edicao da proposta

1. Usuario cria proposta.
2. Escolhe cliente, itens, validade e conteudos textuais.
3. Escolhe template visual.
4. Preview atualiza imediatamente com o template escolhido.
5. Ao salvar, API persiste dados comerciais e `TemplateVisual`.

### 3. Geracao da proposta

1. Usuario salva proposta.
2. Usuario clica em `Gerar proposta`.
3. API valida plano/status e muda para `Gerada`.
4. Frontend usa a proposta salva/gerada como fonte de verdade.
5. Acoes de imprimir/PDF/WhatsApp ficam disponiveis.

### 4. Impressao/PDF desktop

1. Usuario clica em `Imprimir/PDF`.
2. App renderiza apenas o template escolhido.
3. `window.print()` abre o dialogo do navegador.
4. Usuario imprime ou salva como PDF.

Esse fluxo pode continuar existindo mesmo apos criarmos exportacao para arquivo.

### 5. Envio WhatsApp desktop

1. Usuario clica em `Enviar pelo WhatsApp`.
2. App gera/baixa o PDF ou prepara o arquivo.
3. App abre WhatsApp Web com texto pronto.
4. Sistema mostra explicacao curta:
   "No computador, o WhatsApp nao permite anexar automaticamente. O arquivo foi
   preparado para voce anexar na conversa aberta."
5. Usuario anexa o arquivo manualmente.
6. Depois, usuario pode marcar a proposta como enviada.

### 6. Envio WhatsApp mobile

1. Usuario clica em `Enviar pelo WhatsApp`.
2. App gera o PDF/imagem como arquivo.
3. Se `navigator.canShare({ files })` suportar o arquivo, abre o
   compartilhamento nativo.
4. Usuario escolhe WhatsApp e confirma envio.
5. Se nao suportar, app cai para o fluxo desktop/fallback.
6. Depois, usuario pode marcar a proposta como enviada.

### 7. Futuro com WhatsApp Business API

1. Backend gera ou recebe arquivo persistido.
2. Backend envia mensagem de texto e documento/imagem pela API oficial.
3. API registra log de envio.
4. Proposta pode mudar para `Enviada` automaticamente somente se a API confirmar
   aceite do envio.

## Explicacao ao usuario dentro do sistema

Deve existir uma explicacao curta no fluxo de envio, sem virar tela de tutorial.

Sugestao de microcopy:

- Mobile com compartilhamento suportado:
  "Vamos abrir o compartilhamento do celular com o PDF do orcamento. Escolha o
  WhatsApp e confirme o envio."

- Desktop:
  "No computador, o WhatsApp Web nao permite anexar o arquivo automaticamente.
  Vamos abrir a conversa com a mensagem pronta e preparar o PDF para voce anexar."

- Fallback:
  "Seu navegador nao permite compartilhar arquivos direto. Baixe o PDF e anexe
  manualmente no WhatsApp."

Tambem e recomendavel separar duas acoes:

- `Enviar pelo WhatsApp`;
- `Baixar PDF`.

Assim o usuario sempre tem controle quando o compartilhamento nativo falhar.

## Impactos por projeto

### `apps/web`

Maior impacto.

Responsabilidades:

- criar seletor visual de template;
- renderizar preview pelo template escolhido;
- substituir o preview unico por registry de templates;
- aplicar cores/logo dinamicamente;
- manter layout A4 exportavel;
- criar fluxo de exportacao para PDF/imagem;
- criar fluxo de compartilhamento desktop/mobile;
- explicar limitacoes de WhatsApp no UI;
- validar responsividade do builder sem quebrar o documento A4;
- adicionar testes e screenshots com Playwright quando possivel.

Arquivos provavelmente afetados em implementacao futura:

- `apps/web/src/App.tsx`;
- `apps/web/src/styles.css`;
- `apps/web/src/types/proposal.ts`;
- `apps/web/src/lib/api.ts`;
- possiveis novos arquivos em `apps/web/src/features/proposals/templates/`;
- possiveis novos arquivos em `apps/web/src/features/proposals/export/`;
- `apps/web/package.json`, se forem adicionadas dependencias de PDF/imagem.

### `apps/api`

Impacto moderado no MVP e maior em fases completas.

Responsabilidades:

- persistir `TemplateVisual`;
- retornar template escolhido no `PropostaResponse`;
- validar template permitido;
- manter isolamento por conta;
- garantir que alteracao de template volte status para `Rascunho`;
- futuramente persistir campos comerciais extras;
- futuramente persistir ou gerar arquivos.

Arquivos provavelmente afetados em implementacao futura:

- `ProposalsController.cs`;
- contratos em `Emprely.Contracts/Proposals`;
- entidade `Proposta`;
- `EmprelyDbContext`;
- migrations;
- testes unitarios e de integracao.

### `apps/mobile`

Nao e necessario para o MVP se "mobile" significar web app aberto no celular.

Se futuramente houver app nativo:

- o app mobile poderia usar compartilhamento nativo com mais controle;
- a mesma API e o mesmo template id devem ser reaproveitados;
- nao deve duplicar regras comerciais.

### `packages/design-tokens`

Pode ser envolvido se os templates passarem a compartilhar tokens de cor,
espacamento, fonte e contraste.

Para o MVP, pode ficar fora se o web centralizar os tokens dos templates.

### Documentacao e SDD

Precisara de:

- spec raiz da feature;
- possivelmente specs especificas para web e API;
- atualizacao de README/docs do fluxo de proposta;
- criterios de aceite de compartilhamento por plataforma.

## Dependencias

### Dependencias internas

- `apps/web/src/App.tsx`: fluxo atual de propostas, preview, status,
  impressao e WhatsApp.
- `apps/web/src/styles.css`: layout atual do builder de propostas e CSS de
  impressao.
- `apps/web/src/types/proposal.ts`: contrato TypeScript de proposta, onde deve
  entrar o template escolhido.
- `apps/web/src/types/account.ts`: fonte dos dados de marca usados pelo
  template.
- `apps/web/src/lib/api.ts`: chamadas para criar, atualizar, gerar, enviar e
  listar propostas.
- `apps/api/src/Emprely.Domain/Propostas/Proposta.cs`: entidade de dominio que
  deve persistir template visual e resetar status quando necessario.
- `apps/api/src/Emprely.Domain/Propostas/StatusProposta.cs`: regras de
  transicao usadas para liberar ou bloquear exportacao.
- `apps/api/src/Emprely.Contracts/Proposals`: requests/responses que precisam
  expor `TemplateVisual`.
- `apps/api/src/Emprely.Api/Controllers/ProposalsController.cs`: endpoints de
  criacao, edicao, geracao, envio e resposta de propostas.
- `apps/api/src/Emprely.Domain/Contas/PerfilConta.cs`: identidade da conta usada
  pelos templates.
- EF Core migrations/snapshot: necessario se o template escolhido for
  persistido em banco.
- Testes unitarios e de integracao da API: devem cobrir persistencia e reset de
  status.
- Playwright/e2e web: recomendado para validar preview, impressao e
  compartilhamento/fallback.

### Dependencias externas / navegador

- Web Share API: necessaria para compartilhar PDF/imagem no mobile quando
  suportado.
- `navigator.canShare`: necessario para detectar suporte real a arquivos antes
  de chamar o compartilhamento.
- WhatsApp `wa.me`: usado somente para abrir conversa com texto pronto; nao
  anexa arquivo.
- Impressao/PDF do navegador: fallback atual com `window.print()`.
- Biblioteca futura de geracao PDF/imagem client-side: precisa ser escolhida na
  spec se o MVP exigir arquivo gerado automaticamente.
- Headers/CORS dos assets da API: podem ser necessarios se a exportacao usar
  canvas e carregar logo do perfil.

### Dependencias de produto

- Decisao de template inicial do MVP.
- Decisao sobre PDF, imagem ou ambos.
- Decisao sobre desconto e condicoes de pagamento no MVP.
- Decisao sobre snapshot de marca no momento da geracao.
- Decisao se "mobile" significa mobile web ou app nativo.
- Texto final de explicacao ao usuario para desktop, mobile e fallback.

## Riscos e mitigacoes

### 1. Anexo automatico no WhatsApp desktop

Risco:

- usuario esperar que o arquivo seja anexado sozinho no WhatsApp Web.

Mitigacao:

- microcopy clara;
- botao `Baixar PDF` sempre visivel;
- fluxo desktop abre conversa com mensagem pronta e prepara o arquivo;
- registrar na spec que anexo automatico desktop depende de WhatsApp Business
  API.

### 2. Suporte inconsistente da Web Share API

Risco:

- alguns navegadores mobile nao compartilharem PDF;
- alguns suportarem imagem, mas nao PDF;
- desktop ter comportamento parcial.

Mitigacao:

- usar `navigator.canShare({ files })`;
- fallback para download + `wa.me`;
- opcao de escolher PDF ou imagem em fase posterior;
- testar em Chrome Android e Safari iOS quando possivel.

### 3. Qualidade do PDF/imagem gerado

Risco:

- canvas borrado;
- fonte diferente;
- cortes em A4;
- gradientes/cores divergentes;
- icones quebrados.

Mitigacao:

- definir dimensao fixa A4 para documento;
- renderizar com escala alta para PNG;
- testar print e export;
- usar CSS de print dedicado;
- evitar depender de imagens externas sem CORS;
- Playwright screenshots em desktop/mobile.

### 4. Logo externa e CORS

Risco:

- ao transformar DOM em imagem/canvas, a logo servida pela API pode "sujar" o
  canvas se nao houver CORS correto.

Mitigacao:

- servir uploads com headers adequados;
- usar `crossOrigin="anonymous"` quando aplicavel;
- converter logo para data URL antes da renderizacao, se necessario;
- manter fallback sem logo para erro de carregamento.

### 5. Conteudo maior que o template

Risco:

- templates foram desenhados como uma pagina visual; propostas reais podem ter
  20, 30 ou 50 itens.

Mitigacao:

- templates precisam suportar quebra de pagina;
- tabelas devem quebrar por linha;
- repetir cabecalho/rodape minimo nas paginas seguintes;
- evitar textos cortados;
- definir limites visuais e avisos quando conteudo for longo demais.

### 6. Campos ausentes nos templates completos

Risco:

- templates 2, 3 e 5 parecerem bonitos, mas com conteudo falso ou repetido.

Mitigacao:

- fase 1 com templates 4 e 1 usando dados atuais;
- fase 2 com campos estruturados para desconto, inclusos, nao inclusos,
  cronograma e condicoes;
- nao preencher secoes comerciais com texto inventado.

### 7. Cores escolhidas pelo usuario sem contraste

Risco:

- usuario escolher cores muito claras/escuras e o documento ficar ilegivel.

Mitigacao:

- calcular cor de texto por contraste;
- limitar uso de cores em areas criticas;
- usar neutros fixos para texto principal;
- mostrar aviso se as cores tiverem contraste ruim.

### 8. Fonte de verdade do documento gerado

Risco:

- preview de rascunho e documento gerado divergirem;
- usuario editar sem salvar e exportar dado antigo/novo sem perceber.

Mitigacao:

- manter regra atual: imprimir/WhatsApp apenas proposta `Gerada` sem alteracoes
  locais;
- se template mudar, marcar proposta como alterada;
- salvar antes de gerar;
- explicar estado da proposta no painel atual.

### 9. Historico e snapshot de marca

Risco:

- usuario muda logo/cores depois, e uma proposta antiga passa a ser reexportada
  com identidade nova.

Mitigacao:

- MVP pode aceitar comportamento dinamico se documentado;
- fase futura deve criar snapshot de marca no momento da geracao;
- para validade juridica/comercial, persistir `PropostaDocumentoGerado`.

### 10. Dependencias client-side

Risco:

- libs de HTML para imagem/PDF aumentarem bundle ou falharem com CSS complexo.

Mitigacao:

- avaliar dependencia antes da spec;
- preferir lib mantida e simples;
- isolar exportacao em modulo lazy-loaded;
- manter `window.print()` como fallback.

### 11. Privacidade e arquivos gerados

Risco:

- PDF com dados de cliente ficar salvo em storage publico sem controle.

Mitigacao:

- no MVP, gerar arquivo local no navegador sempre que possivel;
- se persistir arquivo no backend, usar URL assinada/expiravel;
- nao expor PDF publico sem decisao explicita.

## Faseamento recomendado

### Fase 1 - MVP seguro

Escopo:

- persistir template escolhido;
- implementar seletor de template;
- implementar template 4 como primeiro layout fiel;
- implementar template 1 como segundo layout;
- usar dados atuais da proposta e do perfil;
- manter `window.print()` para PDF manual;
- gerar arquivo PDF para compartilhamento quando viavel;
- mobile usa Web Share API com fallback;
- desktop abre WhatsApp com texto e prepara o PDF para anexo manual;
- explicar comportamento no UI.

Fora:

- WhatsApp Business API;
- persistencia de arquivo gerado;
- campos avancados de inclusos/nao inclusos/cronograma;
- templates 2, 3 e 5 com fidelidade completa.

### Fase 2 - Proposta comercial completa

Escopo:

- campos de desconto;
- condicoes de pagamento;
- inclusos e nao inclusos;
- cronograma;
- beneficios/objetivos;
- tipo de proposta;
- template 2, 3 e 5 com fidelidade maior;
- suporte robusto a multipagina.

### Fase 3 - Documento persistido e envio automatico

Escopo:

- snapshot de documento gerado;
- PDF/imagem armazenado;
- link publico ou URL assinada;
- logs de exportacao/envio;
- WhatsApp Business Cloud API;
- status `Enviada` automatico apos confirmacao de envio.

## Criterios de aceite iniciais para a proxima spec

- Usuario consegue escolher um template antes de gerar a proposta.
- Preview reflete imediatamente o template escolhido.
- Template usa cores do perfil.
- Template usa logo salva no perfil ou fallback definido.
- Template escolhido fica salvo na proposta.
- Alterar template de uma proposta gerada volta a proposta para `Rascunho`.
- Impressao/PDF usa o mesmo template do preview.
- Mobile com suporte abre compartilhamento nativo com arquivo.
- Desktop abre WhatsApp com mensagem pronta e prepara o PDF para anexo manual.
- UI explica a diferenca entre desktop e mobile.
- Fluxo nao promete anexo automatico em WhatsApp Web.
- `pnpm --dir apps/web lint` e `pnpm --dir apps/web build` devem passar.
- API/domain tests devem cobrir persistencia do template e reset de status.

## Perguntas para fechar antes da spec

1. O primeiro MVP deve incluir apenas template 4, ou template 4 e template 1?
2. O formato principal do arquivo sera PDF, imagem, ou ambos?
3. O usuario deve escolher o template a cada proposta ou definir um template
   padrao nas configuracoes?
4. Desconto e condicoes de pagamento entram agora ou ficam para fase 2?
5. A proposta gerada deve usar sempre a marca atual ou salvar snapshot de logo e
   cores no momento da geracao?
6. "Versao mobile" significa mobile web no navegador ou o app nativo em
   `apps/mobile`?
7. Templates 2, 3 e 5 podem aguardar os campos estruturados ou precisam entrar
   visualmente no MVP com secoes opcionais?
8. O botao de WhatsApp deve marcar a proposta como enviada automaticamente ou
   manter a regra atual de o usuario marcar manualmente?

## Analise complementar 2026-05-15 - templates de paleta fixa

Contexto:

- Os templates existentes priorizam a identidade configurada pelo usuario.
- O novo pedido cria uma segunda categoria: modelos profissionais com cores
  estaticas, pensados para quem prefere uma proposta discreta e imponente sem
  depender da paleta cadastrada.

Objetivo:

- Adicionar pelo menos tres templates novos, diferentes dos atuais, com visual
  clean, profissional e paleta fixa.
- Avisar claramente no sistema que esses modelos nao usam as cores configuradas
  no perfil.

Impactos:

- Frontend deve registrar os novos templates no seletor, miniaturas, preview e
  renderer de documento.
- Backend deve aceitar os novos valores de template para persistencia em conta e
  proposta.
- A regra de logomarca permanece igual: logo do perfil substitui a marca visual
  do template.

Riscos:

- Usuario pode interpretar "cores estaticas" como bug se o aviso nao estiver
  visivel no card e no preview.
- Templates de paleta fixa precisam manter contraste suficiente mesmo com logos
  muito coloridas ou muito pequenas.
- Como esses modelos nao respeitam a cor da conta, eles devem ser apresentados
  como escolha consciente, nao como comportamento padrao.
