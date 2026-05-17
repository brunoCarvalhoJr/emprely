# Spec - Templates de orcamento, PDF/PNG e WhatsApp

## Visao geral

Implementar geracao de orcamento/proposta com template visual selecionavel,
usando os dados salvos da proposta e a identidade atual da conta. A feature deve
permitir que o usuario escolha um template padrao da conta, troque o template em
cada proposta, veja preview fiel, gere PDF e PNG sob demanda, e compartilhe pelo
fluxo adequado de WhatsApp no desktop, web mobile e app mobile.

O primeiro release deve entregar oito templates com fidelidade alta:

- os seis templates anexados pelo usuario;
- `Claymorphism`, com cards volumosos, sombras suaves e cores solidas;
- `Emprely`, com layout alinhado a identidade visual do sistema.

O template Comercial Minimalista sera o template inicial do sistema. O valor
legado `PadraoEnxuto`, quando existir em propostas antigas, deve ser tratado
como fallback para `ComercialMinimalista` no frontend e normalizado no backend
em novas gravacoes.

Atualizacao de fluxo de visualizacao:

- a acao de visualizar uma proposta deve abrir uma modal sobre a listagem, nao
  uma pagina inteira;
- a modal deve conter a proposta renderizada no template escolhido e somente uma
  acao principal: `Editar`;
- o botao `Editar` deve levar o usuario para a tela de edicao daquela proposta;
- PDF, imagem, WhatsApp, impressao, envio e alteracao de status nao devem
  aparecer como acoes na modal de visualizacao;
- a listagem continua sendo o ponto de partida para exportacao,
  compartilhamento e mudanca de status.

Atualizacao da tela de edicao:

- a tela de editar/nova proposta deve priorizar somente campos editaveis da
  proposta;
- nao deve existir preview fixo na lateral direita;
- deve existir uma acao `Preview` que abre a proposta em modal;
- as acoes da proposta devem ficar em uma barra lateral direita recolhida por
  padrao;
- a barra recolhida mostra apenas icones empilhados com tooltip;
- a barra expandida mostra os labels, mantendo os botoes empilhados;
- o botao de recolher/expandir deve usar icone de painel lateral, evitando
  icone de menu/hamburguer;
- `Novo Cliente` deve estar na barra lateral e abrir cadastro rapido em modal;
- a selecao de template deve sair do formulario e abrir em modal pela acao
  `Template`;
- acoes de PDF, imagem, impressao, texto, WhatsApp e compartilhamento nativo
  devem ficar agrupadas em uma modal aberta pela acao `Compartilhar`;
- a exportacao deve continuar funcionando por meio de uma renderizacao oculta da
  proposta, sem depender do preview visivel.
- a modal de templates deve usar cards sem corte de texto ou botoes, com
  miniaturas que comuniquem o layout real de cada template;
- no preview de template, deve haver retorno claro para a lista de templates e a
  acao de usar o template deve fechar o fluxo de selecao;
- modais devem fechar ao clicar fora do conteudo principal.

Atualizacao de refatoracao visual:

- os templates devem transmitir clareza, previsibilidade e credibilidade para
  propostas de social media;
- titulos longos devem reduzir tamanho sem sair do box;
- tabelas, cards, rodapes e CTAs devem aceitar nomes, emails e valores longos;
- o selo de trial nao pode cobrir titulo, logo, tabela ou bloco financeiro;
- blocos financeiros e CTAs devem manter contraste mesmo quando as cores da
  conta forem claras;
- documentos longos devem manter legibilidade na exportacao em PDF, usando
  multiplas paginas quando necessario.
- templates nao devem usar paletas fixas que contrariem as cores configuradas
  pelo usuario; cores fixas so podem existir como neutros de contraste.
- referencias externas de propostas de social media servem como benchmark de
  estrutura, mas nao devem ser copiadas literalmente.
- no maximo dois templates podem usar degrade como linguagem visual principal;
  os demais devem priorizar cores solidas, contraste e composicao moderna.
