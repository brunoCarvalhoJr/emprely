# Analise Web - Bloco nao incluso neutro no template

## Contexto

O bloco "O que nao esta incluso" aparece com vermelho e icones de X no documento da proposta. Isso cria percepcao visual de erro, alerta ou problema, quando a secao deve apenas delimitar escopo comercial.

## Objetivo da tela/fluxo

Trocar a semantica visual do bloco de itens nao inclusos para uma leitura neutra, discreta e profissional dentro dos templates de proposta.

## Rotas impactadas

- Propostas.
- Modal de visualizacao/preview da proposta.
- Exportacao PDF/imagem, pois usa o mesmo template renderizado.

## Componentes impactados

- `DocumentoLista` em `App.tsx`.
- Regras `.doc-list-card` e variações de template em `styles.css`.

## Formularios e validacao

- Sem alteracao de formulario.
- Sem alteracao nos dados de itens nao inclusos.

## Dados e chamadas de API

- Sem alteracao de API.

## Responsividade e acessibilidade

- A mudanca nao altera layout.
- O contraste deve continuar legivel, mas sem cor de alerta.

## Duvidas

- Nenhuma pendente.
