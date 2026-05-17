# Spec - Polimento layout SaaS pelo prototipo Lovable

## Objetivo

Refatorar a interface web do Emprely Orcamentos para ficar mais alinhada ao prototipo `https://emprely.lovable.app/`, priorizando simplicidade, velocidade de criacao de proposta e leitura visual.

## Escopo

- Trocar a estrutura autenticada para sidebar + topbar de workspace + conteudo.
- Reduzir a presenca do card de sessao no fluxo principal.
- Ajustar dashboard para hero, quatro metricas e tabela de propostas recentes.
- Melhorar cards/listagens, cabecalhos, CTA principal e estados visuais.
- Reforcar responsividade de desktop e mobile.

## Fora do escopo

- Alteracoes de dominio ou endpoints.
- Nova feature de pagamento/plano.
- Copiar literalmente a marca PropostaZap.

## Criterios de aceite

- Layout autenticado lembra claramente o prototipo: sidebar clara, topbar compacta, fundo suave e cards/tabelas limpos.
- Dashboard tem CTA principal para criar proposta e metricas parecidas com os prints.
- Telas de clientes, servicos e propostas mantem cadastro simples e listagem com busca/paginacao.
- Nenhum texto importante estoura container em desktop/mobile.
- `pnpm lint:web`, `pnpm build:web` e e2e web devem passar.

