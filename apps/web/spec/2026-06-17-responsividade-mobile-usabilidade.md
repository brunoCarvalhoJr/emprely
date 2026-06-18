# Spec Web - Responsividade mobile e usabilidade do app

## Visao geral

Refatorar a experiencia mobile do app autenticado para que o Emprely funcione como ferramenta SaaS real em telas pequenas. O objetivo principal e remover a sidebar empilhada do topo, preservar acesso rapido a navegacao e priorizar as tarefas de maior valor: criar proposta, consultar listas, editar dados e compartilhar orcamentos.

Esta spec cobre comportamento esperado. A implementacao deve ser feita em etapa posterior e limitada ao comportamento descrito aqui.

## Principios de UX mobile

- Conteudo da tela atual aparece antes da navegacao completa.
- A navegacao completa existe, mas fica em drawer, sheet ou menu compacto.
- A acao principal da tela fica visivel e proxima ao contexto.
- Itens secundarios ficam atras de menus, secoes colapsaveis ou acoes contextuais.
- Nenhuma tela autenticada deve exigir scroll horizontal global.
- Alvos de toque devem ter pelo menos 44px de altura/largura util.
- Cards e paineis devem ter densidade operacional, sem aparencia de landing page.
- Texto longo deve quebrar linha sem estourar containers.
- O usuario deve conseguir voltar, cancelar e salvar sem perder contexto.

## Breakpoints

- `mobile`: ate 640px.
- `tablet`: 641px a 1023px.
- `desktop`: 1024px ou mais.

Comportamento esperado:

- Desktop mantem sidebar lateral fixa/recolhivel.
- Tablet pode usar sidebar compacta, topbar com drawer ou layout hibrido, desde que o conteudo apareca sem menu ocupando a tela inteira.
- Mobile usa shell especifico, sem sidebar empilhada no topo.

## Rotas

- `/` no app autenticado.
- Dashboard.
- Clientes.
- Servicos / Pacotes.
- Propostas.
- Conta / Configuracoes.
- Personalizacao.
- Suporte.
- Admin emails.
- Fluxo administrativo separado em `AdminApp`, quando aplicavel.

## Shell autenticado mobile

### Topbar mobile

Deve existir uma topbar compacta no mobile com:

- botao de menu;
- identificacao curta da conta ou marca atual;
- titulo ou contexto da tela atual;
- acao principal contextual quando houver espaco;
- opcionalmente avatar/logo da conta.

Regras:

- A topbar nao deve ultrapassar cerca de 72px de altura no estado padrao.
- Deve permanecer acessivel durante a navegacao, preferencialmente sticky.
- Deve respeitar safe areas de navegadores mobile quando aplicavel.
- Nao deve conter todos os itens da sidebar abertos por padrao.

### Menu mobile

O menu completo deve abrir sob demanda em drawer lateral, bottom sheet ou painel modal.

Deve conter:

- Dashboard;
- Clientes;
- Servicos / Pacotes;
- Propostas;
- Configuracoes;
- Personalizacao;
- Suporte;
- Admin emails, se o usuario tiver permissao/necessidade de acesso;
- alternancia de tema, se mantida no app;
- logout.

Regras:

- Ao tocar em uma rota, o menu fecha.
- Item ativo deve ser claro.
- Menu deve fechar por botao, `Esc`, clique fora/toque no backdrop e selecao de item.
- Foco deve ser controlado no menu enquanto aberto.
- O menu nao deve criar scroll horizontal.
- O bloco de marca Emprely nao deve aparecer antes do conteudo principal no mobile; se existir, deve ficar no fim do menu.

### Acoes rapidas globais

No mobile, a acao global preferencial e `Nova proposta`.

Regras:

- No Dashboard e Propostas, a acao principal deve criar proposta.
- Em Clientes, a acao principal deve criar cliente.
- Em Servicos / Pacotes, a acao principal deve criar servico.
- Acoes secundarias podem ficar em menu de acoes.
- Os botoes `+` da sidebar desktop nao precisam aparecer como itens fixos no mobile se houver acao contextual clara.

## Dashboard mobile

### Estrutura

A primeira dobra deve mostrar:

- contexto da conta;
- titulo/resumo curto;
- CTA principal `Cadastrar proposta` ou equivalente;
- acesso secundario a `Cadastrar servico` e `Cadastrar cliente` sem ocupar o topo inteiro.

Depois da dobra:

- metricas compactas;
- primeiros passos;
- propostas recentes;
- estados de carregamento, vazio e erro.

### Regras visuais

- Evitar hero alto demais.
- Evitar card dentro de card.
- Metricas devem ser escaneaveis em 1 ou 2 colunas.
- Propostas recentes devem aparecer como cards em mobile, com cliente, status, valor e acoes principais.

## Clientes mobile

### Lista

Clientes devem ser exibidos como cards em mobile.

