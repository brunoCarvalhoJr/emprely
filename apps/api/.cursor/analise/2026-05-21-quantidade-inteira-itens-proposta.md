# Analise API - Quantidade inteira nos itens da proposta

## Contexto

Itens da proposta usam `decimal` para `Quantidade`, permitindo atualmente valores fracionados pela API. A interface passara a bloquear decimais, mas a regra precisa existir no backend para preservar consistencia.

## Objetivo

Rejeitar quantidade decimal em itens de proposta criados ou atualizados pela API.

## Escopo

- Validar `PropostaItemRequest.Quantidade` como numero inteiro positivo.
- Validar a mesma regra no dominio `PropostaItem`.
- Cobrir com teste de integracao e teste unitario de dominio.

## Persistencia

- Sem migracao nesta etapa. O tipo decimal no banco pode permanecer para compatibilidade, mas novos dados passam a ser inteiros.

## Riscos

- Propostas antigas com quantidade decimal, se existirem, continuam armazenadas; a regra afeta criacao/edicao novas.

## Duvidas

- Nenhuma bloqueante.
