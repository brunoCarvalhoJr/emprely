# Analise Web - Numero sequencial da proposta

## Contexto

A API passara a retornar `numero` em cada proposta. A interface deve usar esse numero para melhorar identificacao no historico, preview visual e mensagem de WhatsApp.

## Objetivo da tela/fluxo

Mostrar o numero formatado da proposta (`#0001`) onde o usuario consulta ou compartilha a proposta.

## Rotas impactadas

- SPA React, view `propostas`.

## Componentes impactados

- `App`
- Historico de propostas
- Preview da proposta
- Mensagem de WhatsApp
- Tipos em `src/types/proposal.ts`

## Formularios e validacao

- Nenhum campo novo.
- Numero e somente leitura.

## Dados e chamadas de API

- `PropostaResponse` passa a conter `numero`.
- Busca de propostas deve considerar o numero.

## Responsividade e acessibilidade

- Mostrar numero como texto curto junto do titulo/status, sem criar nova estrutura visual complexa.

## Duvidas

Nao ha duvida bloqueante. Prefixo personalizado e layout final ficam para depois.
