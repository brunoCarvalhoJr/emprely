# Spec - Hero e CTAs do dashboard

## Arquivo

`src/App.tsx`

## Comportamento esperado

- O hero deve mostrar "Crie orcamentos profissionais em minutos" uma unica vez.
- O grupo de acoes deve conter:
  - `Cadastrar proposta`, acionando `onNovaProposta`;
  - `Cadastrar servico`, acionando `onSalvarServico`;
  - `Cadastrar cliente`, acionando `onCadastrarCliente`.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
