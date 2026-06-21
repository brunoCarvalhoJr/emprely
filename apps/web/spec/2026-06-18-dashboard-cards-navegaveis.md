# Spec - cards navegaveis no dashboard

## Escopo

Alterar o dashboard web para que os cards de metricas funcionem como atalhos de navegacao.

## Comportamento

- O dashboard deve exibir os cards:
  - Clientes cadastrados
  - Servicos salvos
  - Em rascunho
  - Propostas aprovadas
  - Propostas enviadas
  - Propostas aceitas
  - Propostas recusadas
- Cada card deve ser clicavel.
- Cards de clientes e servicos devem abrir suas listagens.
- Cards de propostas devem abrir a listagem de propostas com o status correspondente:
  - Em rascunho: `Rascunho`
  - Propostas aprovadas: `Gerada`
  - Propostas enviadas: `Enviada`
  - Propostas aceitas: `Aceita`
  - Propostas recusadas: `Recusada`

## Fora de escopo

- Criar novas paginas.
- Alterar o modelo de status de proposta.
- Alterar a forma de busca, paginacao ou arquivamento das listagens.

## Validacao

- Executar validacao do app web.
- Conferir que os cards usam os filtros ja existentes e reiniciam a paginacao ao navegar.
