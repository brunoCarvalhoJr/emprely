# Analise Web - Polimento layout pelo prototipo Lovable

## Contexto

O app web deve ser uma ferramenta SaaS real, nao uma landing. O prototipo de referencia mostra um produto operacional para propostas com sidebar, topbar compacta, dashboard objetivo e telas internas sem excesso de explicacao.

## Ajustes necessarios

- Refatorar o shell autenticado para parecer mais com o prototipo.
- Usar a logo Emprely no topo da sidebar e negocio do usuario no rodape lateral.
- Manter marca do negocio do usuario no topo quando houver logomarca configurada.
- Trocar metricas do dashboard para quatro cards mais proximos do prototipo.
- Remover redundancias visuais que atrasam a acao principal.
- Melhorar consistencia de cards, tabelas, botoes e filtros.

## Riscos

- Alterar texto visual pode exigir ajuste em teste e2e.
- Como `App.tsx` concentra muita UI, as mudancas devem ser pontuais para evitar regressao de fluxo.

