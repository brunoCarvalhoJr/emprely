# Spec Web - Scroll vertical no fluxo de proposta

## Visao geral

O fluxo de criar/editar proposta deve ocupar o viewport de forma mais eficiente e evitar scroll vertical quando a etapa cabe visualmente na tela.

## Regras

- O scroll global do app autenticado continua existindo quando o conteudo ultrapassar o viewport.
- No editor de proposta, paddings e gaps devem ser menores que nas telas de listagem.
- As etapas do wizard devem ter altura minima menor e limitada ao espaco util do viewport.
- Os botoes `Voltar` e `Proximo` devem continuar no rodape do painel quando houver espaco sobrando.
- Mobile e telas baixas continuam podendo rolar.

## Criterios de aceite

- Em desktop, uma etapa simples com um item cadastrado nao deve criar scroll vertical apenas por altura artificial.
- A etapa de itens nao deve exibir grande area vazia antes dos botoes quando ha pouco conteudo.
- `pnpm --dir apps/web lint` e `pnpm --dir apps/web build` devem passar.
