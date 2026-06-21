# Analise - Detalhamento aberto no desktop

## Contexto

Na etapa 5 da nova proposta, os blocos "Desconto e pagamento" e "Escopo, cronograma e beneficios" ficam fechados por padrao. No desktop ha espaco suficiente para mostrar esses campos sem prejudicar a leitura, e deixar ambos fechados cria um clique extra desnecessario.

## Objetivo

Abrir os dois collapses da etapa de detalhamento comercial por padrao em telas desktop, mantendo o comportamento compacto no mobile.

## Regras

- Desktop usa breakpoint `1024px`, alinhado ao uso de classes `lg:` da tela.
- O usuario deve continuar conseguindo abrir e fechar cada bloco manualmente.
- Mobile deve continuar iniciando com os blocos fechados.
- Nao alterar campos, validacoes ou payload da proposta.

## Impactos

- Frontend: estado inicial dos dois elementos `details` da etapa 5.
- Backend: sem impacto.

## Riscos

- Controlar o atributo `open` sem estado impediria o usuario de fechar os blocos. Por isso a solucao usa estado inicial por viewport e atualiza no evento `toggle`.
