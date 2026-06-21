# Analise: compactacao dos cards de metricas do dashboard

## Contexto

Na vistoria visual, os cards de metricas do dashboard ocupavam duas linhas no
desktop. Para um SaaS operacional, essas metricas precisam funcionar como uma
faixa de leitura rapida, deixando espaco para primeiros passos e propostas
recentes.

## Decisao

Compactar os cards de metricas no desktop:

- usar uma linha com sete colunas em viewport desktop largo;
- reduzir altura minima, padding, tamanho do numero e tamanho dos icones;
- trocar labels longas por nomes curtos e legiveis;
- ordenar o funil como Clientes, Servicos, Rascunhos, Geradas, Enviadas,
  Aceitas e Recusadas;
- manter responsividade mobile com duas colunas.

## Criterios de aceite

- Em desktop, os sete cards devem ocupar uma unica linha.
- Os cards devem ficar visualmente mais baixos e menos dominantes.
- Numeros, labels e icones devem continuar legiveis sem corte de texto.
- O status "Geradas" deve substituir o rotulo confuso "Propostas aprovadas",
  porque propostas aceitas ja possuem card proprio.
- Em mobile, a grade deve continuar em duas colunas compactas.
- Nao alterar contratos de API, dados ou comportamento dos filtros.
