# Spec - Corrigir tour guiado mobile

## Objetivo

Corrigir o fluxo de onboarding em celular para que o guia nao seja obrigatorio,
nao entre em loop entre modal e perfil da conta, e o tour guiado acompanhe a
tela com scroll automatico quando iniciado pelo usuario.

## Escopo

Inclui:

- Desabilitar inicio automatico do tour guiado.
- Renomear a acao de adiamento para "Pular guia".
- Ao fechar, pular ou iniciar uma jornada, dispensar a modal na sessao atual.
- Manter registro backend dos eventos de pulo e de inicio/conclusao do tour.
- Melhorar scroll automatico do alvo do tour em mobile.
- Adicionar cobertura Playwright mobile para pular, configurar conta e iniciar
  tour guiado.

Fora do escopo:

- Novos endpoints.
- Nova tabela ou migration.
- Reescrita completa de UX do onboarding.
- Deploy automatico.

## Fluxo esperado

1. Usuario autenticado abre o app em viewport mobile.
2. Se a API indicar onboarding automatico, a modal inicial pode aparecer.
3. Usuario pode clicar em "Pular guia"; a modal fecha e nao reabre na mesma
   sessao.
4. Usuario pode clicar em "Configurar conta"; o app navega para "Perfil da
   conta" e a modal nao reabre na mesma sessao.
5. Usuario pode clicar em "Ver tour guiado"; o tour inicia somente por esse
   clique.
6. Durante o tour, a view e o menu mobile acompanham a etapa atual e o alvo e
   levado para uma posicao visivel por scroll automatico.
7. Usuario pode pular o tour a qualquer momento.

## Criterios de aceite

- O tour guiado nao inicia sozinho em conta com `tour.status = NaoIniciado`.
- A modal possui uma acao clara "Pular guia".
- Ao pular, a modal fica fechada na sessao atual.
- Ao configurar conta, a tela "Perfil da conta" fica ativa e a modal nao volta.
- Ao iniciar o tour manualmente no mobile, o Joyride exibe controles de proximo
  e pular.
- Pelo menos um teste Playwright mobile cobre o fluxo corrigido.

## Validacao

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `pnpm --dir apps/web test:e2e`

## Extensao - auditoria de navegacao mobile

O fluxo autenticado mobile tambem deve validar:

- botoes do rodape levam para Inicio, Propostas, Clientes e Servicos;
- drawer "Mais" abre e fecha corretamente;
- acoes rapidas do drawer abrem Nova proposta, Novo cliente e Novo pacote;
- Perfil da conta e Suporte sao acessiveis pelo drawer;
- alternancia Claro/Escuro funciona no mobile;
- envio de suporte mostra retorno de sucesso;
- nao ha overflow horizontal apos navegar pelos fluxos principais.
