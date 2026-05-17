# Analise web - ajustes de cadastro, configuracoes e responsividade

## Contexto

O app web precisa refletir melhor os dados do cadastro de teste e eliminar redundancias de navegacao no ambiente autenticado.

## Decisoes de UI

- Adicionar telefone obrigatorio no cadastro publico.
- Manter e-mail visivel em configuracoes, mas somente leitura.
- Compactar a coluna direita de configuracoes com cards menores e campos de senha em grid.
- Remover "Configuracoes" da lista principal do menu e exibir a acao no dropdown do bloco da empresa.
- Simplificar o header autenticado para exibir apenas o botao "Sair" na direita.
- Prevenir overflow horizontal no shell, conteudo, tabelas e blocos de configuracao.

## QA esperado

- Cadastro sem scroll em desktop.
- Configuracoes sem scroll horizontal e com coluna direita mais curta.
- Mobile sem corte lateral e com menu navegavel.
- Dropup da conta fecha ao clicar fora, usa seta para cima no desktop e inclui alternancia de tema claro/escuro.
- Tema escuro com cards, formularios, preview, alertas e tabelas usando superficies escuras e texto legivel.
- Campos focados/editados/autofill com variacao sutil por tema, sem branco puro no escuro ou preto pesado no claro.
- Linha de adicionar servico na proposta com select e botoes alinhados.
