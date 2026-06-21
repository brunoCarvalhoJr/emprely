# Spec - Curadoria de templates de orcamento para servicos digitais

## Objetivo

Melhorar a galeria e a aparencia dos templates de orcamento para vender melhor servicos digitais, removendo opcoes redundantes da selecao e adicionando layouts com linguagem visual especifica do ramo.

## Escopo

- Atualizar a lista de templates selecionaveis.
- Renomear templates ativos para usos reais do publico-alvo.
- Melhorar titulos, subtitulos e CTAs dos documentos.
- Adicionar blocos visuais SVG/CSS aos templates ativos.
- Reaproveitar IDs tecnicos existentes, sem criar enum novo.
- Incluir o caso de uso de midia kit e rate card para creators usando o ID `OrcamentoSimplificado`.

## Fora do escopo

- Alterar enum/contrato da API.
- Criar migracao de banco.
- Criar upload de imagens por template.
- Alterar fluxo de criacao de proposta.
- Implementar aceite digital, tracking, cobranca ou assinatura.

## Criterios de aceite

- A galeria nao deve exibir templates redundantes removidos da curadoria.
- Cada template ativo deve ter nome e descricao orientados a caso de uso.
- A galeria deve mostrar: Orcamento rapido WhatsApp, Proposta comercial completa, Social media mensal, Reels/UGC, Midia kit/rate card, Trafego pago, Design/identidade, Consultoria/diagnostico e Agencia growth board.
- Templates voltados a social media, creator/UGC, midia kit, trafego, identidade visual, consultoria e agencia devem ter elemento visual proprio.
- Templates removidos da galeria ainda devem ser aceitos pelo normalizador e renderizar quando existentes em dados antigos.
- O app web deve passar em validacao de build/lint disponivel.