- campos opcionais vazios nao devem aparecer no documento e nao devem gerar
  textos como "nao informado".
- o desconto igual a zero deve ser tratado como campo nao preenchido no
  documento visual.
- o template `InstagramPremium` deve usar icone do Instagram no bloco de resumo.

## Escopo

### Inclui

- Template padrao da conta.
- Template especifico por proposta.
- Seletor visual de templates na criacao/edicao da proposta.
- Preview da proposta usando o template escolhido.
- Persistencia do template escolhido nos dados da proposta.
- Persistencia do template padrao nas configuracoes da conta.
- Campos comerciais avancados opcionais:
  - desconto fixo em reais;
  - condicoes de pagamento;
  - itens inclusos;
  - itens nao inclusos;
  - cronograma;
  - beneficios.
- Ocultar secoes sem conteudo.
- Exportacao sob demanda em PDF.
- Exportacao sob demanda em PNG.
- Impressao/salvar PDF pelo navegador como fallback.
- Compartilhamento mobile via recurso nativo quando suportado.
- Fluxo desktop com opcoes para baixar, abrir e copiar mensagem.
- Abertura de WhatsApp por `wa.me` somente com texto pronto.
- Explicacao no sistema sobre a limitacao de anexo automatico no WhatsApp Web.
- Suporte ao web app no celular.
- Suporte ao app nativo em `apps/mobile`.
- Testes e validacoes dos projetos impactados.

### Fora do escopo

- WhatsApp Business API.
- Envio automatico de PDF/PNG pelo WhatsApp sem acao do usuario.
- Salvar PDF ou PNG no backend.
- Historico de arquivos gerados.
- Link publico de proposta.
- Snapshot de logo/cores no momento da geracao.
- Assinatura digital.
- Checkout ou pagamento online.
- Editor visual livre de templates.

## Fluxo ponta a ponta

### 1. Configuracao da conta

1. Frontend carrega perfil da conta autenticada.
2. Usuario define dados de marca, cores, contatos, logo e template padrao.
3. Frontend envia a configuracao para o backend.
4. Backend valida e persiste o template padrao da conta.
5. Novas propostas usam esse template quando nenhum template especifico for
   escolhido.

### 2. Criacao de proposta no frontend

1. Usuario abre `Propostas`.
2. Frontend carrega clientes, servicos, perfil da conta e template padrao.
3. Usuario seleciona cliente, itens, validade e conteudos textuais.
4. Usuario escolhe um template no seletor visual.
5. Se nao escolher, o frontend usa o template padrao da conta.
6. Preview renderiza o template escolhido em tempo real.
7. Campos avancados opcionais aparecem em secoes proprias da proposta.
8. Secoes sem conteudo ficam ocultas no preview.
9. Ao salvar, frontend envia dados comerciais, campos avancados e template
   escolhido para a API.

### 3. Persistencia no backend

1. API recebe criacao ou edicao da proposta.
2. API valida cliente, itens, template permitido e valores comerciais.
3. Dominio cria ou atualiza a proposta.
4. Backend salva somente os dados estruturados da proposta.
5. Backend nao gera nem salva PDF/PNG.
6. API retorna a proposta com template e campos avancados.

### 4. Geracao da proposta

1. Usuario clica em `Gerar proposta`.
2. Frontend chama endpoint de geracao.
3. Backend valida plano, status e dados minimos.
4. Dominio muda status para `Gerada`.
5. API retorna proposta gerada.
6. Frontend passa a usar a proposta salva/gerada como fonte de verdade para
   preview, PDF, PNG e WhatsApp.

### 5. Alteracao de template em proposta gerada

1. Usuario tenta trocar o template de uma proposta ja gerada.
2. Frontend mostra confirmacao explicando que sera necessario gerar novamente.
3. Se o usuario cancelar, nada muda.
4. Se confirmar, frontend aplica a troca, salva a proposta e a API volta o
   status para `Rascunho`.
5. Usuario deve gerar novamente antes de exportar ou compartilhar.

### 6. Exportacao PDF/PNG

