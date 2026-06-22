# Spec - Templates reutilizaveis, PDF selecionavel e aprovacao publica

## Objetivo

Melhorar todos os templates ativos do Emprely para que sejam reutilizaveis em qualquer tipo de servico, com PDF selecionavel e botao publico de aprovacao persistindo o status da proposta.

## Criterios de aceite

- Todos os templates ativos exibem o CTA com label exata `Aprovar`.
- O CTA abre um link publico seguro e aprova a proposta no sistema.
- O aceite publico persiste status `Aceita` no banco.
- O link publico e idempotente quando a proposta ja esta aceita.
- Propostas recusadas ou arquivadas nao podem ser aprovadas pelo link publico.
- O PDF baixado permite selecionar texto e contem link clicavel no CTA.
- A exportacao de imagem continua disponivel para compartilhamento.
- Nenhum template ativo exibe frase fixa que restrinja o uso a social media, trafego, consultoria, identidade visual, WhatsApp ou outro nicho.
- Onde houver marca d'agua, ela usa a logo Emprely do app.
- Layouts corrigem cortes, textos espremidos, desalinhamentos e excesso de espaco nos blocos de valores.

## Regras por template

- `ComercialMinimalista`: remover kicker superior e manter cabecalho limpo.
- `OrcamentoSimplificado`: cards e beneficios nao devem quebrar palavras de forma estreita; coluna de totais deve ocupar menos espaco que a lista de itens.
- `PropostaCompleta`: remover "Proposta comercial completa" do topo.
- `LunaSocialStudio`, `DarkGrowth` e `InstagramPremium`: remover copy fixa de nicho e usar titulos genericos.
- `Claymorphism`: remover frases que fixem o template em um tipo de trabalho.
- `Emprely`: manter identidade da Emprely sem amarrar o servico.
- `ExecutivoEditorial`: remover "Consultoria e diagnostico" e selo fixo.
- `CorporativoBoard`: aumentar espacamento do topo e remover "Agencia growth board".
- `InstitucionalClean`: remover "Design e identidade visual".

## Contrato esperado

- API autenticada de propostas retorna `publicApprovalUrl`.
- API publica:
  - `POST /api/proposals/public/{token}/approve`
  - retorna status publico da aprovacao sem exigir login.
- Web publica:
  - rota `/aprovar-proposta/:token`
  - chama o endpoint publico e mostra sucesso, ja aceito, expirado/invalido ou bloqueado.

## Validacao

- `pnpm lint:web`
- `pnpm build:web`
- `dotnet build apps/api/Emprely.sln`
- `dotnet test apps/api/Emprely.sln`
- Gerar um PDF por template e validar extracao de texto.
- Validar manualmente o clique no CTA `Aprovar` e a mudanca de status no sistema.
