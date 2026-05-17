# Analise Web - Busca simples nas listas

## Contexto

O MVP ja possui cadastro e historico para clientes, servicos e propostas. Conforme o volume cresce, navegar apenas por lista torna o uso lento. O proximo ganho funcional, sem entrar em prints, imagens ou layout final, e permitir busca simples nos dados ja carregados.

## Objetivo da tela/fluxo

Adicionar busca local nas views de clientes, servicos e propostas, mantendo os filtros de status ja existentes para propostas.

## Rotas impactadas

- SPA React, views `clientes`, `servicos` e `propostas`.

## Componentes impactados

- `App`
- Listas de clientes, servicos e propostas
- Campo reutilizavel `CampoTexto`

## Formularios e validacao

- Campos:
  - `buscaClientes`
  - `buscaServicos`
  - `buscaPropostas`
- Regras:
  - Busca ignora maiusculas/minusculas.
  - Busca ignora acentos.
  - Busca por cliente considera nome, email, telefone, documento e observacoes.
  - Busca por servico considera nome, categoria, descricao, tipo e unidade.
  - Busca por proposta considera titulo, cliente, status, introducao, observacoes e itens.

## Dados e chamadas de API

- Queries existentes continuam iguais.
- Filtro e busca acontecem no client enquanto as listas forem pequenas no MVP.
- Estados de loading/erro/vazio existentes devem continuar funcionando.

## Responsividade e acessibilidade

- Usar input `type="search"` com label visivel.
- Manter botoes e listas existentes.

## Duvidas

Nao ha duvida bloqueante. Busca server-side com paginacao fica para quando houver volume real.