1. Usuario aciona exportacao na proposta gerada.
2. Frontend renderiza o template escolhido com dados salvos do backend.
3. Frontend gera PDF ou PNG sob demanda no dispositivo do usuario.
4. Arquivo nao e salvo no backend.
5. Se a geracao direta falhar, frontend oferece fallback de impressao/salvar PDF
   pelo navegador quando aplicavel.

### 7. WhatsApp no desktop

1. Usuario clica em `Enviar pelo WhatsApp`.
2. Sistema mostra opcoes:
   - baixar PDF;
   - baixar PNG;
   - abrir arquivo quando suportado;
   - copiar mensagem;
   - abrir WhatsApp com mensagem pronta.
3. Sistema explica que WhatsApp Web nao permite anexar automaticamente.
4. Frontend abre `wa.me` com texto pronto quando o usuario escolher abrir
   WhatsApp.
5. Usuario anexa manualmente o PDF ou PNG baixado/aberto.
6. Usuario marca a proposta como `Enviada` manualmente.

### 8. WhatsApp no web mobile

1. Usuario clica em `Enviar pelo WhatsApp`.
2. Frontend gera PDF ou PNG sob demanda.
3. Frontend verifica suporte de compartilhamento nativo com arquivo.
4. Se suportado, abre compartilhamento nativo com arquivo e texto.
5. Usuario escolhe WhatsApp e confirma envio.
6. Se nao suportado, cai para o fallback de baixar/abrir arquivo e `wa.me`.
7. Usuario marca a proposta como `Enviada` manualmente.

### 9. WhatsApp no app mobile

1. App mobile carrega proposta e perfil pelo backend.
2. App mobile renderiza ou solicita a composicao local do documento com o mesmo
   template e dados.
3. App mobile gera PDF ou PNG sob demanda no dispositivo.
4. App mobile chama compartilhamento nativo do sistema.
5. Usuario escolhe WhatsApp e confirma envio.
6. App mobile nao marca automaticamente como enviada.
7. Usuario marca como `Enviada` manualmente.

## Requisitos

### Requisitos funcionais

- RF01: O sistema deve possuir oito templates no primeiro release.
- RF02: O sistema nao deve exibir o template legado `PadraoEnxuto` para escolha.
- RF03: O template `ComercialMinimalista` deve ser o template inicial do sistema.
- RF04: A conta deve permitir configurar um template padrao.
- RF05: Cada proposta deve permitir escolher um template especifico.
- RF06: O template de uma nova proposta deve iniciar com o template padrao da
  conta.
- RF07: O preview deve refletir o template selecionado.
- RF07.1: O usuario deve conseguir visualizar cada template em tamanho ampliado
  antes de selecionar.
- RF08: O preview deve usar cores atuais da conta.
- RF09: O preview deve usar logo atual da conta.
- RF10: Se a conta nao tiver logo, o template deve usar fallback visual.
- RF11: A proposta deve salvar o template escolhido.
- RF12: A proposta deve salvar campos avancados opcionais.
- RF13: O desconto deve ser valor fixo em reais.
- RF14: O total final deve considerar subtotal menos desconto.
- RF15: O desconto nao pode gerar total final negativo.
- RF16: Secoes opcionais sem conteudo devem ser ocultadas.
- RF17: A proposta deve gerar PDF sob demanda.
- RF18: A proposta deve gerar PNG sob demanda.
- RF19: PDF/PNG nao devem ser persistidos no backend.
- RF20: Regerar arquivo deve usar os dados salvos no backend.
- RF21: A proposta deve permitir imprimir/salvar PDF pelo navegador como
  fallback.
- RF22: Desktop deve oferecer opcoes para baixar, abrir e copiar mensagem.
- RF23: Desktop deve abrir WhatsApp com texto pronto quando solicitado.
- RF24: Desktop deve explicar que anexo automatico no WhatsApp Web nao e
  suportado.
- RF25: Web mobile deve usar compartilhamento nativo quando o navegador suportar
  arquivos.
- RF26: Web mobile deve cair para fallback quando compartilhamento nativo nao
  suportar arquivo.
