# Analise - cards navegaveis no dashboard

## Contexto

O dashboard exibe cards de metricas operacionais, mas eles sao apenas informativos. O usuario quer usar esses cards como atalhos para as listagens correspondentes.

## Necessidade

- Transformar os cards de metricas em areas clicaveis.
- Abrir a listagem correta ao clicar em cada card.
- Para cards de propostas, abrir a tela de propostas ja filtrada pelo status correto.
- Adicionar cards de clientes cadastrados, propostas recusadas e propostas aceitas.
- Separar "propostas aprovadas" de "propostas aceitas": no dominio atual, aprovadas correspondem ao status `Gerada`, enquanto aceitas correspondem ao status `Aceita`.

## Decisoes

- Manter os filtros e listagens ja existentes.
- Ordenar os cards como um funil operacional: clientes, servicos, rascunhos, aprovadas, enviadas, aceitas e recusadas.
- Usar `button` para cada card, preservando foco por teclado e feedback visual.

## Criterios de aceite

- Clique em "Clientes cadastrados" abre a listagem de clientes.
- Clique em "Servicos salvos" abre a listagem de servicos.
- Clique em cards de propostas abre a listagem de propostas com filtro correspondente.
- Os cards continuam legiveis e responsivos no grid do dashboard.
