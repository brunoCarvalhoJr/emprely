# Análise - Corrigir input de preço em serviços

## Contexto

No formulário de serviços, o campo `Preço` usa o componente `CampoMoedaReal`.
Ele recebe um valor numérico controlado pelo React Hook Form e renderiza sempre
`formatMoedaRealInput(value)`. Na prática, ao digitar, o campo é imediatamente
formatado de volta para `R$ 0,00` ou para o valor anterior, prejudicando a
posição do cursor e fazendo parecer que nada foi digitado.

## Decisão

Manter o valor de domínio como número, mas separar a experiência de edição do
valor formatado:

- enquanto o input estiver em foco, preservar o texto digitado pelo usuário;
- converter o texto para número a cada alteração e enviar via `onValueChange`;
- ao perder o foco, voltar a exibir o valor em formato monetário pt-BR;
- usar `inputMode="decimal"` para aceitar vírgula/ponto em teclados móveis.

## Ajuste complementar

No campo de valor dos itens da proposta, a edição ainda ficava desconfortável
quando já existia um preço preenchido, porque o usuário precisava lidar com o
texto monetário completo (`R$ 1.500,00`) e a posição do cursor. O modo de foco
passa a exibir um número editável simples, como `1500,00`, e seleciona o texto
atual para permitir substituição direta.

## Critérios de aceite

- O usuário consegue digitar `1500` no preço e ver `1500` durante a edição.
- Ao sair do campo, o valor aparece como `R$ 1.500,00`.
- O usuário consegue digitar `1500,50` e salvar como `1500.50`.
- O comportamento continua funcionando nos preços de itens da proposta e no
  desconto, que usam o mesmo componente.
- Ao editar um item da proposta já preenchido, o campo exibe `1500,00` em foco,
  sem prefixo `R$`, e permite substituir o valor sem reposicionar o cursor no
  primeiro dígito.
