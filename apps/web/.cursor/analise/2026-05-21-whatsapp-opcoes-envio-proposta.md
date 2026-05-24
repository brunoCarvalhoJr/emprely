# Analise Web - Opcoes de envio da proposta pelo WhatsApp

## Contexto

O fluxo atual abre o WhatsApp com uma mensagem unica de acompanhamento. Na visualizacao da proposta gerada, o botao de WhatsApp pula a decisao de formato e ainda inclui o valor na mensagem, mesmo quando o objetivo e enviar o valor apenas dentro do PDF/imagem.

## Objetivo da tela/fluxo

Ao clicar em WhatsApp para uma proposta gerada, abrir uma modal com duas escolhas claras: enviar a proposta completa em texto ou enviar uma mensagem curta para anexar o PDF/imagem em seguida.

## Rotas impactadas

- App web autenticado, tela de Propostas e modal de visualizacao da proposta.

## Componentes impactados

- `App.tsx`: modal de compartilhamento, botoes de WhatsApp, montagem da mensagem e exportacao de PDF/imagem.
- `styles.css`: grid e cards da modal de escolha.

## Formularios e validacao

- Nao ha formulario novo.
- A proposta precisa estar com status `Gerada` e a conta precisa poder exportar.

## Dados e chamadas de API

- Sem novas chamadas de API.
- Usa dados ja carregados de proposta, cliente, perfil da conta e itens.

## Responsividade e acessibilidade

- Dois cards lado a lado em desktop.
- Empilhamento em telas menores.
- Cards como botoes com foco visivel e texto de acao objetivo.

## Duvidas

- O WhatsApp Web nao permite anexar arquivo via URL; PDF/imagem seguem como download/compartilhamento manual.