- RF27: App mobile deve usar compartilhamento nativo do sistema.
- RF28: Abrir WhatsApp ou compartilhar arquivo nao deve marcar proposta como
  `Enviada`.
- RF29: Marcar como `Enviada` deve continuar sendo acao manual.
- RF30: Alterar template de proposta gerada deve pedir confirmacao.
- RF31: Confirmar alteracao de template em proposta gerada deve voltar status
  para `Rascunho`.
- RF32: Cancelar alteracao de template em proposta gerada deve preservar status
  e template atual.
- RF33: Propostas com alteracoes locais nao salvas nao podem ser exportadas.
- RF34: Propostas arquivadas nao podem ser exportadas.
- RF35: Contas sem permissao comercial nao podem gerar, imprimir ou compartilhar
  propostas.

### Requisitos de dados

- Proposta deve armazenar:
  - template visual escolhido;
  - desconto fixo opcional;
  - condicoes de pagamento opcionais;
  - lista opcional de itens inclusos;
  - lista opcional de itens nao inclusos;
  - lista opcional de itens de cronograma;
  - lista opcional de beneficios;
  - observacoes finais quando aplicavel.
- Perfil da conta deve armazenar:
  - template padrao de proposta.
- API deve retornar todos os dados necessarios para reconstruir PDF/PNG sob
  demanda.
- Backend deve manter dados isolados por conta autenticada.
- Templates permitidos devem ser validados contra lista controlada.

### Requisitos nao funcionais

- Layouts devem ser responsivos no builder, mas o documento exportado deve ter
  comportamento previsivel em A4.
- Templates devem suportar conteudo real e textos longos sem sobreposicao.
- Templates devem suportar multiplas paginas quando houver muitos itens.
- Cores escolhidas pelo usuario devem manter contraste aceitavel.
- Exportacao PNG deve ter resolucao suficiente para leitura.
- Exportacao PDF deve preservar cores, textos, tabelas e logo.
- O modulo de exportacao deve ter fallback quando navegador nao suportar alguma
  API.
- Dependencias de PDF/PNG devem ser isoladas para nao degradar carregamento
  inicial do app.
- Nenhum token ou segredo de integracao deve existir no frontend.

## Regras de negocio

- RB01: Template padrao da conta e usado em novas propostas.
- RB02: Template por proposta sobrescreve o template padrao apenas naquela
  proposta.
- RB03: O usuario pode trocar o template antes de salvar a proposta.
- RB04: Trocar template em proposta `Gerada`, `Enviada`, `Aceita` ou `Recusada`
  exige confirmacao.
- RB05: Confirmada a troca, a proposta volta para `Rascunho`.
- RB06: A proposta so pode ser exportada quando estiver `Gerada` e sem
  alteracoes locais.
- RB07: Editar dados comerciais de uma proposta gerada tambem volta para
  `Rascunho`.
- RB08: PDF e PNG sao sempre gerados sob demanda a partir dos dados salvos.
- RB09: Backend salva dados, nao arquivos gerados.
- RB10: A marca usada no documento e sempre a marca atual da conta.
- RB11: Nao ha snapshot de marca no MVP.
- RB12: Desconto e opcional.
- RB13: Desconto e valor fixo em reais.
- RB14: Desconto maior que subtotal deve ser bloqueado ou limitado para impedir
  total negativo.
- RB15: Campos avancados sao opcionais.
- RB16: Secoes opcionais vazias nao aparecem no template.
- RB17: O sistema nao deve preencher secoes opcionais com texto inventado.
- RB18: Desconto zerado nao deve aparecer como linha de desconto no documento.
- RB18: `wa.me` so deve ser usado para texto pronto.
- RB19: O sistema deve explicar que WhatsApp Web nao anexa arquivo
  automaticamente.
- RB20: Compartilhamento mobile abre a folha nativa, mas o usuario confirma o
  envio.
- RB21: Status `Enviada` e sempre manual no MVP.
- RB22: WhatsApp Business API esta fora desta entrega.

