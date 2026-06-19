# Spec - Curadoria de templates de orçamento para serviços digitais

## Objetivo

Melhorar a galeria e a aparência dos templates de orçamento para vender melhor serviços digitais, removendo opções redundantes da seleção e adicionando layouts com linguagem visual específica do ramo.

## Escopo

- Atualizar a lista de templates selecionáveis.
- Renomear templates ativos para usos reais do público-alvo.
- Melhorar títulos, subtítulos e CTAs dos documentos.
- Adicionar blocos visuais SVG/CSS aos templates ativos.
- Manter compatibilidade de renderização para templates antigos.

## Fora do escopo

- Alterar enum/contrato da API.
- Criar migração de banco.
- Criar upload de imagens por template.
- Alterar fluxo de criação de proposta.

## Critérios de aceite

- A galeria não deve exibir templates redundantes removidos da curadoria.
- Cada template ativo deve ter nome e descrição orientados a caso de uso.
- Templates voltados a social media, tráfego, identidade visual, consultoria e agência devem ter elemento visual próprio.
- Propostas antigas com templates desativados ainda devem renderizar.
- O app web deve passar em validação de build/lint disponível.
