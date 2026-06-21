# Analise - Acoes mobile na nova proposta

## Contexto

No celular, o formulario de nova proposta deixou de apresentar de forma confiavel os botoes de navegacao e salvamento. O usuario precisa ver sempre:

- Anterior;
- Proximo;
- Salvar;
- Salvar rascunho na revisao.

## Diagnostico

A doca mobile existia, mas mostrava apenas a navegacao de etapa e so exibia acao de salvar em condicoes especificas da revisao. Em telas pequenas, isso dava a impressao de que os botoes principais sumiram. Tambem havia pouco espaco inferior para a doca fixa.

## Decisao

Expandir `PropostaWizardMobileDock` para funcionar como barra completa de acoes:

- etapas normais: `Anterior` quando aplicavel, `Salvar`, `Proximo`;
- revisao: `Anterior`, `Salvar rascunho`, `Gerar`;
- layout mobile em grade responsiva para 2 ou 3 botoes;
- respiro inferior maior no formulario para evitar sobreposicao.

