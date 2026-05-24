# Spec Web - Contato no rodape do template da proposta

## Visao geral

Refatorar o componente de contato exibido nos templates de proposta para melhorar a leitura de telefone, e-mail e Instagram.

## Comportamento

- Telefone aparece com icone de telefone.
- E-mail aparece com icone de e-mail.
- Instagram aparece com icone de `@` e valor normalizado.
- Site continua sendo exibido como fallback quando nao houver Instagram.
- Os itens quebram linha de forma responsiva.

## Componentes

- `DocumentoContatoInline`

## Criterios de aceite

- O contato nao aparece mais como texto solto.
- O rodape do bloco de observacoes finais fica organizado mesmo com telefone, e-mail e Instagram.
- O e-mail nao sobrepoe os demais dados.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.
