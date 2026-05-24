# Analise - Listas no detalhamento da proposta

## Contexto

Na etapa de detalhamento comercial, os campos "O que esta incluso" e "O que nao esta incluso" eram textareas livres. O usuario quer transformar esses campos em listas reais, com inclusao item por item e reordenacao por drag and drop.

## Decisao

Criar um componente controlado para lista editavel:

- manter a representacao interna como texto separado por linhas para preservar compatibilidade com o schema atual e com a API;
- exibir os itens em uma lista compacta, responsiva e alinhada ao visual do sistema;
- permitir adicionar, editar, remover e reordenar itens com drag and drop;
- trocar apenas os dois campos solicitados, sem alterar cronograma, beneficios, payload ou banco.

## Fora de escopo

- Nao instalar biblioteca externa de drag and drop.
- Nao mudar contratos da API.
- Nao alterar a exibicao final da proposta alem da ordem enviada pelo formulario.
