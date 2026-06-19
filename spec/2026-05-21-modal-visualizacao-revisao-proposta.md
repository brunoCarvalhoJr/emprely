# Spec - Modal de visualizacao na revisao da proposta

## Escopo

Atualizar a etapa `Revisao final` do cadastro de propostas.

## Requisitos

- A revisao deve mostrar apenas os dados resumidos da proposta.
- O preview renderizado no template nao deve aparecer fixo no lado direito.
- Deve existir um botao `Visualizar Proposta` antes de `Salvar rascunho`.
- Ao clicar em `Visualizar Proposta`, uma modal deve abrir com a proposta renderizada no template final.
- A modal deve usar o mesmo visual final utilizado para compartilhar, imprimir ou exportar a proposta.

## Validacao

- `pnpm.cmd --dir apps/web lint`
- `pnpm.cmd --dir apps/web build`