## Impactos por projeto

### `apps/web`

- Criar estrutura de templates de proposta.
- Criar registry dos oito templates.
- Tratar `PadraoEnxuto` apenas como valor legado normalizado para
  `ComercialMinimalista`.
- Implementar os seis templates anexados com fidelidade alta.
- Implementar os templates adicionais `Claymorphism` e `Emprely`.
- Substituir preview unico por renderer baseado no template selecionado.
- Adicionar seletor visual de template no fluxo de proposta.
- Adicionar campos avancados opcionais ao formulario.
- Adicionar configuracao de template padrao na tela de conta.
- Atualizar tipos TypeScript da proposta e perfil.
- Atualizar chamadas API para enviar/receber novos campos.
- Implementar calculo de subtotal, desconto e total final no preview.
- Implementar exportacao PDF e PNG sob demanda.
- Implementar fallback de impressao/salvar PDF.
- Implementar fluxo WhatsApp desktop com baixar, abrir, copiar mensagem e abrir
  `wa.me`.
- Implementar fluxo web mobile com deteccao de compartilhamento nativo.
- Adicionar microcopy de limitacao do WhatsApp Web.
- Validar visualmente desktop/mobile e print/export.
- Atualizar testes e e2e quando aplicavel.

### `apps/api`

- Persistir template visual escolhido na proposta.
- Persistir template padrao no perfil/configuracao da conta.
- Persistir campos avancados opcionais na proposta.
- Validar template permitido.
- Validar desconto fixo e total nao negativo.
- Retornar novos campos no `PropostaResponse`.
- Aceitar novos campos em `CreatePropostaRequest` e `UpdatePropostaRequest`.
- Ajustar dominio para resetar status quando template/campos relevantes mudarem.
- Ajustar EF Core e migrations.
- Atualizar testes unitarios de dominio.
- Atualizar testes de integracao dos endpoints de proposta e perfil.
- Nao gerar nem salvar PDF/PNG no backend nesta entrega.

### `apps/mobile`

- Reutilizar contratos da API.
- Exibir template escolhido e dados da proposta.
- Gerar PDF e PNG sob demanda no dispositivo ou usar renderer equivalente
  definido na implementacao.
- Usar compartilhamento nativo do sistema.
- Manter status `Enviada` como acao manual.
- Respeitar template padrao da conta e template por proposta.
- Evitar duplicar regras comerciais fora da API.

### `packages/shared-types`

- Avaliar centralizacao de tipos compartilhados de template, proposta e campos
  avancados.
- Evitar divergencia entre web e mobile.

### `packages/design-tokens`

- Avaliar tokens compartilhados para cores neutras, espacos, tipografia e
  contraste dos templates.
- Garantir que cores da conta sejam aplicadas com fallback de contraste.

### `docs` e SDD

- Documentar comportamento de PDF/PNG sob demanda.
- Documentar limitacao do WhatsApp Web.
- Documentar diferenca entre desktop, web mobile e app mobile.
- Atualizar docs do fluxo de propostas quando a implementacao for concluida.

## Integracoes

### API interna

- `GET/PUT /api/account/profile` deve incluir template padrao da conta.
- `GET/POST/PUT /api/proposals` deve incluir template escolhido e campos
  avancados.
- `POST /api/proposals/{id}/generate` deve continuar sendo a transicao para
  liberar exportacao.
- `POST /api/proposals/{id}/send` continua marcacao manual de envio.

### WhatsApp

- `wa.me` deve ser usado apenas para abrir conversa com texto pronto.
- Nao anexar arquivo automaticamente no WhatsApp Web.
- Nao integrar WhatsApp Business API nesta entrega.

### Navegador

- Usar capacidade nativa de compartilhamento de arquivos quando suportada.
- Usar download/abrir arquivo como fallback.
- Usar impressao do navegador como fallback de PDF.

### Sistema mobile

- App mobile deve usar compartilhamento nativo do sistema operacional.
- O destino WhatsApp e escolhido pelo usuario.

## Criterios de aceitacao

