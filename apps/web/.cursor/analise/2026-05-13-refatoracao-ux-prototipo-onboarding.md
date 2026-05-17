# Analise Web - Refatoracao UX pelo prototipo

## Contexto

O prototipo `emprely.lovable.app` mostra um SaaS mais simples: sidebar clara, dashboard focado em criar proposta, tabelas compactas, cards de servico e configuracoes de identidade. O app atual precisa seguir essa direcao sem perder os fluxos funcionais.

## Objetivo da tela/fluxo

Melhorar o caminho principal: cadastrar cliente/servico e criar orcamento rapidamente, com menos ruido visual e listagens escalaveis.

## Rotas impactadas

- `/`: SPA inteira.

## Componentes impactados

- Shell principal e navegacao.
- Dashboard.
- Clientes.
- Servicos.
- Propostas.
- Conta/perfil.
- Preview de proposta.
- Inputs e botoes base.

## Formularios e validacao

- Manter Zod atual.
- `logoUrl` deve aceitar URL ou data URL gerada por upload.
- Upload de logo deve validar tipo `image/*`.

## Dados e chamadas de API

- Mesmas queries/mutations.
- `PUT /api/account/profile` passa a receber `LogoUrl` maior quando for data URL.

## Responsividade e acessibilidade

- Sidebar vira navegacao compacta em mobile.
- Paginacao deve ser usavel por teclado.
- Modal de sugestao de logo deve ter botoes claros para aplicar ou cancelar.
- Sem sobreposicao de textos em cards/tabelas.

## Duvidas

- Nenhuma duvida bloqueante.
