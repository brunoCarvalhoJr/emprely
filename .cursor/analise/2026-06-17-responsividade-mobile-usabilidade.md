# Analise Web - Responsividade mobile e usabilidade do app

## Contexto

O app autenticado do Emprely precisa funcionar bem em mobile como ferramenta SaaS operacional. O print recebido em 2026-06-17 mostra que, em uma tela de celular, o menu ocupa quase todo o primeiro viewport antes do conteudo principal do dashboard. Isso impede que a tarefa principal, criar orcamentos/propostas, apareca cedo o bastante.

O comportamento atual vem do shell autenticado:

- `apps/web/src/App.tsx` renderiza a sidebar inteira antes do conteudo quando ha `usuario` e `conta`.
- `apps/web/src/styles.css` transforma `.app-frame-auth` em coluna abaixo de `1023px`.
- Abaixo de `640px`, `.sidebar-menu` vira uma coluna unica, empilhando Dashboard, Clientes, Servicos / Pacotes, Propostas, Suporte, Admin emails e o bloco da marca.

Essa solucao preserva acesso aos itens, mas nao prioriza a usabilidade mobile.

## Objetivo do fluxo

Melhorar a experiencia mobile do app web autenticado para que o usuario consiga:

- identificar rapidamente onde esta;
- acessar o menu sem que ele ocupe a tela inteira;
- criar proposta, cliente ou servico com poucos toques;
- navegar por dashboard, listas, formularios e proposta sem scroll horizontal global;
- usar modais, cards e acoes com alvos de toque confortaveis.

## Rotas e areas impactadas

- App autenticado em `/`.
- Dashboard.
- Clientes.
- Servicos / Pacotes.
- Propostas, incluindo assistente, formulario, revisao, visualizacao e compartilhamento.
- Conta / Configuracoes.
- Personalizacao.
- Suporte.
- Admin emails dentro do app autenticado.
- `AdminApp` separado, quando acessado pelo fluxo administrativo.

## Componentes impactados

- Shell autenticado: `app-frame-auth`, `app-sidebar`, `app-content`, `app-content-body`.
- Navegacao principal: `navegacaoPrincipal`, itens ativos, acoes rapidas com `+`.
- Conta no topo/menu: `sidebar-account`, `sidebar-account-menu`.
- Listagens: `data-table`, `data-table-shell`, `ListagemAcoes`.
- Cabecalhos: `page-heading`, `page-heading-actions`, `page-heading-action`.
- Dashboard: hero, metricas, primeiros passos e propostas recentes.
- Fluxo de proposta: `proposal-wizard-*`, `proposal-builder-*`, `proposal-review-*`, `proposal-action-rail`.
- Modais: visualizacao de proposta, preview de template, compartilhamento WhatsApp, cliente rapido e confirmacao.
- Formulario de perfil/personalizacao: grids e areas de upload/template.
- Admin: filtros, tabela de usuarios, detalhe lateral e modais administrativos.

## Diagnostico de usabilidade

### Problema critico

No mobile, a navegacao vira conteudo de pagina. O usuario precisa rolar para chegar ao dashboard e aos CTAs. Isso quebra a prioridade da tela inicial e deixa a aplicacao com comportamento de desktop comprimido.

### Problemas de prioridade

- A acao "Cadastrar proposta" deve ser a acao mais acessivel no dashboard mobile.
- Acesso a Clientes e Servicos e importante, mas nao deve consumir o topo inteiro.
- Suporte e Admin emails sao secundarios para a maioria dos usuarios e devem ficar em menu.
- O bloco de marca no rodape da sidebar nao tem valor suficiente para aparecer antes do conteudo no mobile.

### Problemas de layout

- O shell mobile atual empilha muitos blocos antes do conteudo.
- Tabelas ja viram cards em larguras menores, mas precisam de auditoria visual com dados longos.
- Alguns modais usam documentos ou previews largos, adequados para desktop, mas pesados em mobile.
- Acoes de pagina viram botoes full-width, o que e bom em formularios, mas pode pesar em listas com muitas acoes.

## Hipoteses de solucao

1. Substituir a sidebar mobile por uma topbar compacta e um menu off-canvas.
2. Manter a sidebar fixa/recolhivel somente em desktop/tablet largo.
3. Usar bottom navigation apenas para as 3 ou 4 areas mais frequentes, se nao conflitar com a barra de acoes de proposta.
4. Priorizar CTA principal contextual:
   - Dashboard: Nova proposta.
   - Clientes: Novo cliente.
   - Servicos: Novo servico.
   - Propostas: Nova proposta.
5. Transformar conteudo secundario em menus, drawers, sheets ou secoes colapsaveis.

## Duvidas de negocio e produto

- `Admin emails` deve aparecer para todos os usuarios no mobile ou deve ficar restrito/oculto em menu secundario?
- A acao principal global deve ser sempre "Nova proposta" ou deve mudar conforme a tela atual?
- No mobile, a navegacao deve ser drawer lateral, bottom sheet ou bottom navigation?
- O app deve priorizar usuarios que criam propostas no celular ou apenas consulta/ajustes rapidos?
- A visualizacao do documento da proposta no celular deve ser leitura responsiva ou preview fiel com zoom/scroll?

## Recomendacao inicial

Adotar um shell mobile especifico:

- Topbar fixa com conta, nome da tela, botao de menu e acao principal.
- Drawer/menu com navegacao completa, configuracoes, personalizacao, suporte, admin emails e logout.
- Conteudo principal com padding menor e sem o bloco de sidebar no topo.
- Listagens em cards com informacoes essenciais e menu de acoes.
- Proposta com fluxo orientado por etapas, acoes fixas previsiveis e revisao escaneavel.

## Riscos

- Alterar o shell pode afetar navegacao, foco, descarte de alteracoes e menus de conta.
- Bottom navigation pode conflitar com a barra de acoes da proposta.
- Manter dois shells, desktop e mobile, pode duplicar logica se nao for componentizado.
- O preview fiel da proposta pode exigir zoom/scroll e nao deve ser confundido com leitura responsiva do conteudo.

## Criterios de investigacao antes de implementar

- Validar screenshots em 390x844, 430x932, 768x1024 e desktop.
- Testar com usuario autenticado, listas vazias e listas com textos longos.
- Testar drawer/menu com teclado e leitor de tela.
- Confirmar que nao ha scroll horizontal global no `body`.
- Confirmar que a primeira dobra mobile mostra conteudo util da tela atual.