### Template e preview

- CA01: Usuario consegue ver oito templates disponiveis.
- CA02: `ComercialMinimalista` aparece como template inicial.
- CA03: Usuario consegue definir template padrao da conta.
- CA04: Nova proposta inicia com o template padrao da conta.
- CA05: Usuario consegue trocar template em uma proposta.
- CA06: Preview muda imediatamente ao trocar template.
- CA06.1: Usuario consegue abrir uma visualizacao ampliada de cada template a
  partir do seletor.
- CA07: Todos os templates usam logo atual da conta ou fallback.
- CA08: Todos os templates usam cores atuais da conta com contraste aceitavel.
- CA09: Todos os templates ocultam secoes opcionais vazias.
- CA10: Todos os oito templates passam por validacao visual desktop e mobile.

### Dados e backend

- CA11: API salva template escolhido na proposta.
- CA12: API salva template padrao da conta.
- CA13: API salva campos avancados opcionais.
- CA14: Desconto fixo em reais altera total final.
- CA15: API bloqueia total final negativo.
- CA16: API retorna dados suficientes para reconstruir PDF/PNG.
- CA17: Backend nao salva PDF nem PNG.
- CA18: Arquivo gerado depois de recarregar a proposta usa dados salvos no
  backend.

### Status e regras comerciais

- CA19: Proposta `Rascunho` nao libera exportacao.
- CA20: Proposta `Gerada` sem alteracoes libera PDF/PNG/WhatsApp.
- CA21: Trocar template de proposta gerada pede confirmacao.
- CA22: Cancelar confirmacao preserva template e status.
- CA23: Confirmar troca salva a alteracao e volta status para `Rascunho`.
- CA24: Abrir WhatsApp ou compartilhar arquivo nao marca como enviada.
- CA25: Usuario consegue marcar proposta como `Enviada` manualmente.
- CA26: Conta bloqueada por regra comercial nao consegue gerar/exportar.

### Exportacao

- CA27: Usuario consegue gerar PDF sob demanda.
- CA28: Usuario consegue gerar PNG sob demanda.
- CA29: PDF usa o mesmo template do preview.
- CA30: PNG usa o mesmo template do preview.
- CA31: PDF e PNG incluem logo, cores, cliente, itens, totais e campos
  opcionais preenchidos.
- CA32: Conteudo longo nao sobrepoe texto ou elementos.
- CA33: Documento com muitos itens continua legivel e exportavel.
- CA34: Fallback de impressao/salvar PDF continua disponivel.

### WhatsApp desktop

- CA35: Desktop mostra opcoes para baixar, abrir e copiar mensagem.
- CA36: Desktop abre WhatsApp com texto pronto quando solicitado.
- CA37: Desktop mostra explicacao de que o anexo e manual no WhatsApp Web.
- CA38: Mensagem copiada/pronta menciona que o orcamento detalhado segue em
  anexo.

### Web mobile e app mobile

- CA39: Web mobile tenta compartilhamento nativo quando suportado.
- CA40: Web mobile usa fallback quando compartilhamento de arquivo nao e
  suportado.
- CA41: App mobile gera/compartilha arquivo pelo compartilhamento nativo.
- CA42: Mobile nao marca proposta como enviada automaticamente.

### Validacao tecnica

- CA43: `pnpm --dir apps/web lint` passa.
- CA44: `pnpm --dir apps/web build` passa.
- CA45: Testes e2e web cobrem selecao de template e fallback principal de
  exportacao/WhatsApp quando possivel.
- CA46: `dotnet build apps/api/Emprely.sln` passa.
- CA47: Testes de API passam.
- CA48: Testes de dominio cobrem template, desconto e reset de status.
- CA49: Validacoes do app mobile passam quando a implementacao mobile for feita.

## Estrategia de implementacao

### 1. Modelagem e contratos

- Definir lista controlada de templates.
- Adicionar template padrao ao perfil/configuracao da conta.
- Adicionar template escolhido e campos avancados a proposta.
- Adicionar desconto fixo em reais.
- Ajustar requests/responses da API.
- Criar migration.
- Atualizar testes de dominio e integracao.

