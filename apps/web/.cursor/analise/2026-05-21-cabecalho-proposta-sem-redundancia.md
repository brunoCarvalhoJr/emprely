# Analise - Cabecalho da proposta sem redundancia

## Contexto

No fluxo de propostas, o titulo principal da pagina ja informa "Nova proposta" ou "Editar proposta". Dentro do painel do builder, a interface repetia o mesmo titulo logo abaixo do selo "Builder comercial", criando ruido visual e uma hierarquia confusa.

## Decisao

Manter o titulo da pagina como a unica fonte do nome da tela e transformar o cabecalho interno em uma barra de contexto do fluxo:

- substituir o titulo repetido por um identificador curto do fluxo;
- exibir etapa atual, status e cliente como metadados compactos;
- remover frase explicativa redundante no cabecalho interno;
- preservar a barra de etapas e os comportamentos do formulario.

## Fora de escopo

- Nao alterar regras de criacao, edicao, salvamento ou geracao.
- Nao alterar o conteudo das etapas.
- Nao mudar a navegacao da lista de propostas.