Cada card deve priorizar:

- nome;
- telefone ou email principal;
- cidade/documento se disponivel;
- quantidade/status relevante, se existir;
- menu de acoes.

Acoes esperadas:

- visualizar;
- editar;
- criar proposta para cliente, se disponivel;
- excluir, com confirmacao.

### Busca e filtros

- Busca deve ficar acima da lista.
- Filtros secundarios devem ser colapsaveis, se existirem.
- O botao `Novo cliente` deve ficar visivel no cabecalho ou topbar contextual.

### Formulario

- Campos em uma coluna.
- Grupos secundarios, como redes sociais e endereco, podem ser colapsaveis.
- Acoes de salvar/cancelar devem ficar claras no fim do formulario; podem ser sticky se o formulario ficar longo.

## Servicos / Pacotes mobile

### Lista

Servicos devem ser exibidos como cards em mobile.

Cada card deve priorizar:

- nome;
- tipo: servico ou pacote;
- preco;
- unidade;
- categoria, se houver;
- menu de acoes.

### Formulario

- Campos em uma coluna.
- Preco e unidade devem ficar proximos.
- Tipo e categoria devem ser escolhas claras.
- Acoes de salvar/cancelar nao podem ficar escondidas apos conteudo longo sem alternativa de retorno.

## Propostas mobile

### Lista

Propostas devem ser exibidas como cards em mobile.

Cada card deve priorizar:

- numero/titulo;
- cliente;
- status;
- total;
- data/validade;
- acoes principais.

Acoes esperadas:

- visualizar;
- editar quando permitido;
- duplicar;
- gerar/enviar/aceitar/recusar conforme status;
- compartilhar por WhatsApp quando permitido;
- excluir/arquivar com confirmacao.

### Assistente de nova proposta

O assistente deve ser mobile-first:

- escolha inicial simples;
- selecao de cliente com busca e cards;
- opcao de criar cliente rapido sem sair do fluxo;
- retorno claro para lista.

### Wizard/formulario de proposta

Etapas:

1. Cliente.
2. Proposta.
3. Itens.
4. Detalhamento.
5. Revisao.

Regras mobile:

- Stepper deve ser compacto, horizontal scrollavel ou resumo por etapa atual.
- A etapa atual deve ser clara.
- Acoes `Voltar`, `Continuar`, `Salvar` e `Gerar` devem ser previsiveis.
- Itens da proposta devem ser cards editaveis, nao tabela.
- Campos monetarios e quantidade devem ter input adequado para teclado numerico.
- O total deve aparecer de forma persistente ou facil de encontrar durante edicao de itens.
- Revisao deve ser em secoes escaneaveis, com edicao contextual por secao.

### Visualizacao e preview de documento

Como o documento precisa manter fidelidade visual, o mobile deve oferecer:

- preview fiel com scroll/zoom quando necessario;
- acoes fixas ou facilmente acessiveis: baixar, imprimir, WhatsApp, editar, fechar;
- indicacao clara quando a proposta nao pode ser editada.

O preview nao pode quebrar o layout global do app nem esconder o botao de fechar.

### Compartilhamento WhatsApp

- Modal/sheet deve caber em `100dvh`.
- Opcoes devem ser cards verticais.
- Explicar apenas o necessario: enviar mensagem completa ou enviar arquivo/midia.
- Ao abrir WhatsApp, a acao deve fechar ou manter estado consistente.

## Conta / Configuracoes mobile

- Layout em uma coluna.
- Informacoes da conta devem ser compactas.
- Upload de logo deve ter area de toque clara.
- Campos de seguranca e troca de email/senha devem ser separados visualmente.
- Acoes de salvar devem ficar no fim da secao e nao se misturar com acoes perigosas.

## Personalizacao mobile

- Selecionar template em lista/card de uma coluna.
- Preview de template deve abrir em modal/sheet com scroll interno.
- Cores devem usar input apropriado e amostra visual.
- A configuracao de template padrao deve deixar claro qual template esta ativo.

## Suporte mobile

- Formulario em uma coluna.
- Campo de mensagem deve ter altura confortavel.
- Estados de envio, sucesso e erro devem aparecer perto do formulario.
- Deve haver caminho claro de volta ao dashboard/menu.

## Admin emails mobile

- A tela deve ser acessivel via menu secundario.
- Campo de busca/email deve ocupar largura completa.
- Historico deve aparecer em cards compactos.
- Se a funcionalidade for administrativa, considerar ocultar do menu principal de usuarios sem permissao.

## AdminApp mobile

O painel administrativo separado deve ser auditado e ajustado como fluxo proprio.

Regras esperadas:

- Header compacto com admin atual e acoes em menu.
- Filtros em bloco colapsavel.
- Usuarios em cards no mobile, nao tabela larga.
- Detalhe do usuario abaixo da lista ou em drawer/sheet.
- Modais administrativos com altura maxima `100dvh`, scroll interno e rodape de acoes fixo.

