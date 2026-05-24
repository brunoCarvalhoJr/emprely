# Analise Web - Modal de envio por WhatsApp

## Contexto

A modal de compartilhamento de proposta sempre envia o usuario para o WhatsApp, com duas opcoes de mensagem: proposta completa em texto ou mensagem curta para anexar PDF/imagem depois.

## Problema

O destino WhatsApp aparece apenas como texto roxo, sem reforco visual claro no topo. Alem disso, o card `Mensagem curta + anexo` usa o icone do WhatsApp, o que repete o destino e nao comunica tao bem a ideia de anexo.

## Objetivo

Reforcar o WhatsApp como destino da modal no cabecalho e deixar o card de mensagem curta mais intuitivo para o usuario.

## Escopo

- Adicionar icone do WhatsApp no topo esquerdo da modal.
- Alterar a escrita `WhatsApp` para verde.
- Trocar o icone do card `Mensagem curta + anexo` por um icone relacionado a envio/anexo.
- Preservar a estrutura dos dois cards e os botoes de anexos.

## Riscos

- O cabecalho nao pode ficar pesado ou competir com o titulo da modal.
- O novo icone do card deve continuar legivel em tema claro e escuro.

## Duvidas

- Nenhuma bloqueante.
