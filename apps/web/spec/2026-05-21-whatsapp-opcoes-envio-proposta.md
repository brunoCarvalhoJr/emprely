# Spec Web - Opcoes de envio da proposta pelo WhatsApp

## Visao geral

Substituir o envio direto para WhatsApp por uma modal de escolha com dois cards: mensagem completa em texto e mensagem curta para envio de PDF/imagem em sequencia.

## Rotas

- Propostas.
- Modal de visualizacao de proposta gerada.

## Estados da interface

- Carregando: nao se aplica.
- Vazio: se nao houver proposta gerada, a modal nao abre.
- Erro: segue bloqueio existente de plano/status.
- Sucesso: WhatsApp abre com o texto escolhido e a interface permite baixar PDF/imagem para anexar.

## Componentes

- Modal de compartilhamento da proposta.
- Cards de escolha de mensagem.
- Acoes compactas para baixar PDF e imagem.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Nao se aplica | - | - | - |

## Integracao com API

- Sem mudanca de contrato.

## Criterios de aceite

- O botao de WhatsApp da visualizacao da proposta abre a modal de escolha.
- O card de texto completo abre o WhatsApp com cliente, proposta, itens, valores, condicoes, listas e observacoes organizadas.
- O card de mensagem curta abre o WhatsApp sem revelar o valor da proposta no texto.
- PDF e imagem continuam disponiveis para anexar manualmente.
- Layout fica em dois cards lado a lado no desktop e responsivo no mobile.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
- Cenarios manuais: proposta gerada pela tela de Propostas, modal de visualizacao, cards de WhatsApp e botoes de anexo.
