# Spec Web - Correções do tour e guia inicial

## Objetivo

Corrigir os problemas encontrados na vistoria assistida do guia inicial do
Emprely, mantendo o fluxo atual de onboarding, checklist e React Joyride.

## Escopo

- Ajustar textos do tour e da modal de guia inicial.
- Reordenar o tour para explicar menus antes dos passos operacionais.
- Corrigir encerramento do Joyride para não deixar overlay preso.
- Ajustar posicionamento e estilos do tooltip para reduzir cortes em desktop.
- Exibir status da guia inicial a partir do estado real de conclusão.

## Fora de escopo

- Alterar contratos de API ou banco.
- Criar uma biblioteca nova de UI.
- Redesenhar todo o onboarding.

## Aceite

1. Clicar em "Abrir guia inicial" abre a modal corretamente.
2. "Ver tour rápido" inicia o tour contextual.
3. O tour navega por dashboard, configurações, personalização e volta ao
   dashboard.
4. Todos os títulos, botões e textos do tour aparecem com acentuação correta.
5. O tooltip não deve ficar cortado em desktop largo nas etapas de template e
   formato de envio.
6. Ao clicar em "Concluir", a tela volta ao estado normal sem overlay escuro.
7. Ao clicar em "Pular", a tela volta ao estado normal sem overlay escuro.
8. A modal de guia inicial mostra status coerente com os dados reais: conta
   concluída quando o perfil mínimo está completo e proposta concluída quando
   já existe proposta gerada.
9. O tour inicia pelo mapa dos menus: Dashboard, Clientes, Serviços/Pacotes,
   Propostas, Suporte e Conta/Personalização.
10. Depois dos menus, o tour orienta configuração da conta, logomarca,
    templates, cores/formato e criação do primeiro orçamento.
11. Os textos do tour destacam vantagens do sistema: organização, reutilização
    de serviços, propostas profissionais, envio em formatos comerciais e
    acompanhamento do aceite.
12. Depois que a primeira proposta já foi gerada, o dashboard não deve manter
    chamada de "primeira proposta" nem exibir o botão "Abrir guia inicial" nessa
    área principal.
