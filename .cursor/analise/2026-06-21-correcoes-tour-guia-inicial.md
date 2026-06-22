# Análise: correções do tour e guia inicial

## Contexto

Na vistoria assistida com Chrome, o guia inicial abriu corretamente e o tour
contextual percorreu as oito etapas, mas a experiência ainda apresentou falhas
de UX:

- o overlay do React Joyride permaneceu visível depois de concluir o tour;
- alguns tooltips ficaram mal posicionados em viewport desktop largo;
- textos do tour e da guia inicial estavam sem acentos;
- os status da guia inicial podiam contradizer o progresso real do dashboard;
- a primeira etapa explicava a ordem do tour de forma confusa.

## Decisão

Manter o React Joyride e a arquitetura atual, mas tornar o encerramento do tour
mais defensivo: parar o run, forçar remount por chave, limpar artefatos do
Joyride em múltiplos frames e centralizar a lógica de encerramento. Também
ajustar os textos e status exibidos para ficarem alinhados ao estado real da
conta.

## Evolução de UX

Depois da vistoria, o fluxo do tour foi reorientado para formar primeiro o mapa
mental do usuário. Antes de pedir que ele configure dados ou crie uma proposta,
o tour deve explicar os menus principais:

- Dashboard: visão geral, progresso e atalhos.
- Clientes: cadastro organizado para reduzir retrabalho.
- Serviços/Pacotes: biblioteca reutilizável de escopo, entregas e valores.
- Propostas: acompanhamento do funil comercial por status.
- Suporte: canal separado de atendimento.
- Conta e personalização: onde a marca e os documentos são configurados.

Só depois dessa orientação o tour deve conduzir para configuração da conta,
marca, templates, cores/formato e criação do primeiro orçamento. Os textos devem
destacar vantagens práticas da Emprely: velocidade, padronização, proposta mais
profissional, envio por PDF/imagem/WhatsApp e acompanhamento até o aceite.

## Critérios de aceite

- Abrir guia inicial e iniciar o tour sem erro.
- Navegar pelas oito etapas com textos em português correto.
- Etapa de template e formato não deve cortar o tooltip em desktop.
- Concluir ou pular o tour deve remover tooltip, overlay e spotlight.
- Guia inicial deve mostrar status coerente com os dados reais da conta.
- Console do navegador não deve registrar erro durante o tour.
- O tour deve explicar os menus antes de orientar a configuração da conta.
- O tour deve apresentar templates e criação de orçamento destacando vantagens
  do sistema.
