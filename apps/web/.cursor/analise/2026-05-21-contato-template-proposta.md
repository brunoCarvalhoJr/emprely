# Analise Web - Contato no rodape do template da proposta

## Contexto

O template de proposta exibe telefone, e-mail e Instagram no rodape do bloco de observacoes finais. Hoje os dados aparecem como textos soltos, sem icones e sem uma estrutura visual clara.

## Problema

No layout atual, os contatos parecem desconectados do botao de aprovacao e podem ficar comprimidos quando telefone, e-mail e Instagram aparecem juntos. Isso reduz a leitura e prejudica a percepcao profissional do documento.

## Objetivo

Melhorar a exibicao dos contatos no template:

- exibir cada contato como um item visual compacto;
- usar icones para telefone, e-mail e Instagram;
- manter o `@` do Instagram quando existir;
- permitir quebra responsiva sem sobreposicao ou corte ruim;
- preservar o mesmo componente nos demais rodapes de proposta.

## Area impactada

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`

## Decisoes

- O contato deve continuar vindo dos dados da marca/perfil.
- Nao adicionar frases explicativas.
- Priorizar leitura rapida e acabamento visual.
