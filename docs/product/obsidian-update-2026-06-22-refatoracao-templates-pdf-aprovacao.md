# Obsidian - Refatoracao de templates, PDF textual e aprovacao publica

Data: 2026-06-22

## Resumo

Foi implementada a nova arquitetura de templates de proposta do Emprely
Orcamentos. O PDF agora e textual e selecionavel, os CTAs dos templates foram
padronizados como `Aprovar`, os textos fixos de nicho foram removidos e a
aprovacao publica passou a usar link tokenizado persistido no banco.

## Decisoes

- PDF de proposta nao deve mais ser exportado como screenshot/PNG dentro do PDF.
- `Download imagem` continua usando renderizacao visual do template.
- `Download PDF` passa a gerar texto real via `jsPDF`, com link clicavel.
- Todos os modelos ativos devem evitar frases que amarrem o template a um nicho.
- O CTA visivel nos templates deve ser sempre `Aprovar`.
- O link publico de aprovacao deve aprovar a proposta no sistema sem login.
- O token publico deve ser assinado, persistido apenas por hash e protegido por rate limit.
- Propostas `Gerada` e `Enviada` podem ser aceitas publicamente.
- Proposta ja `Aceita` deve responder de forma idempotente.
- Propostas `Recusada` e `Arquivada` nao podem ser aprovadas pelo link publico.
- Marca d'agua, quando presente, deve usar a logo Emprely.

## Arquitetura aplicada

- API:
  - novos campos publicos seguros em `Proposta`;
  - migracao EF `PropostaAprovacaoPublica`;
  - contrato `PublicProposalApprovalResponse`;
  - endpoint `POST /api/proposals/public/{token}/approve`;
  - rate limit dedicado para aprovacao publica.
- Web:
  - rota publica `/aprovar-proposta/:token`;
  - templates com CTA `Aprovar` como link;
  - PDF textual compartilhando os mesmos dados do preview;
  - imagem mantida como exportacao separada;
  - copy dos templates removendo referencias fixas a nichos.
- Testes:
  - unitarios de dominio para aprovacao publica;
  - E2E baixando PDF e validando texto/link no arquivo.

## Referencias locais

- `.cursor/analise/2026-06-22-refatoracao-templates-pdf-aprovacao.md`
- `apps/web/spec/2026-06-22-refatoracao-templates-pdf-aprovacao.md`
- `apps/api/src/Emprely.Domain/Propostas/Proposta.cs`
- `apps/api/src/Emprely.Api/Controllers/ProposalsController.cs`
- `apps/web/src/App.tsx`
- `apps/web/e2e/mvp-fluxo.spec.ts`

## Notion

Pagina criada:

`https://app.notion.com/p/38799ea0f4bb81649ebbfedf945dc250`

## Validacao

- `pnpm --dir apps/web lint`: passou.
- `pnpm --dir apps/web build`: passou.
- `dotnet build apps/api/Emprely.sln`: passou.
- `dotnet test apps/api/Emprely.sln`: passou com 50 unitarios e 28 integracao.
- `pnpm --dir apps/web test:e2e`: passou com 6 cenarios.

## Proximo cuidado

Durante o deploy da API, garantir que a migracao `PropostaAprovacaoPublica` seja
aplicada no banco de producao antes de usar os links publicos de aprovacao em
propostas reais.
