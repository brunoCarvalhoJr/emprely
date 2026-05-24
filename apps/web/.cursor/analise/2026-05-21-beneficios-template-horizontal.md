# Analise Web - Beneficios horizontais no template social

## Contexto

No template social da proposta, a secao "Por que esta proposta faz sentido" aparece como card vertical. Com poucos itens, o bloco fica estreito e com leitura pesada, parecendo um card solto em vez de uma linha de argumento comercial.

## Objetivo da tela/fluxo

Transformar os beneficios do template social em linhas horizontais, com icone a esquerda e texto ao lado, deixando a leitura mais direta e alinhada ao restante do documento.

## Rotas impactadas

- Propostas.
- Modal de visualizacao/preview da proposta.
- Exportacao PDF/imagem, pois usa o mesmo template renderizado.

## Componentes impactados

- `DocumentoBeneficios` em `App.tsx`, apenas pela estilização existente.
- Regras `.doc-social-page .doc-benefit-*` em `styles.css`.

## Formularios e validacao

- Sem alteracao de formulario.
- Sem alteracao dos dados de beneficios.

## Dados e chamadas de API

- Sem alteracao de API.

## Responsividade e acessibilidade

- O layout deve ocupar a largura disponivel no template social.
- O icone deve permanecer visivel e o texto deve quebrar sem estourar o container.

## Duvidas

- Nenhuma pendente.
