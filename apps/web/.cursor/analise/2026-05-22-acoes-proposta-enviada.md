# Analise Web - Acoes em proposta enviada

## Contexto

Depois que uma proposta e marcada como enviada, ela continua sendo um documento comercial final que o usuario precisa consultar, baixar, compartilhar e duplicar.

## Problema

Algumas acoes usam a regra `status === Gerada`, bloqueando download e WhatsApp quando a proposta passa para `Enviada`. Ao mesmo tempo, a acao `Editar` continua disponivel na listagem e na modal, o que permite alterar diretamente uma proposta que ja foi enviada.

## Objetivo

Liberar as acoes de documento final para propostas enviadas e impedir edicao direta de propostas que ja seguiram para o cliente.

## Escopo

- Permitir visualizar, baixar PDF/imagem, imprimir e compartilhar por WhatsApp propostas com documento final.
- Impedir edicao direta de proposta enviada, aceita ou recusada.
- Manter a duplicacao disponivel para criar uma nova versao editavel.
- Manter `Marcar enviada` apenas para propostas geradas.

## Riscos

- A regra de exportacao nao deve liberar rascunhos.
- A regra de edicao nao deve bloquear rascunhos nem propostas geradas antes do envio.

## Duvidas

- Nenhuma bloqueante.
