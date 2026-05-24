# Spec Web - Modal reutilizavel de confirmacao

## Visao geral

Criar uma modal de confirmacao reutilizavel, visualmente integrada ao Emprely, para substituir `window.confirm`.

## Rotas

- App autenticado em `apps/web`.

## Estados da interface

- Carregando: nao se aplica.
- Vazio: nao se aplica.
- Erro: erros continuam nas mutations atuais.
- Sucesso: mensagens atuais de sucesso continuam sendo usadas depois da mutation.
- Confirmacao: modal com titulo, mensagem, detalhe opcional, botoes `Nao` e `Sim`.

## Componentes

- `ModalConfirmacaoSistema`
- Helper `abrirConfirmacaoSistema`

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## Integracao com API

- Nenhuma nova integracao.
- Mutations existentes so executam depois de `Sim`.

## Criterios de aceite

- `window.confirm` nao aparece mais no codigo do web.
- Excluir/arquivar cliente, servico e proposta abre a modal propria.
- `Nao`, Escape e clique no fundo cancelam.
- `Sim` preserva o comportamento anterior.
- Modal fica legivel em desktop e mobile.

## Testes

- Lint: `pnpm --dir apps/web lint`
- Build: `pnpm --dir apps/web build`
- Cenarios manuais: abrir menu de acoes, clicar `Excluir`, cancelar e confirmar.
