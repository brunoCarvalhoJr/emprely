# Analise Web - Duplicar proposta

## Contexto

O historico de propostas ja centraliza as acoes principais de gerar, imprimir/PDF, abrir WhatsApp, enviar, aceitar, recusar, editar e arquivar. Falta um atalho de produtividade para reaproveitar uma proposta salva.

## Objetivo da tela/fluxo

Adicionar acao `Duplicar` no historico de propostas, criando uma nova proposta em rascunho e abrindo a copia para edicao imediata.

## Rotas impactadas

- SPA React, view `propostas`.

## Componentes impactados

- `App`
- Lista/historico de propostas
- Client API em `src/lib/api.ts`

## Formularios e validacao

- Campos: sem novo campo.
- Regras: se houver alteracoes abertas, pedir confirmacao de descarte antes de duplicar.
- Mensagens: sucesso ao criar copia e erro da API quando falhar.

## Dados e chamadas de API

- Queries: `["propostas", accessToken]`.
- Mutations: `duplicateProposta`.
- Estados de loading/erro/vazio: botao desabilitado durante duplicacao; erro exibido junto dos erros de proposta.

## Responsividade e acessibilidade

- Usar botao com icone e texto, mantendo o mesmo padrao dos botoes existentes.

## Duvidas

Nao ha duvida bloqueante. A geracao de numero automatico da proposta fica fora desta etapa.
