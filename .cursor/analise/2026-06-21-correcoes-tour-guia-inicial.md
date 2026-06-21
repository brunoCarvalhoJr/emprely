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

## Criterios de aceite

- Abrir guia inicial e iniciar o tour sem erro.
- Navegar pelas oito etapas com textos em portugues correto.
- Etapa de template e formato nao deve cortar o tooltip em desktop.
- Concluir ou pular o tour deve remover tooltip, overlay e spotlight.
- Guia inicial deve mostrar status coerente com os dados reais da conta.
- Console do navegador nao deve registrar erro durante o tour.
