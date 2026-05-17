# Spec Web - E2E leve do fluxo MVP

## Visao geral

Adicionar uma bateria E2E leve para validar o fluxo principal do web com API mockada.

## Cenario principal

1. Abrir o app.
2. Criar conta.
3. Ver dashboard autenticado.
4. Cadastrar cliente.
5. Cadastrar servico.
6. Criar proposta.
7. Gerar proposta.
8. Validar que a proposta gerada libera acoes comerciais basicas.

## Regras

- O teste nao deve depender de backend real.
- O teste nao deve abrir WhatsApp real.
- O teste nao deve acionar print/PDF.
- O servidor Vite deve ser encerrado pelo runner ao final.

## Criterios de aceite

- Existe script `test:e2e`.
- Existe configuracao Playwright do app web.
- O teste intercepta as chamadas da API e atualiza estado mockado.
- `pnpm --dir apps/web test:e2e` executa o fluxo principal.

## Testes

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
- `pnpm --dir apps/web test:e2e`
