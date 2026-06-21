# Analise - Preview mobile com zoom de proposta e template

## Contexto

No mobile, os previews de proposta e template abrem dentro de modal, mas o documento fica maior que a tela e o usuario ve apenas um recorte lateral. Isso prejudica a escolha do template e a revisao da proposta em construcao.

## Problema

- O palco do preview usa largura real do documento e scroll horizontal.
- No mobile, o documento nao aparece por inteiro.
- A barra superior do modal ocupa muito espaco e os botoes competem com o titulo.
- Nao ha controle explicito para alternar entre ver documento inteiro e ampliar detalhes.

## Decisao

- No mobile, o preview deve abrir por padrao em modo `Inteiro`.
- Adicionar controles: `Inteiro`, `Zoom`, `100%` e `Fechar`.
- Aplicar o mesmo padrao ao preview da proposta em construcao e ao preview do template.
- No desktop, preservar o comportamento amplo atual.

