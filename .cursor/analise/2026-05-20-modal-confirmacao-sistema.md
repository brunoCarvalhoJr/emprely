# Analise - Modal reutilizavel de confirmacao

## Contexto

O usuario quer remover os alertas padrao do navegador em acoes de exclusao/arquivamento. O print mostra o `window.confirm` nativo ao arquivar uma proposta pela listagem.

## Objetivo

Criar uma confirmacao visual propria do Emprely, reutilizavel e com escolha clara entre `Sim` e `Nao`, mantendo o fluxo atual de arquivamento logico do MVP.

## Projetos impactados

- API: nao impactada.
- Web: substituicao dos `window.confirm` por modal reutilizavel.
- Mobile: nao impactado.
- Landing: nao impactada.
- Packages: nao impactados.
- Infra: nao impactada.

## Fluxo atual

- Acoes como descartar alteracoes, alterar template, marcar status, duplicar e arquivar usam `window.confirm`.
- Clientes, servicos e propostas exibem a acao `Excluir`, mas a operacao continua sendo arquivamento logico.

## Fluxo proposto

- Toda confirmacao hoje feita pelo navegador passa a abrir uma modal do sistema.
- A modal mostra titulo, mensagem, opcionalmente detalhe, e botoes `Nao` e `Sim`.
- `Nao`, Escape ou clique no fundo cancelam a acao.
- `Sim` executa a acao original.

## Regras de negocio

- Excluir no MVP continua arquivando logicamente registros ativos.
- Nenhuma chamada de API nova sera criada.
- O componente deve ser reutilizavel para outras confirmacoes futuras.

## Impactos tecnicos

- O fluxo de confirmacao passa a ser assíncrono no web.
- Handlers que dependiam de retorno booleano imediato precisam aguardar a resposta da modal.

## Riscos

- Navegacoes com formularios sujos devem continuar aguardando confirmacao antes de trocar de tela.
- Se uma segunda confirmacao for aberta enquanto outra estiver pendente, a anterior deve ser cancelada para nao deixar promise presa.

## Duvidas

- Sem duvidas bloqueantes. A acao `Excluir` sera tratada como confirmacao destrutiva visualmente, mesmo mantendo arquivamento logico no backend.
