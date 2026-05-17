# Analise Web - Primeiros passos do MVP

## Contexto

O MVP ja possui cadastro, perfil, clientes, servicos, propostas, fluxo comercial, WhatsApp, impressao e bloqueio por trial. Para uma conta nova, ainda falta um caminho guiado que mostre o que deve ser feito primeiro sem depender de explicacao externa.

## Objetivo

Adicionar no dashboard um fluxo simples de primeiros passos para orientar o usuario novo ate a primeira proposta funcional.

## Escopo

- Mostrar checklist de configuracao inicial no dashboard.
- Indicar como concluidos os passos ja realizados.
- Levar o usuario para:
  - perfil da conta;
  - cadastro de cliente;
  - cadastro de servico;
  - criacao de proposta.

## Fora do escopo

- Redesign visual do dashboard.
- Prints, imagens ou polimento final de layout.
- Persistencia de onboarding no backend.
- Tour interativo.

## Regras

- O checklist deve ser derivado dos dados ja carregados no web.
- Perfil conta concluido quando houver `updatedAt`.
- Cliente concluido quando houver pelo menos um cliente ativo.
- Servico concluido quando houver pelo menos um servico ativo.
- Proposta concluida quando houver pelo menos uma proposta ativa.

## Duvidas

- Futuramente podemos salvar no backend quando o usuario dispensar o onboarding.
- Futuramente podemos incluir tarefas de billing real quando existir checkout.
