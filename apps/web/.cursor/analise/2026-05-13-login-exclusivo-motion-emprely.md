# Analise Web - Login Exclusivo Motion Emprely

## Estado Atual

`AuthContent` usa uma composicao inspirada no print anterior, com painel azul e formulario branco. O usuario pediu abandonar esse caminho e criar algo exclusivo com base na logomarca Emprely.

## Arquivos Afetados

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/e2e/mvp-fluxo.spec.ts` apenas se a estrutura de campos mudar.

## Plano Tecnico

- Reestruturar `AuthContent` com classes novas:
  - `auth-emprely-stage`
  - `auth-orbit-panel`
  - `auth-flow-mark`
  - `auth-proposal-glass`
  - `auth-access-panel`
- Criar as tres fitas da marca em CSS usando elementos `span`.
- Manter `CampoTexto`, `SubmitButton` e mutations.
- Adicionar animacoes CSS com `transform` e `opacity`.
- Reduzir motion em `prefers-reduced-motion`.

## Validacoes De UI

- Desktop: duas colunas visiveis e alinhadas.
- Mobile: conteudo empilhado sem sobreposicao.
- Campos vazios no primeiro acesso.
- Footer continua no fluxo normal.
