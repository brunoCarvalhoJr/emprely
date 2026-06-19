# Spec - Ajustes do template na nova proposta

## Visao geral

Ajustar a etapa de escolha de template da nova proposta para remover uma modal redundante, melhorar o espacamento desktop e respeitar o template padrao da personalizacao.

## Escopo

- Preview aberto pelos cards da etapa 4 deve exibir apenas o preview.
- Fechar o preview deve retornar para a propria etapa 4, sem modal intermediaria.
- A grade de templates deve ter maior margem superior em telas desktop.
- O template padrao da conta deve ficar marcado em nova proposta quando carregado.

## Fora do escopo

- Criar novos templates.
- Alterar o visual interno dos documentos.
- Alterar regras de exportacao.
- Remover a modal de template usada por outros pontos do editor.

## Criterios de aceite

- Clicar em `Preview` em um card da etapa de template abre o preview sem deixar a modal de escolha por baixo.
- Fechar ou voltar do preview retorna para a etapa de cards.
- Em desktop, ha mais respiro entre o texto "O template define..." e os cards.
- Ao abrir nova proposta, o template padrao salvo nas configuracoes aparece selecionado quando os dados da conta estao disponiveis.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `npm.cmd run build --workspace apps/web`
