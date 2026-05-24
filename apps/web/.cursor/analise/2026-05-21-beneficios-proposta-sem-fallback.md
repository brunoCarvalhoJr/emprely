# Analise Web - Beneficios da proposta sem fallback

## Contexto

No template da proposta, os beneficios cadastrados pelo usuario sao exibidos em cards. Quando o texto do beneficio nao possui uma descricao separada por `:`, o componente adiciona uma descricao generica automaticamente.

Exemplo atual:

- Entrada: `retencao de clientes e divulgacao da marca`
- Saida: titulo com a entrada e descricao automatica `Frequencia e padronizacao para manter o perfil ativo e memoravel.`

## Problema

Esse comportamento faz a proposta final mostrar uma frase que o usuario nao informou. Para um orcamento comercial, isso reduz controle editorial e pode gerar promessas ou mensagens que nao fazem parte da negociacao.

## Objetivo

Exibir somente o conteudo informado pelo usuario. A descricao do card so deve aparecer quando o usuario escrever no formato `Titulo: descricao`.

## Area impactada

- `apps/web/src/App.tsx`
- Renderizacao do template/preview final da proposta.

## Duvidas

- Manter suporte ao formato `Titulo: descricao`?
  - Decisao: sim, porque permite enriquecer o card quando o usuario quiser.
- Criar texto automatico para beneficio sem descricao?
  - Decisao: nao. O sistema deve respeitar exatamente o que foi preenchido.
