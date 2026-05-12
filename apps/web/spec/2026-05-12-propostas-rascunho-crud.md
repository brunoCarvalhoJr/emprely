# Spec Web - Propostas Rascunho CRUD

## Visao geral

Adicionar ao web autenticado uma area de propostas para montar rascunhos a partir de clientes e servicos/pacotes ja cadastrados.

## Escopo

Inclui:

- Tipos TypeScript de propostas.
- Funcoes API para listar, criar, atualizar e arquivar.
- Estado de tela `Propostas`.
- Formulario com cliente, titulo, textos e validade.
- Itens dinamicos com quantidade e valor unitario.
- Adicao rapida a partir do catalogo de servicos.
- Lista de propostas ativas com total.

Fora do escopo:

- PDF/imagem.
- Preview visual final.
- Envio por WhatsApp.
- Status alem de rascunho/arquivado.

## Criterios de aceite

- Usuario logado acessa Propostas pelo menu.
- Se nao houver cliente ou servico, tela mostra orientacao operacional curta.
- Usuario cria proposta com pelo menos um item.
- Usuario edita proposta.
- Usuario arquiva proposta.
- Proposta arquivada some da lista.
- `pnpm --dir apps/web lint` passa.
- `pnpm --dir apps/web build` passa.

## Testes

- Lint do web.
- Build do web.
- Smoke real via API para endpoints de proposta.
