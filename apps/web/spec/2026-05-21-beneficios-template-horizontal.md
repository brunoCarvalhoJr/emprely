# Spec Web - Beneficios horizontais no template social

## Visao geral

Alterar a apresentacao da secao de beneficios do template social para uma lista horizontal, com icone ao lado do texto, reduzindo a aparencia de card vertical.

## Rotas

- Propostas.

## Estados da interface

- Carregando: nao se aplica.
- Vazio: lista de beneficios vazia continua ocultando a secao.
- Erro: nao se aplica.
- Sucesso: cada beneficio aparece como uma linha com icone a esquerda, titulo e descricao a direita.

## Componentes

- `DocumentoBeneficios`.
- CSS do template social em `styles.css`.

## Formularios

| Campo | Tipo | Obrigatorio | Validacao |
| --- | --- | --- | --- |
| Nao se aplica | - | - | - |

## Integracao com API

- Sem mudanca de contrato.

## Criterios de aceite

- A secao "Por que esta proposta faz sentido" nao aparece mais como card vertical estreito.
- O texto fica na frente do icone, em layout horizontal.
- A linha ocupa a largura disponivel do documento.
- O layout continua responsivo e legivel no preview, modal, PDF e imagem.

## Testes

- Lint: `pnpm --dir apps/web lint`.
- Build: `pnpm --dir apps/web build`.
