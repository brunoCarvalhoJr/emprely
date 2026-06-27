# Spec Web - Correcoes do tour e guia inicial

## Objetivo

Corrigir os problemas encontrados na vistoria assistida do guia inicial do
Emprely, mantendo o fluxo atual de onboarding, checklist e React Joyride.

## Escopo

- Ajustar textos do tour e da modal de guia inicial.
- Reordenar o tour para explicar menus antes dos passos operacionais.
- Corrigir encerramento do Joyride para nao deixar overlay preso.
- Corrigir inicio explicito do tour para sempre comecar no passo 1.
- Corrigir navegacao de voltar entre views diferentes do tour.
- Evitar reabertura automatica da modal na mesma sessao apos concluir ou pular
  o tour.
- Ajustar posicionamento e estilos do tooltip para reduzir cortes em desktop.
- Exibir status da guia inicial a partir do estado real de conclusao.

## Fora de escopo

- Alterar contratos de API ou banco.
- Criar uma biblioteca nova de UI.
- Redesenhar todo o onboarding.

## Aceite

1. Clicar em "Abrir guia inicial" abre a modal corretamente.
2. "Ver tour guiado" inicia o tour contextual.
3. O tour navega por dashboard, configuracoes, personalizacao e volta ao
   dashboard.
4. Todos os titulos, botoes e textos do tour aparecem com acentuacao correta.
5. O tooltip nao deve ficar cortado em desktop largo nas etapas de template e
   formato de envio.
6. Ao clicar em "Concluir", a tela volta ao estado normal sem overlay escuro.
7. Ao clicar em "Pular", a tela volta ao estado normal sem overlay escuro.
8. A modal de guia inicial mostra status coerente com os dados reais: conta
   concluida quando o perfil minimo esta completo e proposta concluida quando
   ja existe proposta gerada.
9. O tour inicia pelo mapa dos menus: Dashboard, Clientes, Servicos/Pacotes,
   Propostas, Suporte e Conta/Personalizacao.
10. Depois dos menus, o tour orienta configuracao da conta, logomarca,
    templates, cores/formato e criacao do primeiro orcamento.
11. Os textos do tour destacam vantagens do sistema: organizacao, reutilizacao
    de servicos, propostas profissionais, envio em formatos comerciais e
    acompanhamento do aceite.
12. Depois que a primeira proposta ja foi gerada, o dashboard nao deve manter
    chamada de "primeira proposta" nem exibir o botao "Abrir guia inicial" nessa
    area principal.
13. Ao clicar explicitamente em "Ver tour guiado" dentro da modal, o tour deve
    iniciar no passo 1/11 em Dashboard, mesmo quando o backend retornar
    `tour.status = EmAndamento`.
14. No passo 7/11, clicar em "Voltar" deve exibir o passo 6/11 em vez de
    encerrar o tour.
15. Apos clicar em "Concluir" ou "Pular" no tour, a modal do guia inicial nao
    deve reabrir automaticamente na mesma sessao, ainda que
    `deveAbrirAutomaticamente` continue verdadeiro porque a configuracao da
    conta segue pendente.