## Estados da interface

- Carregando: skeletons compactos, sem empurrar conteudo com altura exagerada.
- Vazio: texto curto com proxima acao clara.
- Erro: mensagem objetiva e botao de tentar novamente.
- Sucesso: toast ou mensagem inline sem cobrir a topbar/acoes.
- Editando: indicar alteracoes pendentes quando houver risco de perda.
- Confirmacao: dialog/sheet com acao primaria e cancelar visiveis.
- Menu aberto: foco preso, backdrop ativo, rolagem do fundo bloqueada.

## Componentes

- `MobileAppTopbar`
- `MobileNavigationDrawer` ou equivalente
- `MobilePrimaryAction`
- `ResponsiveListCard`
- `ResponsiveActionMenu`
- `MobileFilterPanel`
- `MobileProposalStepper`
- `MobileModalSheet`
- Ajustes em componentes existentes quando for mais simples que criar novos.

Os nomes finais devem seguir o padrao PortuguesIngles do repositorio quando forem componentes de dominio. Componentes puramente visuais podem manter nomenclatura coerente com o app existente.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | Esta spec nao adiciona campos novos. |

Regras gerais de formularios mobile:

- Inputs ocupam largura completa.
- Labels ficam sempre visiveis.
- Mensagens de erro aparecem logo abaixo do campo.
- Teclado adequado por tipo: telefone, email, moeda, numero.
- Acoes destrutivas ficam separadas das acoes de salvar.

## Integracao com API

- Sem alteracao de contrato de API.
- Sem novas chamadas obrigatorias.
- A implementacao deve preservar queries/mutations atuais.
- Mudancas de permissao/visibilidade de `Admin emails` podem exigir verificacao de regra de usuario, mas nao devem criar novo endpoint sem spec complementar.

## Criterios de aceite

- Em viewport `390x844`, o menu completo nao aparece aberto por padrao.
- Em viewport `390x844`, o Dashboard mostra conteudo util e CTA principal antes ou dentro da primeira dobra.
- Em viewport `390x844`, nao existe scroll horizontal global no `body`.
- Em viewport `390x844`, Clientes, Servicos e Propostas aparecem como cards legiveis.
- Em viewport `390x844`, acoes de lista nao sobrepoem texto e podem ser acionadas por toque.
- Em viewport `390x844`, formularios longos continuam salvaveis/cancelaveis sem perder contexto.
- Em viewport `390x844`, o wizard de proposta mostra etapa atual, total/acoes essenciais e nao exige tabela larga.
- Em viewport `390x844`, modais/sheets cabem na tela, com fechar e acao primaria visiveis.
- Em viewport `430x932`, a experiencia permanece equivalente sem cortes.
- Em viewport `768x1024`, o layout nao deve parecer desktop quebrado nem mobile esticado sem necessidade.
- Em desktop, a sidebar lateral e o comportamento existente devem continuar funcionando.
- Alvos de toque de botoes principais e itens de menu tem pelo menos 44px.
- Textos longos de cliente, email, proposta e servico quebram linha sem sair do container.
- Tema claro e escuro permanecem legiveis.
- Navegacao por teclado continua funcional em menus e modais.

## Fora de escopo

- Alterar contratos da API.
- Criar microservico ou app mobile nativo.
- Mover landing para `apps/landing`.
- Redesenhar identidade visual completa.
- Alterar regras de negocio de proposta, plano, trial ou permissao.
- Reescrever o app inteiro fora do escopo de responsividade.

## Testes

- Lint: `pnpm.cmd --dir apps/web lint`
- Build: `pnpm.cmd --dir apps/web build`
- E2E web, quando aplicavel: `pnpm.cmd --dir apps/web test:e2e`
- Cenarios manuais:
  - Dashboard mobile em 390x844 e 430x932.
  - Abrir/fechar menu mobile e navegar para cada tela.
  - Criar cliente em mobile.
  - Criar servico em mobile.
  - Criar proposta pelo assistente em mobile.
  - Editar item de proposta e revisar total em mobile.
  - Abrir preview/visualizacao de proposta em mobile.
  - Compartilhar proposta por WhatsApp em mobile.
  - Conta e personalizacao em mobile.
  - Admin emails em mobile.
  - AdminApp em mobile, se o fluxo estiver habilitado.
  - Desktop apos alteracoes para garantir que a sidebar nao regrediu.

## Evidencias de QA visual esperadas

Salvar screenshots ou registrar auditoria visual para:

- `390x844` Dashboard.
- `390x844` menu mobile aberto.
- `390x844` Clientes.
- `390x844` Servicos.
- `390x844` Propostas lista.
- `390x844` proposta em edicao.
- `390x844` preview/visualizacao de proposta.
- `768x1024` Dashboard.
- Desktop com sidebar expandida e recolhida.
