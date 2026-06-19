# Spec - Modal reutilizavel de confirmacao

## Visao geral

Substituir confirmacoes nativas do navegador por uma modal reutilizavel do sistema Emprely, com visual consistente e decisao entre `Sim` e `Nao`.

## Escopo

Inclui:

- Criar componente reutilizavel de confirmacao no web.
- Substituir todos os usos atuais de `window.confirm`.
- Cobrir confirmacoes de descarte de alteracoes, status de proposta, template, duplicacao e exclusao/arquivamento.
- Estilizar modal para desktop e mobile, com tema claro/escuro.

Fora do escopo:

- Alterar backend.
- Trocar arquivamento logico por exclusao fisica.
- Criar biblioteca de design system separada.

## Fluxo ponta a ponta

1. Usuario clica em uma acao que precisa de confirmacao.
2. Sistema abre modal propria com titulo, mensagem e botoes `Nao` e `Sim`.
3. Ao clicar `Nao`, apertar Escape ou clicar no fundo, a acao e cancelada.
4. Ao clicar `Sim`, a acao original e executada.

## Requisitos

- Nao pode haver `window.confirm` ou alerta padrao do navegador nos fluxos atuais.
- Modal deve usar `role="alertdialog"`, `aria-modal`, titulo e descricao.
- Modal deve fechar por Escape e clique no fundo.
- Botoes devem ter tamanho estavel e nao quebrar layout em mobile.
- Confirmacoes destrutivas devem ter destaque visual de risco.

## Regras de negocio

- `Excluir` continua mapeado para arquivamento logico de cliente, servico e proposta.
- A resposta negativa nunca deve disparar mutation.

## Impactos por projeto

- API: sem alteracao.
- Web: `apps/web/src/App.tsx` e `apps/web/src/styles.css`.
- Mobile: sem alteracao.
- Landing: sem alteracao.
- Packages: sem alteracao.
- Infra: sem alteracao.

## Criterios de aceite

- Clicar em `Excluir` nas listagens abre modal do Emprely, nao alerta do navegador.
- Clicar `Nao` cancela sem mutation.
- Clicar `Sim` executa a mesma mutation anterior.
- Confirmacoes nao destrutivas tambem deixam de usar alerta nativo.
- Lint e build do web passam.

## Estrategia de implementacao

- Criar estado central de confirmacao no `App`.
- Expor helper assíncrono para abrir a modal e retornar `boolean`.
- Adaptar handlers existentes para aguardar o resultado.
- Criar componente `ModalConfirmacaoSistema`.

## Testes

- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web build`
