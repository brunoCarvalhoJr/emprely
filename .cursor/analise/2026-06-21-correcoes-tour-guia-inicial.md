# Analise: correcoes do tour e guia inicial

## Contexto

Na vistoria assistida com Chrome, o guia inicial abriu corretamente e o tour
contextual percorreu as oito etapas, mas a experiencia ainda apresentou falhas
de UX:

- o overlay do React Joyride permaneceu visivel depois de concluir o tour;
- alguns tooltips ficaram mal posicionados em viewport desktop largo;
- textos do tour e da guia inicial estavam sem acentos;
- os status da guia inicial podiam contradizer o progresso real do dashboard;
- a primeira etapa explicava a ordem do tour de forma confusa.

## Decisao

Manter o React Joyride e a arquitetura atual, mas tornar o encerramento do tour
mais defensivo: parar o run, forcar remount por chave, limpar artefatos do
Joyride em multiplos frames e centralizar a logica de encerramento. Tambem
ajustar os textos e status exibidos para ficarem alinhados ao estado real da
conta.

## Evolucao de UX

Depois da vistoria, o fluxo do tour foi reorientado para formar primeiro o mapa
mental do usuario. Antes de pedir que ele configure dados ou crie uma proposta,
o tour deve explicar os menus principais:

- Dashboard: visao geral, progresso e atalhos.
- Clientes: cadastro organizado para reduzir retrabalho.
- Servicos/Pacotes: biblioteca reutilizavel de escopo, entregas e valores.
- Propostas: acompanhamento do funil comercial por status.
- Suporte: canal separado de atendimento.
- Conta e personalizacao: onde a marca e os documentos sao configurados.

So depois dessa orientacao o tour deve conduzir para configuracao da conta,
marca, templates, cores/formato e criacao do primeiro orcamento. Os textos devem
destacar vantagens praticas da Emprely: velocidade, padronizacao, proposta mais
profissional, envio por PDF/imagem/WhatsApp e acompanhamento ate o aceite.

## Criterios de aceite

- Abrir guia inicial e iniciar o tour sem erro.
- Navegar pelas oito etapas com textos em portugues correto.
- Etapa de template e formato nao deve cortar o tooltip em desktop.
- Concluir ou pular o tour deve remover tooltip, overlay e spotlight.
- Guia inicial deve mostrar status coerente com os dados reais da conta.
- Console do navegador nao deve registrar erro durante o tour.
- O tour deve explicar os menus antes de orientar a configuracao da conta.
- O tour deve apresentar templates e criacao de orcamento destacando vantagens
  do sistema.
