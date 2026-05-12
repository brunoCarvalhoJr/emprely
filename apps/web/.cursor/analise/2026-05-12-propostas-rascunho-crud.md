# Analise Web - Propostas Rascunho CRUD

## Ideia / US

Como usuario autenticado, quero montar uma proposta com cliente e itens para iniciar o fluxo principal de orcamentos dentro do web.

## Contexto

- Web usa React com Vite, TanStack Query, React Hook Form e Zod.
- Ja existem telas autenticadas para Dashboard, Clientes, Servicos e Conta.
- A tela atual ainda direciona Propostas para o Dashboard.
- O MVP precisa transformar clientes + servicos em uma proposta persistida.

## Escopo proposto

- Adicionar view `propostas`.
- Buscar clientes, servicos e propostas da API.
- Criar/editar proposta com:
  - cliente;
  - titulo;
  - introducao;
  - observacoes;
  - validade em dias;
  - itens.
- Permitir adicionar item a partir do catalogo de servicos.
- Permitir editar nome, descricao, quantidade e valor unitario do item.
- Exibir total por proposta.
- Arquivar proposta.

## Fora do escopo

- Preview visual final da proposta.
- Exportacao PDF/imagem.
- Envio WhatsApp.
- Status de envio/aceite.
- Upload de logo ou editor de layout.

## Perguntas e decisoes

- O usuario pode criar proposta sem cliente?
  - Decisao: nao, precisa selecionar cliente ativo.
- Item livre e permitido?
  - Decisao: sim, atraves dos campos editaveis do item.
- Como adicionar item rapidamente?
  - Decisao: selecionar servico/pacote e clicar em adicionar; o form copia nome, descricao e preco.
- A tela deve depender de modal?
  - Decisao: nao, manter layout de ferramenta com form e lista lateral.

## Criterios de aceite

- Usuario logado abre area de propostas.
- Usuario seleciona cliente e adiciona itens.
- Total da proposta aparece antes de salvar.
- Usuario cria proposta e ela aparece na lista.
- Usuario edita proposta existente.
- Usuario arquiva proposta.
- Lint e build do web passam.
