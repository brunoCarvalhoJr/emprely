# Analise - Melhorias pos rodada QA FULL

## Contexto

A rodada QA FULL executada em 2026-06-20 validou os fluxos centrais do SaaS:
clientes, servicos/pacotes, propostas, templates, status, filtros, duplicacao,
exclusao, suporte, admin e suites automatizadas. A execucao tambem mostrou que
a cobertura completa depende de dados descartaveis, identificadores estaveis na
UI e um modo seguro para acoes destrutivas.

## Objetivo

Transformar os aprendizados da execucao manual assistida em roteiros
reutilizaveis e em uma backlog tecnica objetiva para evoluir a arquitetura de
testes do Emprely.

## Escopo

- Criar rotina de regressao QA FULL com criacao, status e limpeza.
- Criar roteiro para modo QA/destrutivo seguro.
- Criar matriz de templates, status e campos de proposta.
- Criar roteiro de melhorias de testabilidade da UI.
- Criar roteiro mobile real/emulado.
- Criar roteiro de APIs auxiliares de QA e cleanup.
- Atualizar o indice de rotinas de teste.

## Fora do escopo

- Implementar endpoints de QA.
- Alterar codigo de produto.
- Executar nova rodada destrutiva.
- Configurar device farm ou pipeline CI.

## Riscos

- Roteiros destrutivos serem executados em dados reais sem isolamento.
- A suite completa ficar lenta demais para PR.
- Testes dependerem de texto visual instavel em vez de seletores dedicados.
- Mobile continuar sem cobertura real.

## Decisoes

- A regressao QA FULL deve ser pre-release ou nightly, nao gate obrigatorio de
  todo PR.
- Exclusoes devem operar somente sobre dados com prefixo controlado ou tenant
  descartavel.
- Acoes externas reais, como WhatsApp e email em lote, precisam de sandbox ou
  confirmacao explicita.
