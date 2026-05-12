# Analise API - Propostas Rascunho CRUD

## Ideia / US

Como usuario autenticado da Emprely, quero criar uma proposta vinculando um cliente e itens de servico/pacote para montar um primeiro orcamento reutilizavel.

## Contexto

- O MVP precisa ter criacao guiada de proposta, preview visual, historico simples e exportacao depois.
- Ja existem autenticacao, conta, perfil de marca, clientes e servicos/pacotes.
- A API resolve `ContaId` pelo token, nunca pelo frontend.
- Rotas publicas continuam em ingles: `/api/proposals`.
- Codigo de dominio segue PortuguesIngles.

## Escopo proposto

- Criar entidade `Proposta` da conta autenticada.
- Criar entidade `PropostaItem` com snapshot do item no momento da proposta.
- Permitir item vinculado a `ServicoId` ou item livre.
- Expor CRUD inicial de propostas ativas/rascunhos.
- Arquivar proposta com `DELETE`.
- Calcular `Total` no retorno da API.

## Fora do escopo

- Preview visual final.
- Exportacao PDF/imagem.
- Aceite/assinatura.
- Envio por WhatsApp.
- Controle de versoes da proposta.
- Pagamento ou plano sem marca d'agua.

## Perguntas e decisoes

- Status inicial deve ser qual?
  - Decisao: `Rascunho`.
- Proposta pode nascer sem item?
  - Decisao: nao nesta etapa; precisa ter pelo menos um item para gerar orcamento util.
- Item precisa sempre vir do catalogo?
  - Decisao: nao; pode ser livre, mas se `ServicoId` for informado deve pertencer a mesma conta e estar ativo.
- O valor do item deve acompanhar alteracoes futuras no catalogo?
  - Decisao: nao; a proposta salva snapshot de nome, descricao, quantidade e valor unitario.
- Delete remove do banco?
  - Decisao: nao; arquiva para historico.

## Impacto tecnico

- `Emprely.Domain`: novas classes `Proposta`, `PropostaItem`, `StatusProposta`.
- `Emprely.Contracts`: requests/responses em `Proposals`.
- `Emprely.Infrastructure`: `DbSet`, mapeamento EF, FK para conta, cliente e servico opcional.
- `Emprely.Api`: `ProposalsController`.
- Migration PostgreSQL para `propostas` e `proposta_itens`.

## Criterios de aceite

- Usuario autenticado lista propostas da sua conta.
- Usuario autenticado cria proposta com cliente e itens.
- Usuario autenticado busca proposta por id.
- Usuario autenticado atualiza proposta e substitui os itens.
- Usuario autenticado arquiva proposta.
- Proposta arquivada nao aparece na listagem ativa.
- API bloqueia cliente/servico de outra conta.
- Build, testes e migration passam.
