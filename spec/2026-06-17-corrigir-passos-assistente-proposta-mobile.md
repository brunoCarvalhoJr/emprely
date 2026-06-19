# Spec - Corrigir passos do assistente de proposta no mobile

## Visao geral

Corrigir o layout dos passos no assistente inicial de criacao de proposta em telas mobile.

## Escopo

Inclui:

- Criar estilo dedicado para os passos do assistente.
- Ajustar responsividade para quatro passos em largura igual.
- Evitar labels cortados ou quebrados.

Fora do escopo:

- Alterar regras do fluxo de proposta.
- Alterar API.
- Alterar o stepper compacto do editor ja implementado.

## Criterios de aceite

- Em 390px, os quatro passos aparecem alinhados.
- Nenhum label fica parcialmente cortado.
- Nao ha scroll horizontal.
- Build e lint passam.

## Testes

- `pnpm.cmd --dir apps/web lint`
- `.tmp/proposal-assistant-steps-check.mjs`
- `scripts/build-web-beta.ps1`

