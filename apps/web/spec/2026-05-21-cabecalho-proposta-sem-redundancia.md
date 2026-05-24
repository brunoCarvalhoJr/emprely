# Spec - Cabecalho da proposta sem redundancia

## Arquivos

`src/App.tsx`
`src/styles.css`

## Comportamento esperado

- O fluxo de proposta nao deve repetir "Nova proposta" no titulo principal e no painel interno.
- O cabecalho interno deve funcionar como contexto operacional do builder.
- Devem aparecer metadados uteis como etapa atual, status e cliente.
- O layout deve continuar responsivo e coerente com o design system.
- A barra de etapas e os botoes atuais devem manter o mesmo comportamento.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
