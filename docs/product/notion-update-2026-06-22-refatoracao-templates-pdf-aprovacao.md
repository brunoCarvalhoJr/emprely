# Atualizacao para Notion - Templates, PDF textual e aprovacao publica

Data: 2026-06-22

Pagina criada no Notion:

`https://app.notion.com/p/38799ea0f4bb81649ebbfedf945dc250`

## Resumo executivo

O Emprely Orcamentos agora usa uma arquitetura mais correta para propostas
comerciais: os templates ativos foram limpos para nao ficarem presos a nichos
especificos, o CTA foi padronizado como `Aprovar`, o PDF passou a ser textual e
selecionavel, e a aprovacao publica da proposta passou a existir por link
tokenizado.

## O que mudou

- PDF de proposta deixou de ser imagem unica dentro de um PDF.
- PDF textual agora usa texto real, permitindo selecao de conteudo.
- Link `Aprovar` no PDF e no preview aponta para rota publica de aprovacao.
- Endpoint publico aprova e persiste a proposta no banco.
- Token publico e assinado e armazenado por hash.
- Endpoint publico tem rate limit dedicado.
- Propostas `Gerada` e `Enviada` podem ser aprovadas publicamente.
- Propostas `Aceita` respondem de forma idempotente.
- Propostas `Recusada` e `Arquivada` continuam bloqueadas.
- Textos fixos como referencias a WhatsApp, social media, trafego, reels,
  consultoria, diagnostico e identidade visual foram removidos dos modelos.
- Marca d'agua usa a logo Emprely quando aparece.

## Arquivos principais

- `.cursor/analise/2026-06-22-refatoracao-templates-pdf-aprovacao.md`
- `apps/web/spec/2026-06-22-refatoracao-templates-pdf-aprovacao.md`
- `apps/api/src/Emprely.Domain/Propostas/Proposta.cs`
- `apps/api/src/Emprely.Api/Controllers/ProposalsController.cs`
- `apps/api/src/Emprely.Contracts/Proposals/PublicProposalApprovalResponse.cs`
- `apps/api/src/Emprely.Infrastructure/Persistence/Migrations/20260622042321_PropostaAprovacaoPublica.cs`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/e2e/mvp-fluxo.spec.ts`

## Validacoes

- `pnpm --dir apps/web lint`: passou.
- `pnpm --dir apps/web build`: passou.
- `dotnet build apps/api/Emprely.sln`: passou.
- `dotnet test apps/api/Emprely.sln`: passou com 50 unitarios e 28 integracao.
- `pnpm --dir apps/web test:e2e`: passou com 6 cenarios, incluindo download de
  PDF e validacao de texto/link no arquivo.

## Observacao operacional

Antes de depender de links publicos em producao, confirmar que a migracao
`PropostaAprovacaoPublica` foi aplicada no banco da API publicada.
