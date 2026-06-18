# Analise Web - Fluxo continuo de primeiros passos

## Tela afetada

- Dashboard: componente `PrimeirosPassosDashboard`.
- Clientes: sucesso de `salvarClienteMutation`.
- Servicos / pacotes: sucesso de `salvarServicoMutation`.
- Propostas: assistente de nova proposta.

## Estado atual

- O dashboard calcula quatro passos a partir dos totais ja carregados.
- O botao principal aciona o proximo passo pendente.
- Cada card tambem permite abrir a propria etapa.
- Ao salvar cliente novo, o formulario e resetado e continua em `clienteModo="novo"`.
- Ao salvar servico novo, o formulario e resetado e continua em `servicoModo="novo"`.

## Estado desejado

- O dashboard deve parecer um fluxo guiado:
  - uma acao primaria para continuar;
  - passo atual em destaque;
  - passos concluidos compactos com revisao;
  - passos futuros visiveis como roteiro.
- Depois de salvar o primeiro cliente, a aplicacao deve ir para `servicos` em modo novo.
- Depois de salvar o primeiro servico, a aplicacao deve ir para `propostas` no assistente de nova proposta.
- O mesmo comportamento deve funcionar em mobile e desktop.

## Validacao

- Testar viewport mobile e desktop.
- Verificar que nao ha tela branca.
- Verificar que o fluxo cliente -> servico -> proposta acontece sem retorno manual ao dashboard.