### 2. Base de renderizacao no web

- Extrair um view model de documento de proposta.
- Criar registry de templates.
- Criar renderer unico que escolhe componente pelo template.
- Criar componentes dos oito templates.
- Aplicar marca atual da conta no renderer.
- Ocultar secoes opcionais vazias.
- Validar visualmente os oito templates com dados curtos e longos.

### 3. Fluxo de proposta no web

- Adicionar seletor visual de template.
- Adicionar campos avancados opcionais.
- Integrar template padrao da conta.
- Integrar template por proposta.
- Implementar confirmacao de troca em proposta gerada.
- Garantir bloqueio de exportacao com alteracoes locais.

### 4. Exportacao web

- Escolher e integrar estrategia client-side para PDF e PNG.
- Isolar exportacao em modulo proprio.
- Manter fallback com `window.print()`.
- Garantir que PDF/PNG usem dados salvos da proposta.
- Tratar falhas de logo/CORS e fallback visual.
- Validar resolucao e legibilidade do PNG.

### 5. WhatsApp web

- Criar mensagem padrao de WhatsApp.
- Criar painel/opcoes de desktop: baixar, abrir, copiar mensagem e abrir
  WhatsApp.
- Implementar deteccao de compartilhamento nativo no web mobile.
- Implementar fallback quando compartilhamento de arquivo nao existir.
- Incluir microcopy clara sobre anexos manuais no WhatsApp Web.

### 6. App mobile

- Reutilizar contratos da API.
- Implementar exibicao/geracao do documento conforme estrategia mobile
  definida.
- Integrar compartilhamento nativo.
- Preservar marcacao manual de envio.

### 7. QA e validacao

- Testar todos os templates com:
  - sem logo;
  - com logo;
  - cores claras;
  - cores escuras;
  - poucos itens;
  - muitos itens;
  - campos opcionais vazios;
  - campos opcionais preenchidos.
- Validar desktop, web mobile e app mobile.
- Validar PDF e PNG.
- Validar que backend nao persiste arquivos gerados.
- Atualizar documentacao depois da implementacao.

## Riscos

- Alta complexidade visual por exigir oito templates com fidelidade alta no
  primeiro release.
- Exportacao PDF/PNG pode divergir do preview dependendo da biblioteca.
- Web Share API tem suporte inconsistente entre navegadores.
- WhatsApp Web nao permite anexo automatico e pode gerar expectativa errada.
- Conteudo real pode estourar templates originalmente desenhados para uma pagina.
- Logo servida pela API pode exigir cuidado de CORS na exportacao por canvas.
- Usar marca atual sem snapshot significa que propostas antigas podem mudar de
  aparencia ao trocar logo/cores da conta.
- Implementar web e mobile no mesmo escopo aumenta o risco de prazo.

## Validacao esperada

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `pnpm --dir apps/web test:e2e`, se aplicavel ao ambiente
- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln`
- validacao mobile especifica quando a implementacao em `apps/mobile` existir

## Atualizacao 2026-05-15 - templates profissionais com cores estaticas

- A selecao de templates passa a incluir tres modelos adicionais com paleta fixa:
  `ExecutivoEditorial`, `CorporativoBoard` e `InstitucionalClean`.
- Esses templates sao intencionalmente diferentes dos modelos que respeitam as
  cores configuradas pelo usuario. Eles usam cores estaticas para preservar uma
  aparencia mais profissional, clean, discreta e imponente em qualquer conta.
- A logomarca, nome comercial, contatos e dados da proposta continuam vindo do
  perfil/proposta do usuario.
- A interface deve avisar que esses modelos usam cores estaticas. O aviso deve
  aparecer no card do template e na visualizacao antes de escolher o template.
- Campos opcionais vazios continuam ocultos no documento final.
- Os tres novos templates nao devem usar degradê como base visual; a composicao
  deve depender de tipografia, espaco em branco, bordas finas, contraste e
  hierarquia editorial.
