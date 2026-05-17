# Analise Web - Titulo automatico da proposta

## Contexto

O fluxo de proposta ja permite criar cliente rapido, adicionar servicos e salvar rascunhos. Ainda existe atrito no campo `Titulo`, porque o usuario precisa preencher manualmente mesmo quando o cliente e o primeiro servico ja indicam um titulo obvio.

## Objetivo da tela/fluxo

Sugerir um titulo automaticamente na proposta quando o usuario seleciona um cliente, cria um cliente rapido ou adiciona o primeiro servico do catalogo.

## Rotas impactadas

- SPA React, view `propostas`.

## Componentes impactados

- `App`
- Formulario de proposta
- Fluxo de cliente rapido
- Fluxo de adicionar servico na proposta

## Formularios e validacao

- Campo afetado:
  - `titulo`
- Regras:
  - Preencher automaticamente apenas quando o titulo atual estiver vazio ou ainda for um titulo automatico anterior.
  - Nao sobrescrever titulo digitado manualmente.
  - Usar cliente e primeiro servico quando ambos existirem.

## Dados e chamadas de API

- Sem nova chamada de API.
- Usa dados ja carregados de clientes e servicos.

## Responsividade e acessibilidade

- Sem novo componente visual obrigatorio.

## Duvidas

Nao ha duvida bloqueante. Templates de titulo personalizados por conta ficam para etapa futura.
