# Spec Web - Beneficios da proposta sem fallback

## Visao geral

Remover as descricoes automaticas dos beneficios exibidos no documento da proposta.

## Comportamento

- Quando um beneficio for preenchido como texto simples, exibir apenas esse texto como titulo do card.
- Quando um beneficio for preenchido no formato `Titulo: descricao`, exibir titulo e descricao.
- Nao adicionar frases padrao ou textos comerciais que nao foram informados pelo usuario.

## Componentes

- `DocumentoBeneficios`
- `parseBeneficioDocumento`

## Criterios de aceite

- A frase `Frequencia e padronizacao para manter o perfil ativo e memoravel.` nao aparece mais por fallback.
- Beneficios sem descricao nao renderizam um paragrafo vazio.
- Beneficios com `:` continuam exibindo a descricao digitada.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.
