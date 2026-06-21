# Analise - Correcoes UX/layout do fluxo completo Chrome

## Contexto

Relatorio base: `docs/testing/resultados/2026-06-20-relatorio-ux-layout-fluxo-completo-chrome.md`.

A bateria assistida no Chrome validou o fluxo SaaS principal e uma passada no admin. O fluxo funciona, mas os achados P0/P1 afetam confianca comercial, operacao beta e automacao.

## Problemas priorizados

1. Campos monetarios interpretam valores digitados como centavos: `1500` vira `R$ 15,00`.
2. Admin autenticado pode ficar com metricas/tabelas vazias sem estado de erro ou vazio claro.
3. Formularios administrativos aceitam autofill de credenciais pessoais do Chrome.
4. Wizard de proposta mostra 4 etapas antes da selecao de cliente e 6 depois.
5. Copy pt-BR tem textos sem acento e pluralizacao em ingles.
6. Campos e botoes criticos têm nomes repetidos, dificultando testes e acessibilidade.
7. Listagens exibem observacoes longas sem truncamento.

## Escopo desta implementacao

- Ajustar parsing/mascara monetaria no front-end para entrada natural em reais.
- Padronizar wizard para 6 etapas desde o inicio.
- Melhorar labels/aria-label/data-testid em comandos e campos criticos.
- Corrigir strings visiveis pt-BR mais relevantes.
- Reduzir risco de autofill em admin com autocomplete apropriado.
- Exibir estados vazios/erro no admin de forma mais clara.
- Truncar observacoes em listagens principais.

## Fora de escopo

- Alterar API/backend admin.
- Implementar endpoint QA cleanup.
- Redesenhar visual completo mobile.
- Reescrever suite E2E inteira.

## Riscos

- Mudanca de parser monetario pode afetar testes existentes que assumem entrada por centavos.
- Ajustes de labels podem exigir atualizar testes E2E.
- Admin vazio pode ser falha real da API; o front deve evidenciar, nao mascarar.

