# Analise - hardening billing UI

## Contexto

A tela de Plano ja usa entitlements de billing, mas ainda apresenta acoes que a API rejeita ou que o backend deve bloquear por falta de suporte real.

## Riscos

- Botao "Reativar assinatura" aparece quando a API exige novo checkout.
- Metodo cartao pode aparecer como disponivel mesmo sem tokenizacao de cartao recorrente.

## Decisao

- Remover a acao de reativacao da tela enquanto a politica de backend exigir novo checkout.
- Respeitar `metodo.ativo` no catalogo e desabilitar metodo inativo.
