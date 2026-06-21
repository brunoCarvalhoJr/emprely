# Spec Web - Correcoes do tour e guia inicial

## Objetivo

Corrigir os problemas encontrados na vistoria assistida do guia inicial do
Emprely, mantendo o fluxo atual de onboarding, checklist e React Joyride.

## Escopo

- Ajustar textos do tour e da modal de guia inicial.
- Corrigir encerramento do Joyride para nao deixar overlay preso.
- Ajustar posicionamento e estilos do tooltip para reduzir cortes em desktop.
- Exibir status da guia inicial a partir do estado real de conclusao.

## Fora de escopo

- Alterar contratos de API ou banco.
- Criar uma biblioteca nova de UI.
- Redesenhar todo o onboarding.

## Aceite

1. Clicar em "Abrir guia inicial" abre a modal corretamente.
2. "Ver tour rápido" inicia o tour contextual.
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
